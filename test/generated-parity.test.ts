import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import * as YAML from "js-yaml";
import { allOperationDefinitions } from "../src/operation-registry.js";
import type {
  GeneratedOperationDefinition,
  GeneratedParameterDefinition,
} from "../src/types.js";

type RecordValue = Record<string, any>;

const schemaKeywords = new Set([
  "type", "title", "description", "enum", "const", "default", "examples", "example", "format",
  "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf",
  "minLength", "maxLength", "pattern", "minItems", "maxItems", "uniqueItems",
  "minProperties", "maxProperties", "items", "prefixItems", "properties", "required",
  "additionalProperties", "oneOf", "anyOf", "allOf", "not", "nullable", "deprecated",
  "readOnly", "writeOnly",
]);

function loadYaml(relativePath: string): RecordValue {
  return YAML.load(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")) as RecordValue;
}

function resolvePointer(document: RecordValue, reference: string): any {
  assert.match(reference, /^#\//);
  return reference
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((value, segment) => {
      assert.notEqual(value?.[segment], undefined, `unresolved ref ${reference}`);
      return value[segment];
    }, document as any);
}

function resolveObject(value: RecordValue, document: RecordValue): RecordValue {
  if (!value.$ref) return value;
  const { $ref, ...siblings } = value;
  return { ...resolvePointer(document, $ref), ...siblings };
}

function resolveSchema(
  schema: RecordValue | boolean,
  document: RecordValue,
  stack: string[] = [],
): any {
  if (typeof schema === "boolean") return schema;
  if (schema.$ref) {
    assert.ok(!stack.includes(schema.$ref), `cyclic input ref ${schema.$ref}`);
    const { $ref, ...siblings } = schema;
    return {
      ...resolveSchema(resolvePointer(document, $ref), document, [...stack, $ref]),
      ...resolveSchema(siblings, document, stack),
    };
  }
  const result: RecordValue = {};
  for (const [key, value] of Object.entries(schema)) {
    if (!schemaKeywords.has(key) && !key.startsWith("x-")) continue;
    if (key === "properties") {
      result.properties = Object.fromEntries(
        Object.entries(value as RecordValue).map(([name, entry]) => [
          name,
          resolveSchema(entry as RecordValue, document, stack),
        ]),
      );
    } else if (
      ["items", "not", "additionalProperties"].includes(key) &&
      value !== null &&
      typeof value === "object"
    ) {
      result[key] = resolveSchema(value as RecordValue, document, stack);
    } else if (["oneOf", "anyOf", "allOf", "prefixItems"].includes(key)) {
      result[key] = (value as RecordValue[]).map((entry) =>
        resolveSchema(entry, document, stack),
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

function publicName(operationKey: string, location: string, wireName: string): string {
  if (
    operationKey === "GET /nba/v1/season_averages/{type}" &&
    location === "path" &&
    wireName === "type"
  ) {
    return "category";
  }
  return wireName.replace(/\[\]$/, "").replace(/[^A-Za-z0-9_]/g, "_");
}

function expectedParameter(
  value: RecordValue,
  document: RecordValue,
  operationKey: string,
): GeneratedParameterDefinition {
  const parameter = resolveObject(value, document);
  const schema = resolveSchema(parameter.schema, document);
  if (parameter.description && !schema.description) schema.description = parameter.description;
  const style = parameter.style ?? (parameter.in === "query" ? "form" : "simple");
  return {
    publicName: publicName(operationKey, parameter.in, parameter.name),
    wireName: parameter.name,
    location: parameter.in,
    required: parameter.in === "path" ? true : parameter.required === true,
    style,
    explode: parameter.explode ?? (style === "form"),
    schema,
  };
}

function expectedBody(
  operation: RecordValue,
  document: RecordValue,
): GeneratedParameterDefinition[] {
  if (!operation.requestBody) return [];
  const requestBody = resolveObject(operation.requestBody, document);
  const schema = resolveSchema(requestBody.content["application/json"].schema, document);
  const required = new Set<string>(schema.required ?? []);
  return Object.entries(schema.properties).map(([name, propertySchema]) => ({
    publicName: name,
    wireName: name,
    location: "body",
    required: required.has(name),
    style: "json",
    explode: true,
    schema: propertySchema as Record<string, unknown>,
  }));
}

function expectedSecurity(operation: RecordValue, document: RecordValue): "apiKey" | "public" {
  const security = Object.prototype.hasOwnProperty.call(operation, "security")
    ? operation.security
    : document.security;
  return security.length === 0 ? "public" : "apiKey";
}

function expectedOperations(): Map<string, Omit<GeneratedOperationDefinition, "name" | "title" | "description" | "sensitive" | "redactResponseFields" | "sensitiveResponseUrlFields" | "annotations">> {
  const expected = new Map();
  const files = fs
    .readdirSync(path.join(process.cwd(), "openapi"))
    .filter((name) => name.endsWith(".yml"))
    .sort();
  assert.equal(files.length, 27);

  for (const file of files) {
    const document = loadYaml(`openapi/${file}`);
    assert.deepEqual(document.components?.securitySchemes?.ApiKeyAuth, {
      type: "apiKey",
      in: "header",
      name: "Authorization",
    }, file);
    for (const [apiPath, rawPathItem] of Object.entries(document.paths)) {
      const pathItem = resolveObject(rawPathItem as RecordValue, document);
      for (const [methodName, rawOperation] of Object.entries(pathItem)) {
        if (!["get", "post", "delete"].includes(methodName)) continue;
        const operation = rawOperation as RecordValue;
        const method = methodName.toUpperCase() as "GET" | "POST" | "DELETE";
        const operationKey = `${method} ${apiPath}`;
        const parametersByIdentity = new Map<string, RecordValue>();
        for (const parameter of [
          ...(pathItem.parameters ?? []),
          ...(operation.parameters ?? []),
        ]) {
          const resolved = resolveObject(parameter, document);
          parametersByIdentity.set(`${resolved.in}:${resolved.name}`, parameter);
        }
        const parameters = [
          ...Array.from(parametersByIdentity.values()).map((parameter) =>
            expectedParameter(parameter, document, operationKey),
          ),
          ...expectedBody(operation, document),
        ];
        const properties = Object.fromEntries(
          parameters.map((parameter) => [parameter.publicName, parameter.schema]),
        );
        const required = parameters
          .filter((parameter) => parameter.required)
          .map((parameter) => parameter.publicName);
        const inputSchema: RecordValue = {
          type: "object",
          properties,
          additionalProperties: false,
        };
        if (required.length > 0) inputSchema.required = required;
        assert.ok(!expected.has(operationKey), `duplicate ${operationKey}`);
        expected.set(operationKey, {
          sourceFile: `openapi/${file}`,
          operationKey,
          method,
          path: apiPath,
          inputSchema,
          parameters,
          security: expectedSecurity(operation, document),
        });
      }
    }
  }
  return expected;
}

test("generated registry has exact current operation and input parity", () => {
  const expected = expectedOperations();
  assert.equal(expected.size, 505);
  assert.equal(allOperationDefinitions.length, expected.size);
  const actualByKey = new Map(
    allOperationDefinitions.map((operation) => [operation.operationKey, operation]),
  );
  assert.equal(actualByKey.size, allOperationDefinitions.length);
  assert.equal(new Set(allOperationDefinitions.map((operation) => operation.name)).size, 505);

  for (const [operationKey, expectedOperation] of expected) {
    const actual = actualByKey.get(operationKey);
    assert.ok(actual, `missing ${operationKey}`);
    assert.equal(actual.sourceFile, expectedOperation.sourceFile, operationKey);
    assert.equal(actual.method, expectedOperation.method, operationKey);
    assert.equal(actual.path, expectedOperation.path, operationKey);
    assert.equal(actual.security, expectedOperation.security, operationKey);
    assert.deepEqual(actual.parameters, expectedOperation.parameters, operationKey);
    assert.deepEqual(actual.inputSchema, expectedOperation.inputSchema, operationKey);
  }
});

test("method, security, and legacy-name totals are exact", () => {
  assert.equal(allOperationDefinitions.filter((operation) => operation.method === "GET").length, 500);
  assert.equal(allOperationDefinitions.filter((operation) => operation.method === "POST").length, 4);
  assert.equal(allOperationDefinitions.filter((operation) => operation.method === "DELETE").length, 1);
  assert.deepEqual(
    allOperationDefinitions
      .filter((operation) => operation.security === "public")
      .map((operation) => operation.operationKey)
      .sort(),
    [
      "GET /account/v1/plans",
      "GET /account/v1/plans/{sport}",
      "POST /account/v1/signup",
    ],
  );

  const legacy = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts/legacy-tool-names.json"), "utf8"),
  ).names as Record<string, string>;
  assert.equal(Object.keys(legacy).length, 364);
  const actualByKey = new Map(
    allOperationDefinitions.map((operation) => [operation.operationKey, operation.name]),
  );
  for (const [operationKey, name] of Object.entries(legacy)) {
    assert.equal(actualByKey.get(operationKey), name, operationKey);
  }
});

test("generator rejects API-key security requirements with scopes", () => {
  const generatorUrl = pathToFileURL(
    path.join(process.cwd(), "scripts/generate-openapi-tools.mjs"),
  ).href;
  const fixture = [
    `import { effectiveSecurity } from ${JSON.stringify(generatorUrl)};`,
    "effectiveSecurity(",
    "  { security: [{ ApiKeyAuth: ['unexpected-scope'] }] },",
    "  { security: [{ ApiKeyAuth: [] }] },",
    "  'GET /fixture',",
    ");",
  ].join("\n");
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", fixture],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unsupported security scheme/);
});

test("master spec component links and external path references are complete", () => {
  const master = loadYaml("openapi.yml");
  const files = fs
    .readdirSync(path.join(process.cwd(), "openapi"))
    .filter((name) => name.endsWith(".yml"))
    .sort();
  const advertised = Array.from(
    new Set(
      Array.from(
        String(master.info?.description ?? "").matchAll(/openapi\/([a-z0-9]+\.yml)/g),
        (match) => match[1],
      ),
    ),
  ).sort();
  assert.deepEqual(advertised, files);

  const documents = new Map<string, RecordValue>();
  for (const [apiPath, value] of Object.entries(master.paths)) {
    const pathItem = value as RecordValue;
    assert.deepEqual(Object.keys(pathItem), ["$ref"], apiPath);
    const match = /^openapi\/([a-z0-9]+\.yml)(#\/.*)$/.exec(pathItem.$ref);
    assert.ok(match, `${apiPath}: ${pathItem.$ref}`);
    assert.ok(files.includes(match[1]), `${apiPath}: ${match[1]}`);
    assert.equal(
      match[2],
      `#/paths/${apiPath.replace(/~/g, "~0").replace(/\//g, "~1")}`,
      apiPath,
    );
    let document = documents.get(match[1]);
    if (!document) {
      document = loadYaml(`openapi/${match[1]}`);
      documents.set(match[1], document);
    }
    assert.notEqual(resolvePointer(document, match[2]), undefined, apiPath);
  }
});

test("published input schemas contain no unresolved references", () => {
  const visit = (value: unknown, operationKey: string): void => {
    if (Array.isArray(value)) return value.forEach((entry) => visit(entry, operationKey));
    if (!value || typeof value !== "object") return;
    assert.ok(!Object.prototype.hasOwnProperty.call(value, "$ref"), operationKey);
    Object.values(value).forEach((entry) => visit(entry, operationKey));
  };
  allOperationDefinitions.forEach((operation) =>
    visit(operation.inputSchema, operation.operationKey),
  );
});

test("annotations and sensitive-operation policy are exhaustive", () => {
  const sensitive = allOperationDefinitions
    .filter((operation) => operation.sensitive)
    .map((operation) => operation.operationKey)
    .sort();
  assert.deepEqual(sensitive, [
    "DELETE /account/v1/subscriptions/{type}",
    "GET /account/v1/billing/portal",
    "POST /account/v1/api-key/rotate",
    "POST /account/v1/billing/checkout",
    "POST /account/v1/signup",
    "POST /account/v1/subscriptions",
  ]);
  for (const operation of allOperationDefinitions) {
    const expectedReadOnly =
      operation.method === "GET" &&
      operation.operationKey !== "GET /account/v1/billing/portal";
    assert.equal(operation.annotations.readOnlyHint, expectedReadOnly, operation.operationKey);
    assert.equal(operation.annotations.idempotentHint, expectedReadOnly, operation.operationKey);
    if (expectedReadOnly) {
      assert.equal(operation.annotations.destructiveHint, false, operation.operationKey);
    }
    assert.ok(!operation.description.includes("Stripe"), operation.operationKey);
  }
  assert.deepEqual(
    allOperationDefinitions
      .filter((operation) => operation.sensitiveResponseUrlFields.length > 0)
      .map((operation) => [operation.operationKey, operation.sensitiveResponseUrlFields]),
    [
      ["POST /account/v1/billing/checkout", ["checkout_url"]],
      ["GET /account/v1/billing/portal", ["portal_url"]],
    ],
  );
});

test("representative drift regressions and new families stay present", () => {
  const byName = new Map(allOperationDefinitions.map((operation) => [operation.name, operation]));
  const nflGames = byName.get("nfl_get_games")!;
  assert.ok(nflGames.inputSchema.properties?.season_type);
  assert.ok(!nflGames.inputSchema.properties?.postseason);

  const fifaMatches = byName.get("fifa_get_matches")!;
  assert.deepEqual(Object.keys(fifaMatches.inputSchema.properties ?? {}), [
    "seasons", "match_ids", "team_ids", "per_page", "cursor",
  ]);
  const fifaVendors = byName.get("fifa_get_odds_player_props")!
    .inputSchema.properties?.vendors as RecordValue;
  assert.deepEqual(fifaVendors.items.enum, [
    "betmgm", "betrivers", "caesars", "draftkings", "fanatics", "fanduel",
  ]);

  assert.deepEqual(
    Object.keys(byName.get("f1_get_futures_odds")!.inputSchema.properties ?? {}),
    ["event_ids", "market_type", "cursor", "per_page"],
  );
  assert.deepEqual(
    (byName.get("mlb_get_plays")!.inputSchema.properties?.sort_order as RecordValue).enum,
    ["asc", "desc"],
  );
  assert.ok(byName.get("pga_get_futures")!.inputSchema.properties?.market_types);
  assert.equal(byName.get("pga_get_tournaments")!.path, "/pga/v2/tournaments");

  assert.equal(allOperationDefinitions.filter((operation) => operation.sourceFile === "openapi/account.yml").length, 10);
  assert.equal(allOperationDefinitions.filter((operation) => operation.sourceFile === "openapi/valorant.yml").length, 27);
  for (const operationKey of [
    "GET /epl/v2/player_injuries",
    "GET /epl/v2/match_shots",
    "GET /fifa/worldcup/v1/player_injuries",
    "GET /mlb/v1/pitcher_pitch_type_game_stats",
    "GET /mlb/v1/odds/markets",
    "GET /nba/v2/odds/opening",
  ]) {
    assert.ok(
      allOperationDefinitions.some((operation) => operation.operationKey === operationKey),
      operationKey,
    );
  }
});
