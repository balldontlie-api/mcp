import { Config, QueryEntry } from "./types.js";

function trustProxyHops(nodeEnvironment: string): 0 | 1 {
  const configured = process.env.TRUST_PROXY_HOPS;
  if (configured === undefined) return nodeEnvironment === "production" ? 1 : 0;
  if (configured === "0") return 0;
  if (configured === "1") return 1;
  throw new Error("TRUST_PROXY_HOPS must be exactly 0 or 1");
}

export class ConfigManager {
  static load(): Config {
    const nodeEnvironment = process.env.NODE_ENV || "production";
    const config: Config = {
      BACKEND_API_URL:
        process.env.BACKEND_API_URL || "https://api.balldontlie.io",
      API_TIMEOUT: Number.parseInt(process.env.API_TIMEOUT || "30000", 10),
      LOG_LEVEL: process.env.LOG_LEVEL || "info",
      NODE_ENV: nodeEnvironment,
      ENABLE_DEBUG: process.env.ENABLE_DEBUG === "true",
      ENABLE_SENSITIVE_ACCOUNT_TOOLS:
        process.env.ENABLE_SENSITIVE_ACCOUNT_TOOLS === "true",
      TRUST_PROXY_HOPS: trustProxyHops(nodeEnvironment),
    };

    try {
      const backendUrl = new URL(config.BACKEND_API_URL);
      if (config.NODE_ENV === "production" && backendUrl.protocol !== "https:") {
        throw new Error("insecure backend URL");
      }
    } catch {
      throw new Error(
        "BACKEND_API_URL must be a valid HTTPS URL in production",
      );
    }
    if (!Number.isFinite(config.API_TIMEOUT) || config.API_TIMEOUT <= 0) {
      throw new Error("API_TIMEOUT must be a positive integer");
    }
    return config;
  }
}

export function normalizeAuthorizationApiKey(
  authorization?: string | null,
): string | null {
  const header = authorization?.trim();
  if (!header) return null;
  const bearerMatch = /^Bearer(?:\s+(.+))?$/i.exec(header);
  if (bearerMatch) return bearerMatch[1]?.trim() || null;
  return header;
}

export function buildQueryString(entries: QueryEntry[]): string {
  return entries
    .map(
      ({ name, value }) =>
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}
