export type HTTPMethod = "GET" | "POST" | "DELETE";
export type ParameterLocation = "path" | "query" | "body";
export type OperationSecurity = "apiKey" | "public";

export interface Config {
  BACKEND_API_URL: string;
  API_TIMEOUT: number;
  LOG_LEVEL: string;
  NODE_ENV: string;
  ENABLE_DEBUG: boolean;
  ENABLE_SENSITIVE_ACCOUNT_TOOLS: boolean;
  TRUST_PROXY_HOPS: 0 | 1;
}

export interface QueryEntry {
  name: string;
  value: string;
}

export interface APIRequest {
  endpoint: string;
  method: HTTPMethod;
  query?: QueryEntry[];
  headers?: Record<string, string>;
  body?: unknown;
  allowSensitiveDetails?: boolean;
  sensitiveResponseUrlFields?: string[];
}

export interface APIResponse {
  data: unknown;
  meta?: {
    next_cursor?: number;
    per_page?: number;
  };
}

export interface JSONSchema {
  type: string | string[];
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: unknown;
  [key: string]: unknown;
}

export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export interface GeneratedParameterDefinition {
  publicName: string;
  wireName: string;
  location: ParameterLocation;
  required: boolean;
  style: "simple" | "form" | "json";
  explode: boolean;
  schema: JSONSchema | Record<string, unknown>;
}

export interface GeneratedOperationDefinition {
  sourceFile: string;
  operationKey: string;
  name: string;
  title: string;
  description: string;
  method: HTTPMethod;
  path: string;
  inputSchema: JSONSchema;
  parameters: GeneratedParameterDefinition[];
  security: OperationSecurity;
  sensitive: boolean;
  redactResponseFields: string[];
  sensitiveResponseUrlFields: string[];
  annotations: ToolAnnotations;
}

export interface ToolFactoryOptions {
  enableSensitiveAccountTools?: boolean;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  annotations?: ToolAnnotations;
  definition: GeneratedOperationDefinition;
  handler: (params: Record<string, unknown>, headers?: Record<string, string>) => Promise<APIResponse>;
}

export interface MCPError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
