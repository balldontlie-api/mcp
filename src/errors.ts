export type SafeErrorCategory =
  | "authorization"
  | "rate_limit"
  | "business"
  | "availability";

export interface SafeErrorPayload {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, string>;
}

/**
 * An error that is safe to return to an MCP caller. It deliberately never
 * retains an Axios error, request configuration, headers, body, or raw API
 * response.
 */
export class SafeAPIError extends Error {
  readonly category: SafeErrorCategory;
  readonly statusCode?: number;
  readonly publicCode: string;
  readonly safeDetails?: Record<string, string>;

  constructor(
    category: SafeErrorCategory,
    publicCode: string,
    message: string,
    statusCode?: number,
    safeDetails?: Record<string, string>,
  ) {
    super(message);
    this.name = "SafeAPIError";
    this.category = category;
    this.publicCode = publicCode;
    this.statusCode = statusCode;
    this.safeDetails = safeDetails;
  }

  toPublicPayload(): SafeErrorPayload {
    return {
      code: this.publicCode,
      message: this.message,
      ...(this.statusCode === undefined ? {} : { status: this.statusCode }),
      ...(this.safeDetails ? { details: this.safeDetails } : {}),
    };
  }
}

export function toSafeAPIError(error: unknown): SafeAPIError {
  if (error instanceof SafeAPIError) return error;
  return new SafeAPIError(
    "availability",
    "api_unavailable",
    "The BALLDONTLIE API is temporarily unavailable.",
    503,
  );
}
