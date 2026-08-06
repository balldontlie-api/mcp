import type { AddressInfo } from "node:net";

const { default: tracer } = await import("../src/tracer.js");
const captured: unknown[] = [];
const internalTracer = tracer as any;
internalTracer._tracer._exporter.export = (spans: unknown[]) => {
  captured.push(...spans);
};

const { createServer: createHttpServer } = await import("node:http");
const { createServer } = await import("../src/web-server.js");

const apiServer = createHttpServer((req, res) => {
  req.resume();
  const route = req.url?.split("?")[0];
  res.setHeader("Content-Type", "application/json");
  if (route === "/account/v1/me") {
    res.end(
      JSON.stringify({
        email: "validation-profile-secret@example.com",
        api_key: "validation-profile-api-key-secret",
      }),
    );
  } else if (route === "/account/v1/signup") {
    res.end(
      JSON.stringify({
        data: {
          email: "signup-response-secret@example.com",
          api_key: "new-signup-api-key-secret",
        },
      }),
    );
  } else if (route === "/account/v1/billing/checkout") {
    res.end(
      JSON.stringify({
        data: {
          checkout_url:
            "https://checkout.stripe.com/c/billing-session-url-secret",
        },
      }),
    );
  } else if (route === "/nba/v1/teams") {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "raw-upstream-error-secret" }));
  } else if (route === "/nba/v1/players") {
    req.socket.destroy();
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  }
});
await new Promise<void>((resolve) => apiServer.listen(0, "127.0.0.1", resolve));
const apiAddress = apiServer.address() as AddressInfo;

const created = createServer({
  config: {
    BACKEND_API_URL: `http://127.0.0.1:${apiAddress.port}`,
    API_TIMEOUT: 5_000,
    LOG_LEVEL: "error",
    NODE_ENV: "test",
    ENABLE_DEBUG: false,
    ENABLE_SENSITIVE_ACCOUNT_TOOLS: true,
    TRUST_PROXY_HOPS: 0,
  },
});
const mcpServer = created.app.listen(0, "127.0.0.1");
await new Promise<void>((resolve) => mcpServer.once("listening", resolve));
const mcpAddress = mcpServer.address() as AddressInfo;
const baseUrl = `http://127.0.0.1:${mcpAddress.port}`;
const authorization = "Bearer inbound-authorization-secret";

async function rpc(
  name: string,
  args: Record<string, unknown>,
  query = "",
): Promise<void> {
  const response = await fetch(`${baseUrl}/mcp${query}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  await response.text();
}

await rpc(
  "account_signup",
  {
    email: "account-body-secret@example.com",
    password: "account-body-password-secret",
  },
  "?query_value=query-string-secret",
);
await rpc("account_create_checkout", { sport: "nba", tier: "paid" });
await rpc("nba_get_teams", {});
await rpc("nba_get_players", { search: "transport-query-secret" });
await rpc("caller_supplied_secret_tool_name", {});

const malformed = await fetch(`${baseUrl}/mcp`, {
  method: "POST",
  headers: {
    Authorization: authorization,
    "Content-Type": "application/json",
  },
  body: '{"malformed":"malformed-json-body-secret",',
});
await malformed.text();

await new Promise((resolve) => setTimeout(resolve, 50));
mcpServer.closeAllConnections?.();
await new Promise<void>((resolve, reject) =>
  mcpServer.close((error) => (error ? reject(error) : resolve())),
);
await new Promise<void>((resolve, reject) =>
  apiServer.close((error) => (error ? reject(error) : resolve())),
);

process.stdout.write(JSON.stringify(captured));
process.exit(0);
