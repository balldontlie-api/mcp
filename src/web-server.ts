#!/usr/bin/env node

import "./tracer.js";
import tracer from "./tracer.js";
import express, { Request, Response } from "express";
import { APIClient } from "./client.js";
import { ConfigManager } from "./utils.js";
import { createNBATools } from "./tools/nba.js";
import { createNFLTools } from "./tools/nfl.js";
import { createMLBTools } from "./tools/mlb.js";
import { createEPLTools } from "./tools/epl.js";
import { createNHLTools } from "./tools/nhl.js";
import { createWNBATools } from "./tools/wnba.js";
import { createNCAAFTools } from "./tools/ncaaf.js";
import { createNCAABTools } from "./tools/ncaab.js";
import { createMMATools } from "./tools/mma.js";
import { createCS2Tools } from "./tools/cs2.js";
import { createLOLTools } from "./tools/lol.js";
import { createDotaTools } from "./tools/dota.js";
import { createFIFATools } from "./tools/fifa.js";
import { createLaLigaTools } from "./tools/laliga.js";
import { createSerieATools } from "./tools/seriea.js";
import { createUCLTools } from "./tools/ucl.js";
import { createBundesligaTools } from "./tools/bundesliga.js";
import { createLigue1Tools } from "./tools/ligue1.js";
import { createMLSTools } from "./tools/mls.js";
import { createPGATools } from "./tools/pga.js";
import { createATPTools } from "./tools/atp.js";
import { createWTATools } from "./tools/wta.js";
import { MCPTool } from "./types.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize tools
let tools: Map<string, MCPTool> = new Map();
let apiClient: APIClient;

async function initializeTools() {
  try {
    const config = ConfigManager.load();
    apiClient = new APIClient(config);

    // Load all sport tools
    const allTools = [
      ...createNBATools(apiClient),
      ...createNFLTools(apiClient),
      ...createMLBTools(apiClient),
      ...createEPLTools(apiClient),
      ...createNHLTools(apiClient),
      ...createWNBATools(apiClient),
      ...createNCAAFTools(apiClient),
      ...createNCAABTools(apiClient),
      ...createMMATools(apiClient),
      ...createCS2Tools(apiClient),
      ...createLOLTools(apiClient),
      ...createDotaTools(apiClient),
      ...createFIFATools(apiClient),
      ...createLaLigaTools(apiClient),
      ...createSerieATools(apiClient),
      ...createUCLTools(apiClient),
      ...createBundesligaTools(apiClient),
      ...createLigue1Tools(apiClient),
      ...createMLSTools(apiClient),
      ...createPGATools(apiClient),
      ...createATPTools(apiClient),
      ...createWTATools(apiClient),
    ];

    allTools.forEach((tool) => {
      tools.set(tool.name, tool);
    });

    console.log(`Initialized ${tools.size} sports API tools`);
  } catch (error) {
    console.error("Failed to initialize tools:", error);
    throw error;
  }
}

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "balldontlie-mcp-server",
    version: "1.0.0",
    tools: tools.size,
  });
});

// MCP configuration discovery endpoint
app.get("/.well-known/mcp-config", (req: Request, res: Response) => {
  res.json({
    $schema: "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json",
    name: "io.balldontlie/mcp",
    description: "Provides access to live sports data and analytics from BALLDONTLIE: The Sports API",
    status: "active",
    repository: {
      url: "https://github.com/balldontlie-api/mcp",
      source: "github",
    },
    version: "1.1.0",
    remotes: [
      {
        type: "streamable-http",
        url: "https://mcp.balldontlie.io/mcp",
        headers: [
          {
            name: "Authorization",
            description: "API key for authentication",
            is_required: true,
            is_secret: true,
          },
        ],
      },
    ],
  });
});

// MCP Protocol endpoint
app.post("/mcp", async (req, res) => {
  try {
    const { jsonrpc, id, method, params } = req.body;

    // Validate JSON-RPC format
    if (jsonrpc !== "2.0" || !method) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: id || null,
        error: {
          code: -32600,
          message: "Invalid Request",
        },
      });
    }

    // Extract authorization from headers
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        jsonrpc: "2.0",
        id: id || null,
        error: {
          code: -32001,
          message: "Unauthorized: Authorization header required",
        },
      });
    }

    let result;

    switch (method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "balldontlie-api",
            version: "1.0.0",
          },
        };
        break;

      case "notifications/initialized":
        // MCP protocol notification - just acknowledge receipt
        result = {};
        break;

      case "tools/list":
        const toolList = Array.from(tools.values()).map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        }));
        result = { tools: toolList };
        break;

      case "tools/call":
        const { name, arguments: args } = params || {};

        if (!name) {
          return res.status(400).json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32602,
              message: "Invalid params: missing tool name",
            },
          });
        }

        const tool = tools.get(name);
        if (!tool) {
          return res.status(404).json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          });
        }

        try {
          const headers: Record<string, string> = {};
          if (authHeader) {
            headers.Authorization = authHeader;
          }

          const toolResult = await tool.handler(args || {}, headers);

          result = {
            content: [
              {
                type: "text",
                text: JSON.stringify(toolResult, null, 2),
              },
            ],
          };
        } catch (toolError) {
          const span = tracer.scope().active();
          span?.setTag("error", toolError instanceof Error ? toolError.message : String(toolError));

          return res.status(500).json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32603,
              message: `Tool execution failed: ${
                toolError instanceof Error
                  ? toolError.message
                  : String(toolError)
              }`,
            },
          });
        }
        break;

      default:
        return res.status(404).json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        });
    }

    res.json({
      jsonrpc: "2.0",
      id,
      result,
    });
  } catch (error) {
    console.error("MCP request error:", error);

    const span = tracer.scope().active();
    span?.setTag("error", error instanceof Error ? error.message : String(error));

    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: "Internal error",
      },
    });
  }
});

// API documentation endpoint
app.get("/api/docs", (req: Request, res: Response) => {
  if (!tools.size) {
    return res.status(503).json({ error: "Server not initialized" });
  }

  const toolList = Array.from(tools.values()).map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  res.json({
    server: {
      name: "BALLDONTLIE Sports MCP Server",
      version: "1.0.0",
      description:
        "Remote MCP server providing access to comprehensive sports data",
    },
    endpoints: {
      mcp: "/mcp",
      health: "/health",
      docs: "/api/docs",
    },
    tools: toolList.reduce((acc, tool) => {
      const sport = tool.name.split("_")[0].toUpperCase();
      if (!acc[sport]) acc[sport] = [];
      acc[sport].push(tool);
      return acc;
    }, {} as Record<string, any>),
    usage: {
      authentication:
        "Include your BALLDONTLIE API key in the Authorization header",
      example: {
        url: "/mcp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "<YOUR_API_KEY>",
        },
        body: {
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "nba_get_teams",
            arguments: {},
          },
        },
      },
    },
  });
});

// Start server
async function startServer() {
  try {
    await initializeTools();

    app.listen(port, () => {
      console.log(`🚀 BALLDONTLIE Sports MCP Server running on port ${port}`);
      console.log(`📊 Health check: http://0.0.0.0:${port}/health`);
      console.log(`📖 API docs: http://0.0.0.0:${port}/api/docs`);
      console.log(`🔌 MCP endpoint: http://0.0.0.0:${port}/mcp`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
