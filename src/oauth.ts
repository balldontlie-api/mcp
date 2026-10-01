import { createPublicKey, verify } from "node:crypto";
import express, { Request, Response } from "express";
import axios from "axios";
import type { MCPTool } from "./types.js";
import { toSafeAPIError } from "./errors.js";
import { SERVER_VERSION } from "./version.js";

export function oauthRouter(tools: Map<string, MCPTool>) {
  const router = express.Router();
  if (process.env.OAUTH_ENABLED !== "true") return router;
  const issuer = process.env.OAUTH_ISSUER || "https://api.balldontlie.io";
  const resource =
    process.env.OAUTH_RESOURCE || "https://mcp.balldontlie.io/oauth/mcp";
  const secret = process.env.OAUTH_EXCHANGE_SECRET || "";
  for (const value of [issuer, resource]) {
    const u = new URL(value);
    if (
      u.username ||
      u.password ||
      u.hash ||
      u.search ||
      (u.protocol !== "https:" && process.env.NODE_ENV !== "test")
    )
      throw new Error("Invalid OAuth configuration");
  }
  if (secret.length < 32 || new URL(resource).pathname !== "/oauth/mcp")
    throw new Error("Invalid OAuth configuration");
  const metadataURL = `${
    new URL(resource).origin
  }/.well-known/oauth-protected-resource/oauth/mcp`;
  const challenge = `Bearer resource_metadata="${metadataURL}", scope="sports:read", error="invalid_token", error_description="Sign in to BALLDONTLIE to continue"`;
  const sports = new Map(
    [...tools].filter(
      ([, tool]) =>
        tool.definition.method === "GET" &&
        !tool.definition.sourceFile.includes("account")
    )
  );
  const http = axios.create({
    timeout: 5000,
    maxRedirects: 0,
    proxy: false,
    maxContentLength: 32768,
  });
  let jwks: any[] = [],
    expires = 0,
    fetching: Promise<void> | undefined;
  async function verifyToken(token: string) {
    if (token.length > 8192) throw new Error("Unauthorized");
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Unauthorized");
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (
      header.alg !== "RS256" ||
      header.typ !== "at+jwt" ||
      typeof header.kid !== "string"
    )
      throw new Error("Unauthorized");
    if (expires <= Date.now()) {
      fetching ||= http
        .get(`${issuer}/oauth/jwks`)
        .then(({ data }) => {
          if (!Array.isArray(data.keys) || data.keys.length > 10)
            throw new Error("Unavailable");
          jwks = data.keys;
          expires = Date.now() + 60000;
        })
        .finally(() => {
          fetching = undefined;
        });
      await fetching;
    }
    const jwk = jwks.find(
      (k) =>
        k.kid === header.kid &&
        k.kty === "RSA" &&
        k.alg === "RS256" &&
        k.use === "sig"
    );
    if (
      !jwk ||
      !verify(
        "RSA-SHA256",
        Buffer.from(parts.slice(0, 2).join(".")),
        createPublicKey({ key: jwk, format: "jwk" }),
        Buffer.from(parts[2], "base64url")
      )
    )
      throw new Error("Unauthorized");
    const p = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (
      p.iss !== issuer ||
      p.aud !== resource ||
      p.scope !== "sports:read" ||
      !Number.isSafeInteger(p.exp) ||
      p.exp <= Date.now() / 1000 ||
      !Number.isSafeInteger(p.iat) ||
      p.iat > Date.now() / 1000 + 30
    )
      throw new Error("Unauthorized");
  }
  const unauthorized = (res: Response, id: unknown) =>
    res
      .set("WWW-Authenticate", challenge)
      .status(401)
      .json({
        jsonrpc: "2.0",
        id: id ?? null,
        result: {
          content: [{ type: "text", text: "Sign in to BALLDONTLIE to continue." }],
          isError: true,
          _meta: { "mcp/www_authenticate": [challenge] },
        },
      });
  router.get("/.well-known/oauth-protected-resource/oauth/mcp", (_req, res) =>
    res.json({
      resource,
      authorization_servers: [issuer],
      scopes_supported: ["sports:read"],
      bearer_methods_supported: ["header"],
    })
  );
  router.all("/oauth/mcp", async (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");
    const origin = req.headers.origin;
    if (origin && origin !== new URL(resource).origin)
      return res.sendStatus(403);
    if (req.method !== "POST") return res.set("Allow", "POST").sendStatus(405);
    const { id, method, params } = req.body || {};
    const error = (status: number, code: number, message: string) =>
      res
        .status(status)
        .json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
    if (
      req.body?.jsonrpc !== "2.0" ||
      typeof method !== "string" ||
      Array.isArray(req.body)
    )
      return error(400, -32600, "Invalid Request");
    if (method.startsWith("notifications/") && id === undefined)
      return res.sendStatus(202);
    const versions = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
    if (
      req.headers["mcp-protocol-version"] &&
      !versions.includes(String(req.headers["mcp-protocol-version"]))
    )
      return error(400, -32600, "Unsupported protocol version");
    let result: unknown;
    if (method === "initialize")
      result = {
        protocolVersion: versions.includes(params?.protocolVersion)
          ? params.protocolVersion
          : versions[0],
        capabilities: { tools: {} },
        serverInfo: { name: "balldontlie-api", version: SERVER_VERSION },
      };
    else if (method === "ping") result = {};
    else if (method === "tools/list")
      result = {
        tools: [...sports.values()].map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: t.annotations,
          securitySchemes: [{ type: "oauth2", scopes: ["sports:read"] }],
          _meta: {
            securitySchemes: [{ type: "oauth2", scopes: ["sports:read"] }],
          },
        })),
      };
    else if (method === "tools/call") {
      const tool = sports.get(params?.name);
      if (!tool) return error(400, -32602, "Unknown tool");
      const auth = req.headers.authorization;
      if (!auth?.startsWith("Bearer ")) return unauthorized(res, id);
      const token = auth.slice(7);
      try {
        await verifyToken(token);
      } catch {
        return unauthorized(res, id);
      }
      let delegated: string;
      try {
        const response = await http.post(
          `${issuer}/oauth/token`,
          new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            subject_token: token,
            subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
            resource: issuer,
          }),
          { auth: { username: "bdl-mcp", password: secret } }
        );
        delegated = response.data.access_token;
        if (typeof delegated !== "string") throw new Error("Unavailable");
      } catch (e) {
        if (
          axios.isAxiosError(e) &&
          [400, 401].includes(e.response?.status || 0)
        )
          return unauthorized(res, id);
        return error(503, -32003, "Authorization service unavailable");
      }
      try {
        const value = await tool.handler(params?.arguments || {}, {
          Authorization: `Bearer ${delegated}`,
        });
        result = { content: [{ type: "text", text: JSON.stringify(value) }] };
      } catch (e) {
        const safe = toSafeAPIError(e);
        if (safe.statusCode === 401) {
          // Sports API also uses 401 for tier denials. Confirm the connection is
          // still valid before asking a user to sign in again.
          try {
            await http.post(
              `${issuer}/oauth/token`,
              new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
                subject_token: token,
                subject_token_type:
                  "urn:ietf:params:oauth:token-type:access_token",
                resource: issuer,
              }),
              { auth: { username: "bdl-mcp", password: secret } }
            );
            return res.json({
              jsonrpc: "2.0",
              id: id ?? null,
              result: {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      error: {
                        code: "subscription_required",
                        message:
                          "Your BALLDONTLIE subscription does not include this data.",
                      },
                    }),
                  },
                ],
                isError: true,
              },
            });
          } catch (authError) {
            if (
              axios.isAxiosError(authError) &&
              [400, 401].includes(authError.response?.status || 0)
            )
              return unauthorized(res, id);
            return error(503, -32003, "Authorization service unavailable");
          }
        }
        result = {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: safe.toPublicPayload() }),
            },
          ],
          isError: true,
        };
      }
    } else return error(404, -32601, "Method not found");
    return res.json({ jsonrpc: "2.0", id: id ?? null, result });
  });
  return router;
}
