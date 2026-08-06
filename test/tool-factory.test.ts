import assert from "node:assert/strict";
import test from "node:test";
import type { APIClient } from "../src/client.js";
import { SafeAPIError } from "../src/errors.js";
import { allOperationDefinitions } from "../src/operation-registry.js";
import { createToolsFromDefinitions } from "../src/tool-factory.js";
import type { APIRequest, APIResponse, GeneratedOperationDefinition } from "../src/types.js";
import { buildQueryString } from "../src/utils.js";

class RecordingClient {
  readonly requests: APIRequest[] = [];
  response: APIResponse = { data: { ok: true } };

  async request(request: APIRequest): Promise<APIResponse> {
    this.requests.push(request);
    return this.response;
  }

  async validateApiKey(): Promise<boolean> {
    return true;
  }
}

function definition(name: string): GeneratedOperationDefinition {
  const found = allOperationDefinitions.find((operation) => operation.name === name);
  assert.ok(found, `missing generated tool ${name}`);
  return found;
}

function tool(
  name: string,
  client: RecordingClient,
  enableSensitiveAccountTools = false,
) {
  return createToolsFromDefinitions(
    [definition(name)],
    client as unknown as APIClient,
    { enableSensitiveAccountTools },
  )[0];
}

test("array query dispatch repeats exact bracketed and unbracketed wire names", async () => {
  const client = new RecordingClient();
  await tool("atp_get_matches", client).handler({
    tournament_ids: [10, 11],
    player_ids: [20, 21],
  });
  assert.deepEqual(client.requests[0].query, [
    { name: "tournament_ids", value: "10" },
    { name: "tournament_ids", value: "11" },
    { name: "player_ids[]", value: "20" },
    { name: "player_ids[]", value: "21" },
  ]);
  const query = buildQueryString(client.requests[0].query!);
  assert.equal(
    query,
    "tournament_ids=10&tournament_ids=11&player_ids%5B%5D=20&player_ids%5B%5D=21",
  );
  assert.ok(!query.includes("%5B%5D%5B%5D"));
});

test("NBA duplicate type inputs preserve the category alias and query value", async () => {
  const client = new RecordingClient();
  await tool("nba_get_season_averages", client).handler({
    category: "shooting / clutch",
    season: 2025,
    season_type: "regular",
    type: "base",
  });
  assert.equal(
    client.requests[0].endpoint,
    "/nba/v1/season_averages/shooting%20%2F%20clutch",
  );
  assert.deepEqual(client.requests[0].query, [
    { name: "season", value: "2025" },
    { name: "season_type", value: "regular" },
    { name: "type", value: "base" },
  ]);
});

test("path values are encoded and extra arguments are never forwarded", async () => {
  const client = new RecordingClient();
  await tool("account_get_plans_by_sport", client).handler(
    { sport: "stories/nfl &?", injected: "do-not-forward" },
    { Authorization: "Bearer secret", "X-Injected": "no" },
  );
  assert.deepEqual(client.requests[0], {
    endpoint: "/account/v1/plans/stories%2Fnfl%20%26%3F",
    method: "GET",
    headers: { Authorization: "Bearer secret" },
    allowSensitiveDetails: false,
  });
});

test("sensitive Account tools fail closed before dispatch", async () => {
  const cases: Array<[string, Record<string, unknown>]> = [
    ["account_signup", { email: "person@example.com", password: "secret" }],
    ["account_rotate_api_key", {}],
    ["account_change_subscription", { sport: "nba", tier: "paid" }],
    ["account_cancel_subscription", { type: "nba" }],
    ["account_create_checkout", { sport: "nba", tier: "paid" }],
    ["account_get_billing_portal", {}],
  ];
  for (const [name, params] of cases) {
    const client = new RecordingClient();
    await assert.rejects(
      tool(name, client).handler(params),
      (error: unknown) =>
        error instanceof SafeAPIError &&
        error.publicCode === "sensitive_tool_disabled" &&
        error.statusCode === 403,
      name,
    );
    assert.equal(client.requests.length, 0, name);
  }
});

test("opted-in POST and DELETE dispatch only body and path fields", async () => {
  const signupClient = new RecordingClient();
  await tool("account_signup", signupClient, true).handler(
    { email: "person@example.com", password: "never-log" },
    { Authorization: "Bearer existing-key" },
  );
  assert.deepEqual(signupClient.requests[0], {
    endpoint: "/account/v1/signup",
    method: "POST",
    body: { email: "person@example.com", password: "never-log" },
    headers: { Authorization: "Bearer existing-key" },
    allowSensitiveDetails: true,
  });

  const cancelClient = new RecordingClient();
  await tool("account_cancel_subscription", cancelClient, true).handler(
    { type: "stories_nfl" },
    { Authorization: "key" },
  );
  assert.deepEqual(cancelClient.requests[0], {
    endpoint: "/account/v1/subscriptions/stories_nfl",
    method: "DELETE",
    headers: { Authorization: "key" },
    allowSensitiveDetails: true,
  });

  const checkoutClient = new RecordingClient();
  await tool("account_create_checkout", checkoutClient, true).handler(
    { sport: "nba", tier: "paid" },
    { Authorization: "key" },
  );
  assert.deepEqual(checkoutClient.requests[0], {
    endpoint: "/account/v1/billing/checkout",
    method: "POST",
    body: { sport: "nba", tier: "paid" },
    headers: { Authorization: "key" },
    allowSensitiveDetails: true,
    sensitiveResponseUrlFields: ["checkout_url"],
  });

  const portalClient = new RecordingClient();
  await tool("account_get_billing_portal", portalClient, true).handler(
    {},
    { Authorization: "key" },
  );
  assert.deepEqual(portalClient.requests[0], {
    endpoint: "/account/v1/billing/portal",
    method: "GET",
    headers: { Authorization: "key" },
    allowSensitiveDetails: true,
    sensitiveResponseUrlFields: ["portal_url"],
  });
});

test("account_get_me recursively removes api_key without mutating the client response", async () => {
  const client = new RecordingClient();
  client.response = {
    data: {
      email: "person@example.com",
      api_key: "top-secret",
      nested: { api_key: "also-secret", value: true },
    },
  };
  const response = await tool("account_get_me", client).handler({});
  assert.deepEqual(response, {
    data: {
      email: "person@example.com",
      nested: { value: true },
    },
  });
  assert.equal((client.response.data as Record<string, unknown>).api_key, "top-secret");
});

test("required and array argument mismatches fail without dispatch", async () => {
  const client = new RecordingClient();
  await assert.rejects(
    tool("nba_get_season_averages", client).handler({}),
    (error: unknown) =>
      error instanceof SafeAPIError && error.publicCode === "invalid_tool_arguments",
  );
  await assert.rejects(
    tool("atp_get_players", client).handler({ player_ids: 1 }),
    (error: unknown) =>
      error instanceof SafeAPIError && error.publicCode === "invalid_tool_arguments",
  );
  assert.equal(client.requests.length, 0);
});

test("mutation annotations describe risk and billing portal is not read-only", () => {
  assert.equal(definition("account_get_me").annotations.readOnlyHint, true);
  assert.equal(definition("account_rotate_api_key").annotations.destructiveHint, true);
  assert.equal(definition("account_change_subscription").annotations.destructiveHint, true);
  assert.equal(definition("account_cancel_subscription").annotations.destructiveHint, true);
  assert.equal(definition("account_create_checkout").annotations.destructiveHint, false);
  assert.equal(definition("account_get_billing_portal").annotations.readOnlyHint, false);
});
