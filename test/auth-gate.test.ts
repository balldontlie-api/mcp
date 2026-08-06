import assert from "node:assert/strict";
import test from "node:test";
import {
  CredentialValidationLimiter,
  VALIDATION_LIMITS,
} from "../src/auth-gate.js";
import { SafeAPIError } from "../src/errors.js";
import { normalizeAuthorizationApiKey } from "../src/utils.js";

const isLimited = (error: unknown) =>
  error instanceof SafeAPIError &&
  error.publicCode === "credential_validation_limited" &&
  error.statusCode === 429;

test("authorization normalization shares raw and Bearer token identity", () => {
  assert.equal(normalizeAuthorizationApiKey(" key-value "), "key-value");
  assert.equal(normalizeAuthorizationApiKey("Bearer key-value"), "key-value");
  assert.equal(normalizeAuthorizationApiKey("bEaReR   key-value "), "key-value");
  assert.equal(normalizeAuthorizationApiKey("Bearer"), null);
  assert.equal(normalizeAuthorizationApiKey("   "), null);
});

test("normalized-key digest limit is 10 and state never retains raw credentials", async () => {
  const limiter = new CredentialValidationLimiter(() => 1_000);
  let validations = 0;
  for (let index = 0; index < VALIDATION_LIMITS.keyAttempts; index += 1) {
    const header = index % 2 === 0 ? "secret-key" : "Bearer secret-key";
    assert.equal(
      await limiter.validate("198.51.100.1", header, async () => {
        validations += 1;
        return true;
      }),
      true,
    );
  }
  await assert.rejects(
    limiter.validate("198.51.100.1", "BEARER secret-key", async () => true),
    isLimited,
  );
  assert.equal(validations, 10);
  const digestKeys = Array.from(
    (limiter as any).digestCounters.keys() as Iterable<string>,
  );
  assert.equal(digestKeys.length, 1);
  assert.match(digestKeys[0], /^[a-f0-9]{64}$/);
  assert.ok(!digestKeys[0].includes("secret-key"));
  assert.ok(!JSON.stringify(limiter.snapshot()).includes("secret-key"));
});

test("client-IP attempt limit is 20", async () => {
  const limiter = new CredentialValidationLimiter(() => 2_000);
  for (let index = 0; index < VALIDATION_LIMITS.ipAttempts; index += 1) {
    await limiter.validate(
      "198.51.100.2",
      `key-${index}`,
      async () => true,
    );
  }
  await assert.rejects(
    limiter.validate("198.51.100.2", "one-more-key", async () => true),
    isLimited,
  );
});

test("distributed unique-key attempts are globally bounded at 240", async () => {
  const limiter = new CredentialValidationLimiter(() => 3_000);
  for (let index = 0; index < VALIDATION_LIMITS.globalAttempts; index += 1) {
    await limiter.validate(`203.0.113.${index}`, `key-${index}`, async () => true);
  }
  await assert.rejects(
    limiter.validate("203.0.113.next", "next-key", async () => true),
    isLimited,
  );
  assert.equal(limiter.snapshot().digestEntries, 240);
});

test("per-IP concurrency rejects rather than queues and releases in finally", async () => {
  const limiter = new CredentialValidationLimiter(() => 4_000);
  const releases: Array<(value: boolean) => void> = [];
  const pending = Array.from(
    { length: VALIDATION_LIMITS.ipConcurrency },
    (_, index) =>
      limiter.validate("198.51.100.4", `key-${index}`, () =>
        new Promise<boolean>((resolve) => releases.push(resolve)),
      ),
  );
  assert.equal(limiter.snapshot().globalInFlight, 4);
  await assert.rejects(
    limiter.validate("198.51.100.4", "fifth-key", async () => true),
    isLimited,
  );
  releases.forEach((release) => release(true));
  assert.deepEqual(await Promise.all(pending), [true, true, true, true]);
  assert.equal(limiter.snapshot().globalInFlight, 0);

  await assert.rejects(
    limiter.validate("198.51.100.5", "throwing-key", async () => {
      throw new Error("upstream failed");
    }),
    /upstream failed/,
  );
  assert.equal(limiter.snapshot().globalInFlight, 0);
});

test("global concurrency rejects the seventeenth validation", async () => {
  const limiter = new CredentialValidationLimiter(() => 5_000);
  const releases: Array<(value: boolean) => void> = [];
  const pending = Array.from(
    { length: VALIDATION_LIMITS.globalConcurrency },
    (_, index) =>
      limiter.validate(`198.51.100.${index}`, `global-key-${index}`, () =>
        new Promise<boolean>((resolve) => releases.push(resolve)),
      ),
  );
  assert.equal(limiter.snapshot().globalInFlight, 16);
  await assert.rejects(
    limiter.validate("198.51.100.17", "global-key-17", async () => true),
    isLimited,
  );
  releases.forEach((release) => release(true));
  await Promise.all(pending);
  assert.equal(limiter.snapshot().globalInFlight, 0);
});

test("windows expire after 60 seconds", async () => {
  let now = 10_000;
  const limiter = new CredentialValidationLimiter(() => now);
  for (let index = 0; index < VALIDATION_LIMITS.keyAttempts; index += 1) {
    await limiter.validate("198.51.100.6", "expiring-key", async () => true);
  }
  now += VALIDATION_LIMITS.windowMs;
  assert.equal(
    await limiter.validate("198.51.100.6", "expiring-key", async () => true),
    true,
  );
});

test("global and IP checks happen before digest allocation", async () => {
  const limiter = new CredentialValidationLimiter(() => 20_000);
  (limiter as any).globalCounter = {
    windowStartedAt: 20_000,
    attempts: VALIDATION_LIMITS.globalAttempts,
  };
  await assert.rejects(
    limiter.validate("198.51.100.7", "never-hashed", async () => true),
    isLimited,
  );
  assert.equal(limiter.snapshot().ipEntries, 0);
  assert.equal(limiter.snapshot().digestEntries, 0);

  const ipLimited = new CredentialValidationLimiter(() => 21_000);
  for (let index = 0; index < VALIDATION_LIMITS.ipAttempts; index += 1) {
    await ipLimited.validate(
      "198.51.100.70",
      `allocated-${index}`,
      async () => true,
    );
  }
  const before = ipLimited.snapshot().digestEntries;
  await assert.rejects(
    ipLimited.validate("198.51.100.70", "never-allocated", async () => true),
    isLimited,
  );
  assert.equal(ipLimited.snapshot().digestEntries, before);
});

test("digest map capacity fails closed and remains bounded", async () => {
  const limiter = new CredentialValidationLimiter(() => 30_000);
  const digestCounters = (limiter as any).digestCounters as Map<
    string,
    { windowStartedAt: number; attempts: number }
  >;
  for (let index = 0; index < VALIDATION_LIMITS.mapCapacity; index += 1) {
    digestCounters.set(index.toString(16).padStart(64, "0"), {
      windowStartedAt: 30_000,
      attempts: 0,
    });
  }
  await assert.rejects(
    limiter.validate("198.51.100.8", "capacity-key", async () => true),
    isLimited,
  );
  assert.equal(limiter.snapshot().digestEntries, VALIDATION_LIMITS.mapCapacity);
});

test("IP map capacity fails closed and remains bounded", async () => {
  const limiter = new CredentialValidationLimiter(() => 40_000);
  const ipCounters = (limiter as any).ipCounters as Map<
    string,
    { windowStartedAt: number; attempts: number; inFlight: number }
  >;
  for (let index = 0; index < VALIDATION_LIMITS.mapCapacity; index += 1) {
    ipCounters.set(`capacity-${index}`, {
      windowStartedAt: 40_000,
      attempts: 0,
      inFlight: 0,
    });
  }
  await assert.rejects(
    limiter.validate("new-capacity-ip", "capacity-key", async () => true),
    isLimited,
  );
  assert.equal(limiter.snapshot().ipEntries, VALIDATION_LIMITS.mapCapacity);
  assert.equal(limiter.snapshot().digestEntries, 0);
});

test("capacity cleanup removes expired entries from both bounded maps", async () => {
  const now = 200_000;
  const limiter = new CredentialValidationLimiter(() => now);
  const ipCounters = (limiter as any).ipCounters as Map<
    string,
    { windowStartedAt: number; attempts: number; inFlight: number }
  >;
  const digestCounters = (limiter as any).digestCounters as Map<
    string,
    { windowStartedAt: number; attempts: number }
  >;
  for (let index = 0; index < VALIDATION_LIMITS.mapCapacity; index += 1) {
    ipCounters.set(`expired-ip-${index}`, {
      windowStartedAt: now - VALIDATION_LIMITS.windowMs,
      attempts: 1,
      inFlight: 0,
    });
    digestCounters.set(index.toString(16).padStart(64, "0"), {
      windowStartedAt: now - VALIDATION_LIMITS.windowMs,
      attempts: 1,
    });
  }
  assert.equal(
    await limiter.validate("fresh-ip", "fresh-key", async () => true),
    true,
  );
  assert.deepEqual(limiter.snapshot(), {
    globalAttempts: 1,
    globalInFlight: 0,
    ipEntries: 1,
    digestEntries: 1,
  });
});

test("opportunistic cleanup retains in-flight IP state and releases per-IP in finally", async () => {
  const now = 300_000;
  const limiter = new CredentialValidationLimiter(() => now);
  const ipCounters = (limiter as any).ipCounters as Map<
    string,
    { windowStartedAt: number; attempts: number; inFlight: number }
  >;
  const digestCounters = (limiter as any).digestCounters as Map<
    string,
    { windowStartedAt: number; attempts: number }
  >;
  ipCounters.set("in-flight-expired", {
    windowStartedAt: now - VALIDATION_LIMITS.windowMs,
    attempts: 1,
    inFlight: 1,
  });
  ipCounters.set("idle-expired", {
    windowStartedAt: now - VALIDATION_LIMITS.windowMs,
    attempts: 1,
    inFlight: 0,
  });
  digestCounters.set("f".repeat(64), {
    windowStartedAt: now - VALIDATION_LIMITS.windowMs,
    attempts: 1,
  });
  (limiter as any).attemptSequence = VALIDATION_LIMITS.sweepEveryAttempts - 1;

  await assert.rejects(
    limiter.validate("finally-ip", "finally-key", async () => {
      throw new Error("expected validator failure");
    }),
    /expected validator failure/,
  );
  assert.equal(ipCounters.has("in-flight-expired"), true);
  assert.equal(ipCounters.has("idle-expired"), false);
  assert.equal(digestCounters.has("f".repeat(64)), false);
  assert.equal(ipCounters.get("finally-ip")?.inFlight, 0);
  assert.equal(limiter.snapshot().globalInFlight, 0);
});
