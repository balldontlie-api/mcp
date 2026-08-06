import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import test from "node:test";
import { CredentialValidationLimiter } from "../src/auth-gate.js";
import type { APIClient } from "../src/client.js";
import { SafeAPIError } from "../src/errors.js";
import type { APIRequest, APIResponse, Config } from "../src/types.js";
import { ConfigManager } from "../src/utils.js";
import { createServer } from "../src/web-server.js";

class FakeClient {
  readonly requests: APIRequest[] = [];
  readonly validations: string[] = [];
  valid = true;
  response: APIResponse = { data: { ok: true } };
  requestError?: SafeAPIError;
  validationError?: SafeAPIError;

  async request(request: APIRequest): Promise<APIResponse> {
    this.requests.push(request);
    if (this.requestError) throw this.requestError;
    return this.response;
  }

  async validateApiKey(authorization: string): Promise<boolean> {
    this.validations.push(authorization);
    if (this.validationError) throw this.validationError;
    return this.valid;
  }
}

class RecordingLimiter extends CredentialValidationLimiter {
  readonly ips: string[] = [];

  override async validate(
    clientIp: string,
    _authorization: string,
    _validateApiKey: (authorization: string) => Promise<boolean>,
  ): Promise<boolean> {
    this.ips.push(clientIp);
    return true;
  }
}

function config(overrides: Partial<Config> = {}): Config {
  return {
    BACKEND_API_URL: "https://api.invalid",
    API_TIMEOUT: 5_000,
    LOG_LEVEL: "error",
    NODE_ENV: "test",
    ENABLE_DEBUG: false,
    ENABLE_SENSITIVE_ACCOUNT_TOOLS: false,
    TRUST_PROXY_HOPS: 0,
    ...overrides,
  };
}

async function withServer(
  serverConfig: Config,
  client: FakeClient,
  run: (baseUrl: string) => Promise<void>,
  validationLimiter?: CredentialValidationLimiter,
): Promise<void> {
  const created = createServer({
    config: serverConfig,
    apiClient: client as unknown as APIClient,
    validationLimiter,
  });
  const server = created.app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  try {
    const address = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.closeAllConnections?.();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

async function rpc(
  baseUrl: string,
  method: string,
  params?: Record<string, unknown>,
  authorization?: string,
  extraHeaders: Record<string, string> = {},
) {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
      ...extraHeaders,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return { status: response.status, body: await response.json() as any };
}

test("initialize and tools/list require a validated key", async () => {
  const client = new FakeClient();
  await withServer(config(), client, async (baseUrl) => {
    assert.equal((await rpc(baseUrl, "initialize")).status, 401);
    assert.equal(client.validations.length, 0);

    client.valid = false;
    const invalid = await rpc(baseUrl, "tools/list", undefined, "Bearer invalid");
    assert.equal(invalid.status, 401);
    assert.equal(invalid.body.error.code, -32001);

    client.valid = true;
    const initialized = await rpc(baseUrl, "initialize", undefined, "Bearer valid");
    assert.equal(initialized.status, 200);
    assert.equal(initialized.body.result.serverInfo.version, "1.2.0");
    const listed = await rpc(baseUrl, "tools/list", undefined, "Bearer valid");
    assert.equal(listed.status, 200);
    assert.equal(listed.body.result.tools.length, 505);
    assert.equal(new Set(listed.body.result.tools.map((tool: any) => tool.name)).size, 505);
    const rotation = listed.body.result.tools.find(
      (tool: any) => tool.name === "account_rotate_api_key",
    );
    assert.equal(rotation.annotations.destructiveHint, true);
  });
});

test("API docs use plain HTTP auth failures and expose annotations only after validation", async () => {
  const client = new FakeClient();
  await withServer(config(), client, async (baseUrl) => {
    const missing = await fetch(`${baseUrl}/api/docs`);
    assert.equal(missing.status, 401);
    assert.deepEqual(await missing.json(), { error: "Unauthorized" });

    client.valid = false;
    const invalid = await fetch(`${baseUrl}/api/docs`, {
      headers: { Authorization: "bad-key" },
    });
    assert.equal(invalid.status, 401);
    assert.deepEqual(await invalid.json(), { error: "Unauthorized" });

    client.valid = true;
    const valid = await fetch(`${baseUrl}/api/docs`, {
      headers: { Authorization: "good-key" },
    });
    assert.equal(valid.status, 200);
    const body = await valid.json() as any;
    const tools = Object.values(body.tools).flat() as any[];
    assert.equal(tools.length, 505);
    assert.equal(body.usage.sensitiveAccountToolsEnabled, false);
    assert.ok(tools.every((tool) => tool.annotations));
  });
});

test("public Account tools cannot bypass validation", async () => {
  const client = new FakeClient();
  client.valid = false;
  await withServer(config(), client, async (baseUrl) => {
    const result = await rpc(
      baseUrl,
      "tools/call",
      { name: "account_get_plans", arguments: {} },
      "random-header",
    );
    assert.equal(result.status, 401);
    assert.equal(client.requests.length, 0);
  });
});

test("sensitive tools are listed but default-denied before API dispatch", async () => {
  const client = new FakeClient();
  await withServer(config(), client, async (baseUrl) => {
    const result = await rpc(
      baseUrl,
      "tools/call",
      {
        name: "account_signup",
        arguments: { email: "person@example.com", password: "secret" },
      },
      "Bearer valid",
    );
    assert.equal(result.status, 200);
    assert.equal(result.body.result.isError, true);
    assert.match(result.body.result.content[0].text, /sensitive_tool_disabled/);
    assert.equal(client.requests.length, 0);
    assert.equal(client.validations.length, 1);
  });
});

test("exact opt-in permits intentional secret output to the authenticated caller", async () => {
  const client = new FakeClient();
  client.response = { data: { email: "new@example.com", api_key: "new-api-key" } };
  await withServer(
    config({ ENABLE_SENSITIVE_ACCOUNT_TOOLS: true }),
    client,
    async (baseUrl) => {
      const result = await rpc(
        baseUrl,
        "tools/call",
        {
          name: "account_signup",
          arguments: { email: "new@example.com", password: "secret" },
        },
        "Bearer existing",
      );
      assert.equal(result.status, 200);
      assert.equal(result.body.result.isError, undefined);
      assert.match(result.body.result.content[0].text, /new-api-key/);
      assert.equal(client.requests.length, 1);
    },
  );
});

test("account_get_me redacts API keys in the server result", async () => {
  const client = new FakeClient();
  client.response = {
    data: { email: "person@example.com", api_key: "must-not-return", tier: "free" },
  };
  await withServer(config(), client, async (baseUrl) => {
    const result = await rpc(
      baseUrl,
      "tools/call",
      { name: "account_get_me", arguments: {} },
      "Bearer supplied-out-of-band",
    );
    assert.equal(result.status, 200);
    assert.ok(!result.body.result.content[0].text.includes("must-not-return"));
    assert.match(result.body.result.content[0].text, /person@example.com/);
    assert.equal(client.validations.length, 0);
    assert.equal(client.requests.length, 1);
  });
});

test("authenticated tool API failures use MCP isError results with safe text", async () => {
  const client = new FakeClient();
  client.requestError = new SafeAPIError(
    "authorization",
    "authorization_failed",
    "The BALLDONTLIE API key was rejected.",
    401,
  );
  await withServer(config(), client, async (baseUrl) => {
    const result = await rpc(
      baseUrl,
      "tools/call",
      { name: "nba_get_teams", arguments: {} },
      "Bearer rejected",
    );
    assert.equal(result.status, 200);
    assert.equal(result.body.result.isError, true);
    assert.match(result.body.result.content[0].text, /authorization_failed/);
    assert.equal(result.body.error, undefined);
  });
});

test("credential validation availability and limits use distinct gateway responses", async () => {
  const unavailableClient = new FakeClient();
  unavailableClient.validationError = new SafeAPIError(
    "availability",
    "api_unavailable",
    "unavailable",
    503,
  );
  await withServer(config(), unavailableClient, async (baseUrl) => {
    const result = await rpc(baseUrl, "tools/list", undefined, "key");
    assert.equal(result.status, 503);
    assert.equal(result.body.error.code, -32003);
    assert.ok(!JSON.stringify(result.body).includes("unavailableClient"));
  });

  const limitedClient = new FakeClient();
  const limited = new CredentialValidationLimiter(() => 1_000);
  for (let index = 0; index < 10; index += 1) {
    await limited.validate("127.0.0.1", "same-key", async () => true);
  }
  await withServer(config(), limitedClient, async (baseUrl) => {
    const result = await rpc(baseUrl, "tools/list", undefined, "same-key");
    assert.equal(result.status, 429);
    assert.equal(result.body.error.code, -32002);
  }, limited);
});

test("trusted proxy defaults ignore direct spoofing and one-hop mode ignores prepended values", async () => {
  const directClient = new FakeClient();
  const directLimiter = new RecordingLimiter();
  await withServer(config({ TRUST_PROXY_HOPS: 0 }), directClient, async (baseUrl) => {
    await rpc(
      baseUrl,
      "tools/list",
      undefined,
      "key",
      { "X-Forwarded-For": "198.51.100.99" },
    );
    assert.notEqual(directLimiter.ips[0], "198.51.100.99");
  }, directLimiter);

  const renderClient = new FakeClient();
  const renderLimiter = new RecordingLimiter();
  await withServer(config({ TRUST_PROXY_HOPS: 1 }), renderClient, async (baseUrl) => {
    await rpc(
      baseUrl,
      "tools/list",
      undefined,
      "key",
      { "X-Forwarded-For": "198.51.100.88, 203.0.113.77" },
    );
    assert.equal(renderLimiter.ips[0], "203.0.113.77");
  }, renderLimiter);
});

test("sensitive opt-in and proxy configuration parse fail closed", () => {
  const original = {
    NODE_ENV: process.env.NODE_ENV,
    ENABLE_SENSITIVE_ACCOUNT_TOOLS: process.env.ENABLE_SENSITIVE_ACCOUNT_TOOLS,
    TRUST_PROXY_HOPS: process.env.TRUST_PROXY_HOPS,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  };
  try {
    process.env.NODE_ENV = "test";
    delete process.env.TRUST_PROXY_HOPS;
    for (const value of [undefined, "false", "TRUE", " true", "true ", "1", "yes"]) {
      if (value === undefined) delete process.env.ENABLE_SENSITIVE_ACCOUNT_TOOLS;
      else process.env.ENABLE_SENSITIVE_ACCOUNT_TOOLS = value;
      assert.equal(ConfigManager.load().ENABLE_SENSITIVE_ACCOUNT_TOOLS, false, String(value));
    }
    process.env.ENABLE_SENSITIVE_ACCOUNT_TOOLS = "true";
    assert.equal(ConfigManager.load().ENABLE_SENSITIVE_ACCOUNT_TOOLS, true);
    assert.equal(ConfigManager.load().TRUST_PROXY_HOPS, 0);

    process.env.NODE_ENV = "production";
    assert.equal(ConfigManager.load().TRUST_PROXY_HOPS, 1);
    process.env.BACKEND_API_URL = "http://api.example.test";
    assert.throws(() => ConfigManager.load(), /valid HTTPS URL/);
    process.env.BACKEND_API_URL = "https://api.example.test";
    process.env.TRUST_PROXY_HOPS = "2";
    assert.throws(() => ConfigManager.load(), /exactly 0 or 1/);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
