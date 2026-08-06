import { createHash } from "node:crypto";
import { SafeAPIError } from "./errors.js";
import { normalizeAuthorizationApiKey } from "./utils.js";

export const VALIDATION_LIMITS = Object.freeze({
  windowMs: 60_000,
  globalAttempts: 240,
  ipAttempts: 20,
  keyAttempts: 10,
  globalConcurrency: 16,
  ipConcurrency: 4,
  mapCapacity: 2_048,
  sweepEveryAttempts: 100,
});

interface WindowCounter {
  windowStartedAt: number;
  attempts: number;
}

interface IpCounter extends WindowCounter {
  inFlight: number;
}

export interface ValidationLimiterSnapshot {
  globalAttempts: number;
  globalInFlight: number;
  ipEntries: number;
  digestEntries: number;
}

type ValidationFunction = (authorization: string) => Promise<boolean>;

function limitError(): SafeAPIError {
  return new SafeAPIError(
    "rate_limit",
    "credential_validation_limited",
    "Too many authentication attempts. Try again later.",
    429,
  );
}

export class CredentialValidationLimiter {
  private globalCounter: WindowCounter = {
    windowStartedAt: 0,
    attempts: 0,
  };
  private globalInFlight = 0;
  private readonly ipCounters = new Map<string, IpCounter>();
  private readonly digestCounters = new Map<string, WindowCounter>();
  private attemptSequence = 0;

  constructor(private readonly now: () => number = Date.now) {}

  async validate(
    clientIp: string,
    authorization: string,
    validateApiKey: ValidationFunction,
  ): Promise<boolean> {
    const token = normalizeAuthorizationApiKey(authorization);
    if (!token) return false;

    const now = this.now();
    this.attemptSequence += 1;
    if (this.attemptSequence % VALIDATION_LIMITS.sweepEveryAttempts === 0) {
      this.sweepExpired(now);
    }

    this.globalCounter = this.currentCounter(this.globalCounter, now);
    if (this.globalCounter.attempts >= VALIDATION_LIMITS.globalAttempts) {
      throw limitError();
    }

    const normalizedIp = this.normalizedIp(clientIp);
    const ipCounter = this.ipCounter(normalizedIp, now);
    if (ipCounter.attempts >= VALIDATION_LIMITS.ipAttempts) {
      throw limitError();
    }

    // Attempts rejected for concurrency still consume the global/IP budget.
    this.globalCounter.attempts += 1;
    ipCounter.attempts += 1;
    if (
      this.globalInFlight >= VALIDATION_LIMITS.globalConcurrency ||
      ipCounter.inFlight >= VALIDATION_LIMITS.ipConcurrency
    ) {
      throw limitError();
    }

    // Allocate digest state only after the global and IP checks above.
    const digest = createHash("sha256").update(token).digest("hex");
    const digestCounter = this.digestCounter(digest, now);
    if (digestCounter.attempts >= VALIDATION_LIMITS.keyAttempts) {
      throw limitError();
    }
    digestCounter.attempts += 1;

    this.globalInFlight += 1;
    ipCounter.inFlight += 1;
    try {
      return await validateApiKey(authorization);
    } finally {
      this.globalInFlight -= 1;
      ipCounter.inFlight -= 1;
    }
  }

  snapshot(): ValidationLimiterSnapshot {
    return {
      globalAttempts: this.globalCounter.attempts,
      globalInFlight: this.globalInFlight,
      ipEntries: this.ipCounters.size,
      digestEntries: this.digestCounters.size,
    };
  }

  private currentCounter(counter: WindowCounter, now: number): WindowCounter {
    if (
      counter.windowStartedAt === 0 ||
      now - counter.windowStartedAt >= VALIDATION_LIMITS.windowMs
    ) {
      return { windowStartedAt: now, attempts: 0 };
    }
    return counter;
  }

  private ipCounter(ip: string, now: number): IpCounter {
    const existing = this.ipCounters.get(ip);
    if (existing) {
      const current = this.currentCounter(existing, now);
      if (current !== existing) {
        existing.windowStartedAt = current.windowStartedAt;
        existing.attempts = current.attempts;
      }
      return existing;
    }
    this.ensureCapacity(this.ipCounters, now);
    const created: IpCounter = { windowStartedAt: now, attempts: 0, inFlight: 0 };
    this.ipCounters.set(ip, created);
    return created;
  }

  private digestCounter(digest: string, now: number): WindowCounter {
    const existing = this.digestCounters.get(digest);
    if (existing) {
      const current = this.currentCounter(existing, now);
      if (current !== existing) {
        existing.windowStartedAt = current.windowStartedAt;
        existing.attempts = current.attempts;
      }
      return existing;
    }
    this.ensureCapacity(this.digestCounters, now);
    const created = { windowStartedAt: now, attempts: 0 };
    this.digestCounters.set(digest, created);
    return created;
  }

  private ensureCapacity<T extends WindowCounter>(
    counters: Map<string, T>,
    now: number,
  ): void {
    if (counters.size < VALIDATION_LIMITS.mapCapacity) return;
    this.sweepExpired(now);
    if (counters.size >= VALIDATION_LIMITS.mapCapacity) throw limitError();
  }

  private sweepExpired(now: number): void {
    for (const [ip, counter] of this.ipCounters) {
      if (
        counter.inFlight === 0 &&
        now - counter.windowStartedAt >= VALIDATION_LIMITS.windowMs
      ) {
        this.ipCounters.delete(ip);
      }
    }
    for (const [digest, counter] of this.digestCounters) {
      if (now - counter.windowStartedAt >= VALIDATION_LIMITS.windowMs) {
        this.digestCounters.delete(digest);
      }
    }
  }

  private normalizedIp(clientIp: string): string {
    const value = clientIp.trim();
    return value.length > 0 && value.length <= 128 ? value : "unknown";
  }
}
