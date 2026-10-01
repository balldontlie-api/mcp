import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { AddressInfo } from "node:net";
import { createServer } from "../src/web-server.js";

for (const authorization of [undefined, "Bearer malformed-token"]) {
  test(`OAuth tools expose transport and tool-level challenges for ${authorization ? "invalid" : "missing"} credentials`, async () => {
    process.env.OAUTH_ENABLED = "true";
    process.env.OAUTH_EXCHANGE_SECRET = "test-only-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const { app } = createServer();
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    try {
      const response = await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/oauth/mcp`, {
        method: "POST", headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "nba_get_teams", arguments: {} } }),
      });
      assert.equal(response.status, 401);
      const header = response.headers.get("www-authenticate");
      assert.match(header || "", /resource_metadata=.*error="invalid_token".*error_description=/);
      const body = await response.json() as any;
      assert.equal(body.error, undefined);
      assert.equal(body.result.isError, true);
      assert.deepEqual(body.result._meta["mcp/www_authenticate"], [header]);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      delete process.env.OAUTH_ENABLED;
      delete process.env.OAUTH_EXCHANGE_SECRET;
    }
  });
}
