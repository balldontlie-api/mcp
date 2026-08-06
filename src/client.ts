import axios, { AxiosInstance, AxiosResponse } from "axios";
import { SafeAPIError } from "./errors.js";
import { APIRequest, APIResponse, Config } from "./types.js";
import { buildQueryString } from "./utils.js";
import { SERVER_VERSION } from "./version.js";

const ACCOUNT_ERROR_MESSAGES: Record<string, string> = {
  payment_method_required: "A payment method is required to complete this request.",
  payment_failed: "The payment request could not be completed.",
  invalid_sport: "The requested sport or product is invalid.",
  invalid_tier: "The requested subscription tier is invalid.",
  legacy_plan_unavailable: "The requested legacy plan is unavailable.",
  missing_fields: "Required request fields are missing.",
  subscription_not_found: "The requested subscription was not found.",
  email_taken: "An account already exists for that email address.",
  all_access_includes_storystats:
    "The active all-access subscription already includes that product.",
};

function stripeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    const stripeHost =
      parsed.hostname === "stripe.com" || parsed.hostname.endsWith(".stripe.com");
    return parsed.protocol === "https:" &&
      parsed.port === "" &&
      parsed.username === "" &&
      parsed.password === "" &&
      stripeHost
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function businessErrorData(
  data: unknown,
  allowSensitiveDetails: boolean,
): { code: string; message: string; details?: Record<string, string> } {
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const nested =
    root.error && typeof root.error === "object"
      ? (root.error as Record<string, unknown>)
      : root;
  const rawCode = nested.code;
  const code =
    typeof rawCode === "string" &&
    Object.prototype.hasOwnProperty.call(ACCOUNT_ERROR_MESSAGES, rawCode)
      ? rawCode
      : "request_rejected";
  const details: Record<string, string> = {};
  if (allowSensitiveDetails) {
    for (const field of ["payment_url", "portal_url"]) {
      const safeUrl = stripeUrl(nested[field]);
      if (safeUrl) details[field] = safeUrl;
    }
  }
  return {
    code,
    message:
      ACCOUNT_ERROR_MESSAGES[code] || "The BALLDONTLIE API rejected the request.",
    ...(Object.keys(details).length > 0 ? { details } : {}),
  };
}

export class APIClient {
  private readonly client: AxiosInstance;
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.BACKEND_API_URL,
      timeout: config.API_TIMEOUT,
      maxRedirects: 0,
      proxy: false,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `BALLDONTLIE-MCP-Server/${SERVER_VERSION}`,
      },
    });
  }

  async request(request: APIRequest): Promise<APIResponse> {
    const url = this.buildURL(request.endpoint, request.query);
    if (this.config.ENABLE_DEBUG) {
      // Deliberately excludes query values, headers, bodies, and responses.
      console.error(
        `BALLDONTLIE request ${request.method} ${request.endpoint} query_fields=${request.query?.length ?? 0}`,
      );
    }

    try {
      const response: AxiosResponse = await this.client.request({
        url,
        method: request.method,
        headers: request.headers,
        ...(request.body === undefined ? {} : { data: request.body }),
      });
      return this.validateSensitiveResponseUrls(
        this.handleResponse(response),
        request.sensitiveResponseUrlFields ?? [],
      );
    } catch (error) {
      throw this.sanitizeError(error, request.allowSensitiveDetails === true);
    }
  }

  async validateApiKey(authorization: string): Promise<boolean> {
    try {
      await this.request({
        endpoint: "/account/v1/me",
        method: "GET",
        headers: { Authorization: authorization },
      });
      return true;
    } catch (error) {
      if (error instanceof SafeAPIError && error.category === "authorization") {
        return false;
      }
      throw error;
    }
  }

  private buildURL(endpoint: string, query?: APIRequest["query"]): string {
    if (!query || query.length === 0) return endpoint;
    return `${endpoint}?${buildQueryString(query)}`;
  }

  private handleResponse(response: AxiosResponse): APIResponse {
    const payload = response.data;
    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      return {
        data: Object.prototype.hasOwnProperty.call(record, "data")
          ? record.data
          : payload,
        ...(record.meta && typeof record.meta === "object"
          ? { meta: record.meta as APIResponse["meta"] }
          : {}),
      };
    }
    return { data: payload };
  }

  private validateSensitiveResponseUrls(
    response: APIResponse,
    fields: string[],
  ): APIResponse {
    if (fields.length === 0) return response;
    const data =
      response.data && typeof response.data === "object" && !Array.isArray(response.data)
        ? (response.data as Record<string, unknown>)
        : null;
    const normalizedData = data ? { ...data } : null;
    for (const field of fields) {
      const safeUrl = data ? stripeUrl(data[field]) : null;
      if (!safeUrl || !normalizedData) {
        throw new SafeAPIError(
          "availability",
          "invalid_sensitive_response",
          "The billing provider returned an invalid session URL.",
          502,
        );
      }
      normalizedData[field] = safeUrl;
    }
    return { ...response, data: normalizedData };
  }

  private sanitizeError(error: unknown, allowSensitiveDetails: boolean): SafeAPIError {
    if (error instanceof SafeAPIError) return error;
    if (!axios.isAxiosError(error)) {
      return new SafeAPIError(
        "availability",
        "api_unavailable",
        "The BALLDONTLIE API is temporarily unavailable.",
        503,
      );
    }

    const status = error.response?.status;
    if (status === 401) {
      return new SafeAPIError(
        "authorization",
        "authorization_failed",
        "The BALLDONTLIE API key was rejected.",
        401,
      );
    }
    if (status === 429) {
      return new SafeAPIError(
        "rate_limit",
        "api_rate_limited",
        "The BALLDONTLIE API rate limit was reached.",
        429,
      );
    }
    if (status !== undefined && status >= 400 && status < 500) {
      const business = businessErrorData(error.response?.data, allowSensitiveDetails);
      return new SafeAPIError(
        "business",
        business.code,
        business.message,
        status,
        business.details,
      );
    }
    return new SafeAPIError(
      "availability",
      "api_unavailable",
      "The BALLDONTLIE API is temporarily unavailable.",
      status && status >= 500 ? status : 503,
    );
  }
}
