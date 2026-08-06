import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

test("captured tracing spans contain only server-resolved MCP metadata", () => {
  const fixture = path.join(
    process.cwd(),
    "dist-test/test/trace-capture-fixture.js",
  );
  const result = spawnSync(process.execPath, [fixture], {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 20_000,
    env: {
      ...process.env,
      ENABLE_TRACING: "true",
      DD_AGENT_HOST: "127.0.0.1",
      DD_TRACE_STARTUP_LOGS: "false",
      DD_INSTRUMENTATION_TELEMETRY_ENABLED: "false",
      DD_REMOTE_CONFIGURATION_ENABLED: "false",
      DD_PROFILING_ENABLED: "false",
      // Application configuration must override an unsafe ambient request.
      DD_TRACE_HEADER_TAGS: "authorization",
    },
  });
  assert.equal(result.status, 0, result.stderr);
  const spans = JSON.parse(result.stdout) as Array<{
    meta?: Record<string, unknown>;
    metrics?: Record<string, unknown>;
  }>;
  assert.ok(spans.length > 0);
  const serialized = JSON.stringify(spans);
  for (const secret of [
    "inbound-authorization-secret",
    "account-body-secret@example.com",
    "account-body-password-secret",
    "validation-profile-secret@example.com",
    "validation-profile-api-key-secret",
    "signup-response-secret@example.com",
    "new-signup-api-key-secret",
    "billing-session-url-secret",
    "raw-upstream-error-secret",
    "caller_supplied_secret_tool_name",
    "malformed-json-body-secret",
    "query-string-secret",
    "transport-query-secret",
  ]) {
    assert.ok(!serialized.includes(secret), secret);
  }

  const metadata = spans.map((span) => ({
    ...(span.meta ?? {}),
    ...(span.metrics ?? {}),
  }));
  assert.ok(metadata.some((meta) => meta["mcp.method"] === "tools/call"));
  assert.ok(metadata.some((meta) => meta["mcp.tool"] === "account_signup"));
  assert.ok(
    metadata.some((meta) => meta["mcp.tool"] === "account_create_checkout"),
  );
  assert.ok(metadata.some((meta) => meta["mcp.tool"] === "nba_get_teams"));
  assert.ok(metadata.some((meta) => meta["mcp.tool"] === "nba_get_players"));
});
