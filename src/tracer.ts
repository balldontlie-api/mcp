import tracer from "dd-trace";
import { SERVER_VERSION } from "./version.js";

// Only initialize tracer if DD_AGENT_HOST is configured
const DD_AGENT_HOST = process.env.DD_AGENT_HOST;
const ENABLE_TRACING = process.env.ENABLE_TRACING === "true";

if (DD_AGENT_HOST && ENABLE_TRACING) {
  tracer.init({
    service: "balldontlie-mcp-server",
    env: process.env.NODE_ENV || "development",
    hostname: DD_AGENT_HOST,
    profiling: process.env.DD_PROFILING_ENABLED === "true",
    logInjection: true,
    version: process.env.SERVICE_VERSION || SERVER_VERSION,
    // Never permit ambient header-tag configuration to capture Authorization.
    headerTags: [],
  });

  // Keep only inbound HTTP spans. Outbound spans can otherwise retain raw
  // transport errors or be configured to capture Authorization headers.
  tracer.use("http", {
    filter: (urlOrPath) => urlOrPath.startsWith("/"),
    headers: [],
    queryStringObfuscation: true,
  });

  // Express instrumentation receives raw middleware errors (including JSON
  // parser errors). HTTP spans plus server-resolved tags provide the useful
  // telemetry without handing those objects to the tracer.
  tracer.use("express", { enabled: false });
}

export default tracer;
