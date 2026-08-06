import type { APIClient } from "./client.js";
import { SafeAPIError } from "./errors.js";
import type {
  APIResponse,
  GeneratedOperationDefinition,
  GeneratedParameterDefinition,
  MCPTool,
  QueryEntry,
  ToolFactoryOptions,
} from "./types.js";

function invalidArguments(message: string): never {
  throw new SafeAPIError(
    "business",
    "invalid_tool_arguments",
    message,
    400,
  );
}

function scalarString(value: unknown, parameter: GeneratedParameterDefinition): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (["string", "number", "boolean", "bigint"].includes(typeof value)) {
    return String(value);
  }
  return invalidArguments(
    `Tool argument ${parameter.publicName} must be a scalar value.`,
  );
}

function queryEntries(
  parameter: GeneratedParameterDefinition,
  value: unknown,
): QueryEntry[] {
  const expectsArray = parameter.schema.type === "array";
  if (expectsArray) {
    if (!Array.isArray(value)) {
      return invalidArguments(
        `Tool argument ${parameter.publicName} must be an array.`,
      );
    }
    return value
      .filter((item) => item !== undefined && item !== null)
      .map((item) => ({
        name: parameter.wireName,
        value: scalarString(item, parameter),
      }));
  }
  if (Array.isArray(value)) {
    return invalidArguments(
      `Tool argument ${parameter.publicName} must not be an array.`,
    );
  }
  return [{ name: parameter.wireName, value: scalarString(value, parameter) }];
}

function redactFields(value: unknown, fields: ReadonlySet<string>): unknown {
  if (Array.isArray(value)) return value.map((entry) => redactFields(entry, fields));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !fields.has(key))
      .map(([key, entry]) => [key, redactFields(entry, fields)]),
  );
}

async function executeDefinition(
  definition: GeneratedOperationDefinition,
  apiClient: APIClient,
  params: Record<string, unknown>,
  headers: Record<string, string> | undefined,
  options: ToolFactoryOptions,
): Promise<APIResponse> {
  const sensitiveEnabled = options.enableSensitiveAccountTools === true;
  if (definition.sensitive && !sensitiveEnabled) {
    throw new SafeAPIError(
      "business",
      "sensitive_tool_disabled",
      "This sensitive Account tool is disabled by the MCP deployment.",
      403,
    );
  }

  let endpoint = definition.path;
  const query: QueryEntry[] = [];
  const body: Record<string, unknown> = {};
  let hasBody = false;

  for (const parameter of definition.parameters) {
    const value = params[parameter.publicName];
    if (value === undefined || value === null) {
      if (parameter.required) {
        invalidArguments(`Missing required tool argument ${parameter.publicName}.`);
      }
      continue;
    }

    if (parameter.location === "path") {
      const placeholder = `{${parameter.wireName}}`;
      if (!endpoint.includes(placeholder)) {
        throw new SafeAPIError(
          "availability",
          "invalid_generated_route",
          "The generated tool route is unavailable.",
          503,
        );
      }
      endpoint = endpoint.replace(
        placeholder,
        encodeURIComponent(scalarString(value, parameter)),
      );
    } else if (parameter.location === "query") {
      query.push(...queryEntries(parameter, value));
    } else {
      body[parameter.wireName] = value;
      hasBody = true;
    }
  }

  if (/\{[^}]+\}/.test(endpoint)) {
    invalidArguments("A required path argument was not provided.");
  }

  const authorization = headers?.Authorization;
  const response = await apiClient.request({
    endpoint,
    method: definition.method,
    ...(query.length === 0 ? {} : { query }),
    ...(hasBody ? { body } : {}),
    ...(authorization ? { headers: { Authorization: authorization } } : {}),
    allowSensitiveDetails: definition.sensitive && sensitiveEnabled,
    ...(definition.sensitiveResponseUrlFields.length === 0
      ? {}
      : { sensitiveResponseUrlFields: definition.sensitiveResponseUrlFields }),
  });

  if (definition.redactResponseFields.length === 0) return response;
  return redactFields(
    response,
    new Set(definition.redactResponseFields),
  ) as APIResponse;
}

export function createToolsFromDefinitions(
  definitions: GeneratedOperationDefinition[],
  apiClient: APIClient,
  options: ToolFactoryOptions = {},
): MCPTool[] {
  return definitions.map((definition) => ({
    name: definition.name,
    description: definition.description,
    inputSchema: definition.inputSchema,
    annotations: definition.annotations,
    definition,
    handler: (params, headers) =>
      executeDefinition(definition, apiClient, params, headers, options),
  }));
}
