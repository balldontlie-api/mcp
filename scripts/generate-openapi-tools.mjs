#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import * as YAML from "js-yaml";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isEntrypoint = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
const checkOnly = isEntrypoint && process.argv.includes("--check");
const unexpectedArguments = process.argv.slice(2).filter((argument) => argument !== "--check");
if (isEntrypoint && unexpectedArguments.length > 0) {
  throw new Error(`Unsupported arguments: ${unexpectedArguments.join(", ")}`);
}

const sourceInfo = readJson("scripts/openapi-source.json");
const legacyManifest = readJson("scripts/legacy-tool-names.json");
const legacyNames = legacyManifest.names;

const componentConfigs = [
  { component: "account", toolFile: "account", schemaFile: "account-schemas", exportName: "accountOperations", factoryName: "createAccountTools" },
  { component: "atp", toolFile: "atp", schemaFile: "atp-schemas", exportName: "atpOperations", factoryName: "createATPTools" },
  { component: "bundesliga", toolFile: "bundesliga", soccer: true, factoryName: "createBundesligaTools" },
  { component: "cbb", toolFile: "cbb", schemaFile: "cbb-schemas", exportName: "cbbOperations", factoryName: "createCBBTools" },
  { component: "cs", toolFile: "cs2", schemaFile: "cs2-schemas", exportName: "cs2Operations", factoryName: "createCS2Tools" },
  { component: "dota", toolFile: "dota", schemaFile: "dota-schemas", exportName: "dotaOperations", factoryName: "createDotaTools" },
  { component: "epl", toolFile: "epl", soccer: true, factoryName: "createEPLTools" },
  { component: "f1", toolFile: "f1", schemaFile: "f1-schemas", exportName: "f1Operations", factoryName: "createF1Tools" },
  { component: "fifa", toolFile: "fifa", schemaFile: "fifa-schemas", exportName: "fifaOperations", factoryName: "createFIFATools" },
  { component: "laliga", toolFile: "laliga", soccer: true, factoryName: "createLaLigaTools" },
  { component: "ligue1", toolFile: "ligue1", soccer: true, factoryName: "createLigue1Tools" },
  { component: "lol", toolFile: "lol", schemaFile: "lol-schemas", exportName: "lolOperations", factoryName: "createLOLTools" },
  { component: "mlb", toolFile: "mlb", schemaFile: "mlb-schemas", exportName: "mlbOperations", factoryName: "createMLBTools" },
  { component: "mls", toolFile: "mls", soccer: true, factoryName: "createMLSTools" },
  { component: "mma", toolFile: "mma", schemaFile: "mma-schemas", exportName: "mmaOperations", factoryName: "createMMATools" },
  { component: "nba", toolFile: "nba", schemaFile: "nba-schemas", exportName: "nbaOperations", factoryName: "createNBATools" },
  { component: "ncaab", toolFile: "ncaab", schemaFile: "ncaab-schemas", exportName: "ncaabOperations", factoryName: "createNCAABTools" },
  { component: "ncaaf", toolFile: "ncaaf", schemaFile: "ncaaf-schemas", exportName: "ncaafOperations", factoryName: "createNCAAFTools" },
  { component: "ncaaw", toolFile: "ncaaw", schemaFile: "ncaaw-schemas", exportName: "ncaawOperations", factoryName: "createNCAAWTools" },
  { component: "nfl", toolFile: "nfl", schemaFile: "nfl-schemas", exportName: "nflOperations", factoryName: "createNFLTools" },
  { component: "nhl", toolFile: "nhl", schemaFile: "nhl-schemas", exportName: "nhlOperations", factoryName: "createNHLTools" },
  { component: "pga", toolFile: "pga", schemaFile: "pga-schemas", exportName: "pgaOperations", factoryName: "createPGATools" },
  { component: "seriea", toolFile: "seriea", soccer: true, factoryName: "createSerieATools" },
  { component: "ucl", toolFile: "ucl", soccer: true, factoryName: "createUCLTools" },
  { component: "valorant", toolFile: "valorant", schemaFile: "valorant-schemas", exportName: "valorantOperations", factoryName: "createValorantTools" },
  { component: "wnba", toolFile: "wnba", schemaFile: "wnba-schemas", exportName: "wnbaOperations", factoryName: "createWNBATools" },
  { component: "wta", toolFile: "wta", schemaFile: "wta-schemas", exportName: "wtaOperations", factoryName: "createWTATools" },
];

const accountNames = {
  "POST /account/v1/signup": "account_signup",
  "GET /account/v1/me": "account_get_me",
  "POST /account/v1/api-key/rotate": "account_rotate_api_key",
  "GET /account/v1/subscriptions": "account_get_subscriptions",
  "POST /account/v1/subscriptions": "account_change_subscription",
  "DELETE /account/v1/subscriptions/{type}": "account_cancel_subscription",
  "GET /account/v1/plans": "account_get_plans",
  "GET /account/v1/plans/{sport}": "account_get_plans_by_sport",
  "POST /account/v1/billing/checkout": "account_create_checkout",
  "GET /account/v1/billing/portal": "account_get_billing_portal",
};

const publicNameAliases = {
  "GET /nba/v1/season_averages/{type}|path|type": "category",
};

const sensitiveOperationKeys = new Set([
  "POST /account/v1/signup",
  "POST /account/v1/api-key/rotate",
  "POST /account/v1/subscriptions",
  "DELETE /account/v1/subscriptions/{type}",
  "POST /account/v1/billing/checkout",
  "GET /account/v1/billing/portal",
]);

const destructiveOperationKeys = new Set([
  "POST /account/v1/api-key/rotate",
  "POST /account/v1/subscriptions",
  "DELETE /account/v1/subscriptions/{type}",
]);

const sensitiveResponseUrlFields = {
  "POST /account/v1/billing/checkout": ["checkout_url"],
  "GET /account/v1/billing/portal": ["portal_url"],
};

const schemaKeywords = new Set([
  "type", "title", "description", "enum", "const", "default", "examples", "example", "format",
  "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf",
  "minLength", "maxLength", "pattern", "minItems", "maxItems", "uniqueItems",
  "minProperties", "maxProperties", "items", "prefixItems", "properties", "required",
  "additionalProperties", "oneOf", "anyOf", "allOf", "not", "nullable", "deprecated",
  "readOnly", "writeOnly",
]);

const generatedHeader = (sourceLabel) => `// Generated by scripts/generate-openapi-tools.mjs from ${sourceLabel}\n// BALLDONTLIE API source commit: ${sourceInfo.commit}\n// DO NOT EDIT BY HAND.\n\n`;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8"));
}

function readYaml(relativePath) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const document = YAML.load(fs.readFileSync(absolutePath, "utf8"));
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new Error(`${relativePath} did not parse to an OpenAPI object`);
  }
  return document;
}

function resolvePointer(document, reference) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) {
    throw new Error(`Only local OpenAPI references are supported, received ${reference}`);
  }
  const segments = reference.slice(2).split("/").map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
  let value = document;
  for (const segment of segments) {
    value = value?.[segment];
    if (value === undefined) throw new Error(`Unresolved OpenAPI reference ${reference}`);
  }
  return value;
}

function resolveReferenceObject(value, document, kind) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid ${kind} object`);
  }
  if (!value.$ref) return value;
  const resolved = resolvePointer(document, value.$ref);
  const siblings = Object.fromEntries(Object.entries(value).filter(([key]) => key !== "$ref"));
  return { ...resolved, ...siblings };
}

function resolveSchema(schema, document, referenceStack = []) {
  if (typeof schema === "boolean") return schema;
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    throw new Error("Input schema must be an object or boolean");
  }
  if (schema.$ref) {
    if (referenceStack.includes(schema.$ref)) {
      throw new Error(`Cyclic input schema reference ${[...referenceStack, schema.$ref].join(" -> ")}`);
    }
    const resolved = resolvePointer(document, schema.$ref);
    const siblings = Object.fromEntries(Object.entries(schema).filter(([key]) => key !== "$ref"));
    return {
      ...resolveSchema(resolved, document, [...referenceStack, schema.$ref]),
      ...resolveSchema(siblings, document, referenceStack),
    };
  }

  const result = {};
  for (const [key, value] of Object.entries(schema)) {
    if (!schemaKeywords.has(key) && !key.startsWith("x-")) continue;
    if (key === "properties") {
      result.properties = Object.fromEntries(
        Object.entries(value ?? {}).map(([propertyName, propertySchema]) => [propertyName, resolveSchema(propertySchema, document, referenceStack)]),
      );
    } else if (["items", "not", "additionalProperties"].includes(key) && typeof value === "object" && value !== null) {
      result[key] = resolveSchema(value, document, referenceStack);
    } else if (["oneOf", "anyOf", "allOf", "prefixItems"].includes(key)) {
      result[key] = value.map((entry) => resolveSchema(entry, document, referenceStack));
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function effectiveSecurity(operation, document, operationKey) {
  const security = Object.prototype.hasOwnProperty.call(operation, "security") ? operation.security : document.security;
  if (!Array.isArray(security)) throw new Error(`${operationKey} has missing or invalid effective security`);
  if (security.length === 0) return "public";
  if (security.length !== 1 || !security[0] || typeof security[0] !== "object" || Array.isArray(security[0])) {
    throw new Error(`${operationKey} has ambiguous or unsupported effective security`);
  }
  const entries = Object.entries(security[0]);
  if (
    entries.length !== 1 ||
    entries[0][0] !== "ApiKeyAuth" ||
    !Array.isArray(entries[0][1]) ||
    entries[0][1].length !== 0
  ) {
    throw new Error(`${operationKey} uses an unsupported security scheme`);
  }
  return "apiKey";
}

function validateApiKeyScheme(document, component) {
  const scheme = document.components?.securitySchemes?.ApiKeyAuth;
  if (
    !scheme ||
    scheme.type !== "apiKey" ||
    scheme.in !== "header" ||
    scheme.name !== "Authorization"
  ) {
    throw new Error(`${component} must define ApiKeyAuth as the Authorization header`);
  }
}

function normalizedPublicName(wireName) {
  const withoutBrackets = wireName.replace(/\[\]$/, "");
  const normalized = withoutBrackets.replace(/[^A-Za-z0-9_]/g, "_");
  if (!normalized || !/^[A-Za-z_]/.test(normalized)) {
    throw new Error(`Cannot derive an MCP property name from ${wireName}`);
  }
  return normalized;
}

function parameterMetadata(parameterValue, document, operationKey) {
  const parameter = resolveReferenceObject(parameterValue, document, "parameter");
  if (!["path", "query"].includes(parameter.in)) {
    throw new Error(`${operationKey} has unsupported ${parameter.in} parameter ${parameter.name}`);
  }
  if (!parameter.schema) throw new Error(`${operationKey} parameter ${parameter.name} has no schema`);
  const schema = resolveSchema(parameter.schema, document);
  if (parameter.description && !schema.description) schema.description = parameter.description;
  const aliasKey = `${operationKey}|${parameter.in}|${parameter.name}`;
  const publicName = publicNameAliases[aliasKey] ?? normalizedPublicName(parameter.name);
  const style = parameter.style ?? (parameter.in === "query" ? "form" : "simple");
  const explode = parameter.explode ?? (style === "form");
  if (parameter.in === "query" && style !== "form") {
    throw new Error(`${operationKey} query parameter ${parameter.name} uses unsupported style ${style}`);
  }
  if (parameter.in === "query" && schema.type === "array" && explode !== true) {
    throw new Error(`${operationKey} array query parameter ${parameter.name} must use form/explode serialization`);
  }
  return {
    publicName,
    wireName: parameter.name,
    location: parameter.in,
    required: parameter.in === "path" ? true : parameter.required === true,
    style,
    explode,
    schema,
  };
}

function bodyMetadata(operation, document, operationKey) {
  if (!operation.requestBody) return [];
  const requestBody = resolveReferenceObject(operation.requestBody, document, "request body");
  const contentTypes = Object.keys(requestBody.content ?? {});
  if (contentTypes.length !== 1 || contentTypes[0] !== "application/json") {
    throw new Error(`${operationKey} uses unsupported request media types: ${contentTypes.join(", ")}`);
  }
  const bodySchema = resolveSchema(requestBody.content["application/json"].schema, document);
  if (bodySchema.type !== "object" || !bodySchema.properties) {
    throw new Error(`${operationKey} request body must be an object with properties`);
  }
  const required = new Set(bodySchema.required ?? []);
  return Object.entries(bodySchema.properties).map(([name, schema]) => ({
    publicName: name,
    wireName: name,
    location: "body",
    required: required.has(name),
    style: "json",
    explode: true,
    schema,
  }));
}

function operationDescription(operation, operationKey) {
  const summary = typeof operation.summary === "string" ? operation.summary.trim() : "";
  const details = typeof operation.description === "string" ? operation.description.trim() : "";
  let description = [summary, details && details !== summary ? details : ""].filter(Boolean).join("\n\n");
  description = description
    .replace(/Stripe hosted checkout/gi, "hosted billing checkout")
    .replace(/Stripe billing portal/gi, "hosted billing portal")
    .replace(/Stripe subscription status/gi, "billing subscription status")
    .replace(/\bStripe\b/g, "billing provider");
  if (!description) description = operationKey;
  if (sensitiveOperationKeys.has(operationKey)) {
    description += "\n\nSecurity: this tool is disabled unless ENABLE_SENSITIVE_ACCOUNT_TOOLS is exactly true. Its result may contain credentials or a sensitive billing-session URL.";
  }
  if (operationKey === "GET /account/v1/me") {
    description += "\n\nSecurity: the MCP response omits the api_key field.";
  }
  return description;
}

function snakeCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function deriveToolName(config, method, apiPath, operation) {
  const operationKey = `${method} ${apiPath}`;
  if (legacyNames[operationKey]) return legacyNames[operationKey];
  if (accountNames[operationKey]) return accountNames[operationKey];
  if (operation.operationId) {
    const operationId = snakeCase(operation.operationId);
    if (config.component === "valorant" && operationId.startsWith("get_valorant_")) {
      return `valorant_get_${operationId.slice("get_valorant_".length)}`;
    }
    return `${config.component}_${operationId}`;
  }

  const prefix = config.component === "cs" ? "cs2" : config.component === "epl" ? "epl_v2" : config.component;
  const segments = apiPath.split("/").filter(Boolean);
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const relative = segments.slice(versionIndex >= 0 ? versionIndex + 1 : 1);
  const pathName = relative.map((segment) => {
    const parameterMatch = /^\{(.+)\}$/.exec(segment);
    return parameterMatch ? `by_${normalizedPublicName(parameterMatch[1])}` : snakeCase(segment);
  }).join("_");
  return `${prefix}_${method.toLowerCase()}_${pathName}`;
}

function buildOperation(config, document, apiPath, methodName, pathItem, operation) {
  const method = methodName.toUpperCase();
  const operationKey = `${method} ${apiPath}`;
  const combinedParameters = new Map();
  for (const parameter of [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]) {
    const resolved = resolveReferenceObject(parameter, document, "parameter");
    combinedParameters.set(`${resolved.in}:${resolved.name}`, parameter);
  }
  const parameters = [
    ...Array.from(combinedParameters.values()).map((parameter) => parameterMetadata(parameter, document, operationKey)),
    ...bodyMetadata(operation, document, operationKey),
  ];

  const publicNames = new Map();
  for (const parameter of parameters) {
    if (publicNames.has(parameter.publicName)) {
      throw new Error(`${operationKey} has unaliased MCP input collision ${parameter.publicName}`);
    }
    publicNames.set(parameter.publicName, `${parameter.location}:${parameter.wireName}`);
  }

  const properties = Object.fromEntries(parameters.map((parameter) => [parameter.publicName, parameter.schema]));
  const required = parameters.filter((parameter) => parameter.required).map((parameter) => parameter.publicName);
  const inputSchema = { type: "object", properties, additionalProperties: false };
  if (required.length > 0) inputSchema.required = required;

  const readOnly = method === "GET" && operationKey !== "GET /account/v1/billing/portal";
  return {
    sourceFile: `openapi/${config.component}.yml`,
    operationKey,
    name: deriveToolName(config, method, apiPath, operation),
    title: operation.summary ?? operationKey,
    description: operationDescription(operation, operationKey),
    method,
    path: apiPath,
    inputSchema,
    parameters,
    security: effectiveSecurity(operation, document, operationKey),
    sensitive: sensitiveOperationKeys.has(operationKey),
    redactResponseFields: operationKey === "GET /account/v1/me" ? ["api_key"] : [],
    sensitiveResponseUrlFields: sensitiveResponseUrlFields[operationKey] ?? [],
    annotations: {
      title: operation.summary ?? operationKey,
      readOnlyHint: readOnly,
      destructiveHint: destructiveOperationKeys.has(operationKey),
      idempotentHint: readOnly,
      openWorldHint: true,
    },
  };
}

function buildAllOperations() {
  validateMasterSpec();
  const byComponent = {};
  const operations = [];
  for (const config of componentConfigs) {
    const document = readYaml(`openapi/${config.component}.yml`);
    validateApiKeyScheme(document, config.component);
    if (!document.paths || typeof document.paths !== "object") throw new Error(`${config.component} spec has no paths`);
    const componentOperations = [];
    for (const [apiPath, pathItemValue] of Object.entries(document.paths)) {
      const pathItem = resolveReferenceObject(pathItemValue, document, "path item");
      for (const [methodName, operation] of Object.entries(pathItem)) {
        const lowered = methodName.toLowerCase();
        if (["parameters", "summary", "description", "$ref", "servers"].includes(lowered)) continue;
        if (!["get", "post", "delete"].includes(lowered)) {
          throw new Error(`${methodName.toUpperCase()} ${apiPath} is unsupported`);
        }
        const definition = buildOperation(config, document, apiPath, lowered, pathItem, operation);
        componentOperations.push(definition);
        operations.push(definition);
      }
    }
    byComponent[config.component] = componentOperations;
  }

  const operationKeys = new Set();
  const toolNames = new Set();
  for (const operation of operations) {
    if (operationKeys.has(operation.operationKey)) throw new Error(`Duplicate operation ${operation.operationKey}`);
    if (toolNames.has(operation.name)) throw new Error(`Duplicate tool name ${operation.name}`);
    operationKeys.add(operation.operationKey);
    toolNames.add(operation.name);
  }
  for (const [operationKey, legacyName] of Object.entries(legacyNames)) {
    if (!operationKeys.has(operationKey)) throw new Error(`Legacy tool ${legacyName} lost operation ${operationKey}`);
    const actual = operations.find((operation) => operation.operationKey === operationKey)?.name;
    if (actual !== legacyName) throw new Error(`Legacy tool ${legacyName} became ${actual}`);
  }
  return { byComponent, operations };
}

export function validateMasterSpec() {
  const master = readYaml("openapi.yml");
  validateApiKeyScheme(master, "openapi.yml");

  const configuredFiles = componentConfigs
    .map(({ component }) => `${component}.yml`)
    .sort();
  const vendoredFiles = fs
    .readdirSync(path.join(repositoryRoot, "openapi"))
    .filter((name) => name.endsWith(".yml"))
    .sort();
  if (JSON.stringify(vendoredFiles) !== JSON.stringify(configuredFiles)) {
    throw new Error(
      `Configured OpenAPI components do not match vendored files: configured=${configuredFiles.join(",")} vendored=${vendoredFiles.join(",")}`,
    );
  }

  const advertisedFiles = Array.from(
    new Set(
      Array.from(
        String(master.info?.description ?? "").matchAll(/openapi\/([a-z0-9]+\.yml)/g),
        (match) => match[1],
      ),
    ),
  ).sort();
  if (JSON.stringify(advertisedFiles) !== JSON.stringify(configuredFiles)) {
    throw new Error(
      `Master OpenAPI component links do not match configured files: advertised=${advertisedFiles.join(",")} configured=${configuredFiles.join(",")}`,
    );
  }

  const documents = new Map();
  for (const [apiPath, pathItem] of Object.entries(master.paths ?? {})) {
    if (
      !pathItem ||
      typeof pathItem !== "object" ||
      Array.isArray(pathItem) ||
      Object.keys(pathItem).length !== 1 ||
      typeof pathItem.$ref !== "string"
    ) {
      throw new Error(`Master OpenAPI path ${apiPath} must contain one external reference`);
    }
    const match = /^openapi\/([a-z0-9]+\.yml)(#\/.*)$/.exec(pathItem.$ref);
    if (!match || !configuredFiles.includes(match[1])) {
      throw new Error(`Master OpenAPI path ${apiPath} has unsupported reference ${pathItem.$ref}`);
    }
    const expectedFragment = `#/paths/${apiPath.replace(/~/g, "~0").replace(/\//g, "~1")}`;
    if (match[2] !== expectedFragment) {
      throw new Error(
        `Master OpenAPI path ${apiPath} references ${match[2]} instead of ${expectedFragment}`,
      );
    }
    let document = documents.get(match[1]);
    if (!document) {
      document = readYaml(`openapi/${match[1]}`);
      documents.set(match[1], document);
    }
    resolvePointer(document, match[2]);
  }
}

function schemaModule(exportName, operations, sourceLabel) {
  return `${generatedHeader(sourceLabel)}import type { GeneratedOperationDefinition } from "../types.js";\n\nexport const ${exportName} = ${JSON.stringify(operations, null, 2)} satisfies GeneratedOperationDefinition[];\n`;
}

function toolModule(config) {
  const sourceImport = config.soccer
    ? `import { soccerOperations } from "../schemas/soccer-schemas.js";`
    : `import { ${config.exportName} } from "../schemas/${config.schemaFile}.js";`;
  const operationsExpression = config.soccer ? `soccerOperations.${config.component}` : config.exportName;
  return `${generatedHeader(`openapi/${config.component}.yml`)}import type { APIClient } from "../client.js";\nimport type { MCPTool, ToolFactoryOptions } from "../types.js";\nimport { createToolsFromDefinitions } from "../tool-factory.js";\n${sourceImport}\n\nexport function ${config.factoryName}(apiClient: APIClient, options: ToolFactoryOptions = {}): MCPTool[] {\n  return createToolsFromDefinitions(${operationsExpression}, apiClient, options);\n}\n`;
}

function operationRegistryModule() {
  const imports = [];
  const expressions = [];
  for (const config of componentConfigs) {
    if (config.soccer) continue;
    imports.push(`import { ${config.exportName} } from "./schemas/${config.schemaFile}.js";`);
    expressions.push(`...${config.exportName}`);
  }
  imports.push(`import { soccerOperations } from "./schemas/soccer-schemas.js";`);
  for (const config of componentConfigs.filter((entry) => entry.soccer)) expressions.push(`...soccerOperations.${config.component}`);
  return `${generatedHeader("all vendored component specs")}import type { GeneratedOperationDefinition } from "./types.js";\n${imports.join("\n")}\n\nexport const allOperationDefinitions: GeneratedOperationDefinition[] = [\n  ${expressions.join(",\n  ")},\n];\n`;
}

function toolRegistryModule() {
  const imports = componentConfigs.map((config) => `import { ${config.factoryName} } from "./tools/${config.toolFile}.js";`);
  const calls = componentConfigs.map((config) => `...${config.factoryName}(apiClient, options)`);
  return `${generatedHeader("all vendored component specs")}import type { APIClient } from "./client.js";\nimport type { MCPTool, ToolFactoryOptions } from "./types.js";\n${imports.join("\n")}\n\nexport function createAllTools(apiClient: APIClient, options: ToolFactoryOptions = {}): MCPTool[] {\n  return [\n    ${calls.join(",\n    ")},\n  ];\n}\n`;
}

function expectedFiles(byComponent) {
  const files = new Map();
  const soccerOperations = {};
  for (const config of componentConfigs) {
    files.set(`src/tools/${config.toolFile}.ts`, toolModule(config));
    if (config.soccer) {
      soccerOperations[config.component] = byComponent[config.component];
    } else {
      files.set(`src/schemas/${config.schemaFile}.ts`, schemaModule(config.exportName, byComponent[config.component], `openapi/${config.component}.yml`));
    }
  }
  files.set(
    "src/schemas/soccer-schemas.ts",
    `${generatedHeader("openapi/{bundesliga,epl,laliga,ligue1,mls,seriea,ucl}.yml")}import type { GeneratedOperationDefinition } from "../types.js";\n\nexport const soccerOperations = ${JSON.stringify(soccerOperations, null, 2)} satisfies Record<string, GeneratedOperationDefinition[]>;\n`,
  );
  files.set("src/operation-registry.ts", operationRegistryModule());
  files.set("src/tool-registry.ts", toolRegistryModule());
  return files;
}

function main() {
  const { byComponent, operations } = buildAllOperations();
  const files = expectedFiles(byComponent);
  const mismatches = [];
  for (const [relativePath, content] of files) {
    const absolutePath = path.join(repositoryRoot, relativePath);
    if (checkOnly) {
      const actual = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : null;
      if (actual !== content) mismatches.push(relativePath);
    } else {
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, content);
    }
  }

  if (mismatches.length > 0) {
    console.error(`Generated OpenAPI files are stale:\n${mismatches.map((file) => `- ${file}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    const publicCount = operations.filter((operation) => operation.security === "public").length;
    console.log(`${checkOnly ? "Verified" : "Generated"} ${operations.length} tools from ${componentConfigs.length} specs (${publicCount} public API operations; ${Object.keys(legacyNames).length} legacy names preserved).`);
  }
}

if (isEntrypoint) main();
