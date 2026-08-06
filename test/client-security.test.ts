import assert from "node:assert/strict";
import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import test from "node:test";
import { APIClient } from "../src/client.js";
import { SafeAPIError } from "../src/errors.js";
import type { Config } from "../src/types.js";

async function withApiServer(
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const server = createServer((req, res) => {
    const route = req.url?.split("?")[0];
    if (route === "/reset") {
      req.socket.destroy();
      return;
    }
    res.setHeader("Content-Type", "application/json");
    if (route === "/unauthorized") {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: { message: "secret-key leaked" } }));
    } else if (route === "/limited") {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: "raw upstream limit detail" }));
    } else if (route === "/server-error") {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "database password raw-secret" }));
    } else if (route === "/business") {
      res.statusCode = 402;
      res.end(
        JSON.stringify({
          error: {
            code: "payment_method_required",
            message: "raw message with person@example.com",
            payment_url: "https://checkout.stripe.com/c/pay_secret_session",
            portal_url: "https://attacker.example/steal",
          },
        }),
      );
    } else if (route === "/business-unknown") {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: { code: "api_key_live_secret" } }));
    } else if (route === "/business-prototype") {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: { code: "constructor" } }));
    } else if (route === "/business-proto") {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: { code: "__proto__" } }));
    } else if (route === "/checkout-valid") {
      res.end(
        JSON.stringify({
          data: {
            checkout_url: "https://checkout.stripe.com/c/pay_response_secret",
          },
        }),
      );
    } else if (route === "/portal-valid") {
      res.end(
        JSON.stringify({
          portal_url: "https://billing.stripe.com/p/session/portal_response_secret",
        }),
      );
    } else if (route === "/checkout-normalized") {
      res.end(
        JSON.stringify({
          data: {
            checkout_url:
              "  HTTPS://CHECKOUT.STRIPE.COM/c/pay_normalized  ",
          },
        }),
      );
    } else if (route === "/checkout-malicious") {
      res.end(
        JSON.stringify({
          data: {
            checkout_url: "https://checkout.stripe.com@attacker.example/steal",
          },
        }),
      );
    } else if (route === "/checkout-missing") {
      res.end(JSON.stringify({ data: { ok: true } }));
    } else if (route === "/account/v1/me") {
      res.end(
        JSON.stringify({
          email: "person@example.com",
          api_key: "validation-profile-secret",
        }),
      );
    } else {
      res.end(
        JSON.stringify({
          data: {
            ok: true,
            api_key: "response-api-secret",
            checkout_url: "https://checkout.stripe.com/c/pay_response_secret",
          },
        }),
      );
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

function config(baseUrl: string, debug = true): Config {
  return {
    BACKEND_API_URL: baseUrl,
    API_TIMEOUT: 5_000,
    LOG_LEVEL: "debug",
    NODE_ENV: "test",
    ENABLE_DEBUG: debug,
    ENABLE_SENSITIVE_ACCOUNT_TOOLS: false,
    TRUST_PROXY_HOPS: 0,
  };
}

test("debug logging excludes authorization, query values, bodies, and responses", async () => {
  await withApiServer(async (baseUrl) => {
    const original = console.error;
    const logs: string[] = [];
    console.error = (...values: unknown[]) => logs.push(values.map(String).join(" "));
    try {
      const client = new APIClient(config(baseUrl));
      const response = await client.request({
        endpoint: "/success",
        method: "POST",
        query: [{ name: "email", value: "query-secret@example.com" }],
        headers: { Authorization: "Bearer authorization-secret" },
        body: { password: "body-password-secret" },
      });
      assert.equal((response.data as any).api_key, "response-api-secret");
      assert.equal(logs.length, 1);
      const captured = logs.join("\n");
      for (const secret of [
        "authorization-secret",
        "query-secret@example.com",
        "body-password-secret",
        "response-api-secret",
        "pay_response_secret",
      ]) {
        assert.ok(!captured.includes(secret), secret);
      }
      assert.match(captured, /^BALLDONTLIE request POST \/success query_fields=1$/);
    } finally {
      console.error = original;
    }
  });
});

test("credential validation returns only boolean and never logs profile fields", async () => {
  await withApiServer(async (baseUrl) => {
    const original = console.error;
    const logs: string[] = [];
    console.error = (...values: unknown[]) => logs.push(values.map(String).join(" "));
    try {
      const client = new APIClient(config(baseUrl));
      assert.equal(await client.validateApiKey("Bearer validation-key"), true);
      const captured = logs.join("\n");
      assert.ok(!captured.includes("validation-key"));
      assert.ok(!captured.includes("person@example.com"));
      assert.ok(!captured.includes("validation-profile-secret"));
    } finally {
      console.error = original;
    }
  });
});

test("upstream errors become sanitized typed errors without Axios state", async () => {
  await withApiServer(async (baseUrl) => {
    const client = new APIClient(config(baseUrl, false));
    const cases: Array<
      [string, string, string, number]
    > = [
      ["/unauthorized", "authorization", "authorization_failed", 401],
      ["/limited", "rate_limit", "api_rate_limited", 429],
      ["/server-error", "availability", "api_unavailable", 500],
    ];
    for (const [endpoint, category, code, status] of cases) {
      await assert.rejects(
        client.request({ endpoint, method: "GET" }),
        (error: unknown) => {
          assert.ok(error instanceof SafeAPIError);
          assert.equal(error.category, category);
          assert.equal(error.publicCode, code);
          assert.equal(error.statusCode, status);
          const serialized = JSON.stringify(error.toPublicPayload());
          assert.ok(!serialized.includes("secret"));
          assert.ok(!("config" in error));
          assert.ok(!("request" in error));
          assert.ok(!("response" in error));
          return true;
        },
      );
    }
  });
});

test("Stripe action URLs are allowlisted only for opted-in sensitive output", async () => {
  await withApiServer(async (baseUrl) => {
    const client = new APIClient(config(baseUrl, false));
    await assert.rejects(
      client.request({ endpoint: "/business", method: "POST" }),
      (error: unknown) => {
        assert.ok(error instanceof SafeAPIError);
        assert.equal(error.publicCode, "payment_method_required");
        assert.equal(error.safeDetails, undefined);
        assert.ok(!error.message.includes("person@example.com"));
        return true;
      },
    );
    await assert.rejects(
      client.request({
        endpoint: "/business",
        method: "POST",
        allowSensitiveDetails: true,
      }),
      (error: unknown) => {
        assert.ok(error instanceof SafeAPIError);
        assert.deepEqual(error.safeDetails, {
          payment_url: "https://checkout.stripe.com/c/pay_secret_session",
        });
        assert.ok(!JSON.stringify(error.safeDetails).includes("attacker.example"));
        return true;
      },
    );
  });
});

test("upstream-controlled error codes are never exposed unless allowlisted", async () => {
  await withApiServer(async (baseUrl) => {
    const client = new APIClient(config(baseUrl, false));
    for (const endpoint of [
      "/business-unknown",
      "/business-prototype",
      "/business-proto",
    ]) {
      await assert.rejects(
        client.request({ endpoint, method: "GET" }),
        (error: unknown) => {
          assert.ok(error instanceof SafeAPIError);
          assert.equal(error.publicCode, "request_rejected");
          const serialized = JSON.stringify(error.toPublicPayload());
          assert.ok(!serialized.includes("api_key_live_secret"));
          assert.ok(!serialized.includes("constructor"));
          assert.ok(!serialized.includes("__proto__"));
          return true;
        },
      );
    }
  });
});

test("successful billing URLs require exact HTTPS provider hosts", async () => {
  await withApiServer(async (baseUrl) => {
    const client = new APIClient(config(baseUrl, false));
    const checkout = await client.request({
      endpoint: "/checkout-valid",
      method: "POST",
      sensitiveResponseUrlFields: ["checkout_url"],
    });
    assert.equal(
      (checkout.data as any).checkout_url,
      "https://checkout.stripe.com/c/pay_response_secret",
    );
    const portal = await client.request({
      endpoint: "/portal-valid",
      method: "GET",
      sensitiveResponseUrlFields: ["portal_url"],
    });
    assert.equal(
      (portal.data as any).portal_url,
      "https://billing.stripe.com/p/session/portal_response_secret",
    );
    const normalized = await client.request({
      endpoint: "/checkout-normalized",
      method: "POST",
      sensitiveResponseUrlFields: ["checkout_url"],
    });
    assert.equal(
      (normalized.data as any).checkout_url,
      "https://checkout.stripe.com/c/pay_normalized",
    );

    for (const endpoint of ["/checkout-malicious", "/checkout-missing"]) {
      await assert.rejects(
        client.request({
          endpoint,
          method: "POST",
          sensitiveResponseUrlFields: ["checkout_url"],
        }),
        (error: unknown) => {
          assert.ok(error instanceof SafeAPIError);
          assert.equal(error.publicCode, "invalid_sensitive_response");
          assert.equal(error.statusCode, 502);
          assert.ok(!JSON.stringify(error.toPublicPayload()).includes("attacker.example"));
          return true;
        },
      );
    }
  });
});

test("transport failures discard Axios request state and query values", async () => {
  await withApiServer(async (baseUrl) => {
    const client = new APIClient(config(baseUrl, false));
    await assert.rejects(
      client.request({
        endpoint: "/reset",
        method: "GET",
        query: [{ name: "search", value: "transport-query-secret" }],
      }),
      (error: unknown) => {
        assert.ok(error instanceof SafeAPIError);
        assert.equal(error.category, "availability");
        assert.equal(error.publicCode, "api_unavailable");
        assert.equal(error.statusCode, 503);
        assert.ok(!JSON.stringify(error.toPublicPayload()).includes("transport-query-secret"));
        assert.ok(!("config" in error));
        assert.ok(!("request" in error));
        assert.ok(!("response" in error));
        return true;
      },
    );
  });
});
