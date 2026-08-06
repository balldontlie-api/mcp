#!/usr/bin/env node

import "./tracer.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { NextFunction, Request, Response } from "express";
import { CredentialValidationLimiter } from "./auth-gate.js";
import { APIClient } from "./client.js";
import { SafeAPIError, toSafeAPIError } from "./errors.js";
import tracer from "./tracer.js";
import { createAllTools } from "./tool-registry.js";
import type { Config, MCPTool } from "./types.js";
import { ConfigManager } from "./utils.js";
import { SERVER_VERSION } from "./version.js";

export interface ServerDependencies {
  config?: Config;
  apiClient?: APIClient;
  validationLimiter?: CredentialValidationLimiter;
}

export interface CreatedServer {
  app: express.Express;
  tools: Map<string, MCPTool>;
  config: Config;
}

interface JsonRpcRequestBody {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
}

function rpcError(
  res: Response,
  status: number,
  id: unknown,
  code: number,
  message: string,
) {
  return res.status(status).json({
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message },
  });
}

function plainGatewayError(res: Response, error: unknown) {
  const safe = toSafeAPIError(error);
  if (safe.category === "rate_limit") {
    return res.status(429).json({ error: "Too many authentication attempts" });
  }
  if (safe.category === "authorization") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.status(503).json({ error: "Authentication service unavailable" });
}

function rpcGatewayError(res: Response, id: unknown, error: unknown) {
  const safe = toSafeAPIError(error);
  if (safe.category === "rate_limit") {
    return rpcError(res, 429, id, -32002, "Too many authentication attempts");
  }
  if (safe.category === "authorization") {
    return rpcError(res, 401, id, -32001, "Unauthorized");
  }
  return rpcError(res, 503, id, -32003, "Authentication service unavailable");
}

function publicTool(tool: MCPTool) {
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    ...(tool.annotations ? { annotations: tool.annotations } : {}),
  };
}

function safeTraceToolError(tool: MCPTool, error: SafeAPIError): void {
  const span = tracer.scope().active();
  span?.setTag("error.type", error.category);
  span?.setTag("error.status", error.statusCode);
  span?.setTag("mcp.tool", tool.name);
}

function safeTraceMcpRequest(method: string, tool?: MCPTool): void {
  const span = tracer.scope().active();
  span?.setTag("mcp.method", method);
  if (tool) span?.setTag("mcp.tool", tool.name);
}

export function createServer(dependencies: ServerDependencies = {}): CreatedServer {
  const config = dependencies.config ?? ConfigManager.load();
  const apiClient = dependencies.apiClient ?? new APIClient(config);
  const validationLimiter =
    dependencies.validationLimiter ?? new CredentialValidationLimiter();
  const allTools = createAllTools(apiClient, {
    enableSensitiveAccountTools: config.ENABLE_SENSITIVE_ACCOUNT_TOOLS,
  });
  const tools = new Map(allTools.map((tool) => [tool.name, tool]));
  if (tools.size !== allTools.length) {
    throw new Error("Generated MCP tool names are not unique");
  }

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.TRUST_PROXY_HOPS);
  app.use(express.json());

  const validateCredential = async (
    req: Request,
    authorization: string,
  ): Promise<boolean> =>
    validationLimiter.validate(
      req.ip ?? req.socket.remoteAddress ?? "unknown",
      authorization,
      (header) =>
      apiClient.validateApiKey(header),
    );

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "balldontlie-mcp-server",
      version: SERVER_VERSION,
      tools: tools.size,
      ...(process.env.RENDER_GIT_COMMIT
        ? { revision: process.env.RENDER_GIT_COMMIT }
        : {}),
    });
  });

  app.get("/.well-known/mcp-config", (_req: Request, res: Response) => {
    res.json({
      $schema:
        "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json",
      name: "io.balldontlie/mcp",
      description:
        "Provides access to live sports data and analytics from BALLDONTLIE: The Sports API",
      status: "active",
      repository: {
        url: "https://github.com/balldontlie-api/mcp",
        source: "github",
      },
      version: SERVER_VERSION,
      remotes: [
        {
          type: "streamable-http",
          url: "https://mcp.balldontlie.io/mcp",
          headers: [
            {
              name: "Authorization",
              description: "BALLDONTLIE API key for authentication",
              is_required: true,
              is_secret: true,
            },
          ],
        },
      ],
    });
  });

  app.post("/mcp", async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as JsonRpcRequestBody;
    const { jsonrpc, id, method } = body;
    if (jsonrpc !== "2.0" || typeof method !== "string") {
      return rpcError(res, 400, id, -32600, "Invalid Request");
    }

    const authorization = req.headers.authorization;
    tracer.scope().active()?.setTag("has_auth", Boolean(authorization));
    if (!authorization) {
      return rpcError(res, 401, id, -32001, "Unauthorized");
    }

    let result: unknown;
    if (method === "initialize") {
      safeTraceMcpRequest("initialize");
      try {
        if (!(await validateCredential(req, authorization))) {
          return rpcError(res, 401, id, -32001, "Unauthorized");
        }
      } catch (error) {
        return rpcGatewayError(res, id, error);
      }
      result = {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "balldontlie-api", version: SERVER_VERSION },
      };
    } else if (method === "notifications/initialized") {
      safeTraceMcpRequest("notifications/initialized");
      result = {};
    } else if (method === "tools/list") {
      safeTraceMcpRequest("tools/list");
      try {
        if (!(await validateCredential(req, authorization))) {
          return rpcError(res, 401, id, -32001, "Unauthorized");
        }
      } catch (error) {
        return rpcGatewayError(res, id, error);
      }
      result = { tools: Array.from(tools.values(), publicTool) };
    } else if (method === "tools/call") {
      const params =
        body.params && typeof body.params === "object"
          ? (body.params as Record<string, unknown>)
          : {};
      const name = params.name;
      safeTraceMcpRequest("tools/call");
      if (typeof name !== "string" || !name) {
        return rpcError(res, 400, id, -32602, "Invalid params: missing tool name");
      }
      const tool = tools.get(name);
      if (!tool) return rpcError(res, 404, id, -32601, `Unknown tool: ${name}`);
      safeTraceMcpRequest("tools/call", tool);

      if (tool.definition.security === "public") {
        try {
          if (!(await validateCredential(req, authorization))) {
            return rpcError(res, 401, id, -32001, "Unauthorized");
          }
        } catch (error) {
          return rpcGatewayError(res, id, error);
        }
      }

      const args =
        params.arguments && typeof params.arguments === "object"
          ? (params.arguments as Record<string, unknown>)
          : {};
      try {
        const toolResult = await tool.handler(args, {
          Authorization: authorization,
        });
        result = {
          content: [
            { type: "text", text: JSON.stringify(toolResult, null, 2) },
          ],
        };
      } catch (error) {
        const safe = toSafeAPIError(error);
        safeTraceToolError(tool, safe);
        result = {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: safe.toPublicPayload() }, null, 2),
            },
          ],
          isError: true,
        };
      }
    } else {
      return rpcError(res, 404, id, -32601, `Method not found: ${method}`);
    }

    return res.json({ jsonrpc: "2.0", id: id ?? null, result });
  });

  app.get("/api/docs", async (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "Unauthorized" });
    try {
      if (!(await validateCredential(req, authorization))) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      return plainGatewayError(res, error);
    }

    const toolList = Array.from(tools.values(), publicTool);
    return res.json({
      server: {
        name: "BALLDONTLIE Sports MCP Server",
        version: SERVER_VERSION,
        description:
          "Remote MCP server providing access to comprehensive sports data",
      },
      endpoints: { mcp: "/mcp", health: "/health", docs: "/api/docs" },
      tools: toolList.reduce(
        (grouped, tool) => {
          const sport = tool.name.split("_")[0].toUpperCase();
          (grouped[sport] ??= []).push(tool);
          return grouped;
        },
        {} as Record<string, ReturnType<typeof publicTool>[]>,
      ),
      usage: {
        authentication:
          "Include your BALLDONTLIE API key in the Authorization header",
        sensitiveAccountToolsEnabled: config.ENABLE_SENSITIVE_ACCOUNT_TOOLS,
      },
    });
  });

  app.use(
    (
      _error: unknown,
      req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      if (req.path === "/mcp") {
        return rpcError(res, 400, null, -32700, "Parse error");
      }
      return res.status(400).json({ error: "Invalid request" });
    },
  );

  return { app, tools, config };
}

export async function startServer(): Promise<void> {
  const { app, tools } = createServer();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(
      `BALLDONTLIE MCP server ${SERVER_VERSION} listening on port ${port} with ${tools.size} tools`,
    );
  });
}

const entrypoint = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (entrypoint === fileURLToPath(import.meta.url)) {
  startServer().catch(() => {
    console.error("BALLDONTLIE MCP server failed to start");
    process.exit(1);
  });
}
