# BALLDONTLIE MCP Server

Remote Model Context Protocol server for the BALLDONTLIE sports API. The tool catalog is generated from the vendored public OpenAPI specifications so endpoint methods, paths, parameters, and constraints stay aligned with the API source.

The current generated surface contains 505 tools from 27 specifications: Account, ATP, Bundesliga, college baseball, Counter-Strike, Dota 2, EPL, F1, FIFA World Cup, La Liga, Ligue 1, League of Legends, MLB, MLS, MMA, NBA, NCAAB, NCAAF, NCAAW, NFL, NHL, PGA, Serie A, UCL, Valorant, WNBA, and WTA. `/health` reports the authoritative runtime count and deployed revision.

## Authentication

Every MCP request requires a BALLDONTLIE API key:

```http
Authorization: Bearer YOUR_API_KEY
```

Initialization, tool listing, authenticated documentation, and API operations that are public outside the MCP validate the supplied key before proceeding. Other tool calls forward only the Authorization header to the corresponding authenticated BALLDONTLIE endpoint.

Public service metadata is limited to `/health` and `/.well-known/mcp-config`. `/api/docs` requires a valid API key.

## Sensitive Account tools

The complete Account API surface is registered, but the following tools are disabled by default:

- `account_signup`
- `account_rotate_api_key`
- `account_change_subscription`
- `account_cancel_subscription`
- `account_create_checkout`
- `account_get_billing_portal`

They can create credentials, change billing state, or return sensitive hosted billing-session URLs. A deployment must set `ENABLE_SENSITIVE_ACCOUNT_TOOLS=true` exactly to enable them. Enabling the flag means those values may intentionally enter the authenticated caller's MCP transcript. Other spellings, casing, or whitespace fail closed.

`account_get_me` remains available but always omits the `api_key` response field.

## MCP request example

```bash
curl https://mcp.balldontlie.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "nba_get_teams",
      "arguments": {}
    }
  }'
```

Use `tools/list` to retrieve the current catalog, input schemas, and MCP read-only/destructive annotations.

## Development

```bash
npm ci
npm run check:openapi
npm test
npm run build
```

The tests independently compare every generated operation and input against all vendored specifications. They also cover legacy tool-name compatibility, exact array query serialization, path/body dispatch, credential-safe errors and logs, API-key validation limits, and Account safety controls. Tests never call a live Account mutation.

### Updating from the API source

1. Copy `balldontlie-2/marketing/public/openapi.yml` to `openapi.yml`.
2. Copy every `balldontlie-2/marketing/public/openapi/*.yml` file into `openapi/`.
3. Update `scripts/openapi-source.json` to the source API commit.
4. Run `npm run generate:openapi`.
5. Run `npm test` and `npm run build`.

Generated `src/tools/*.ts`, `src/schemas/*.ts`, and registry files are checked in and must not be edited manually. Runtime does not parse YAML and has no production YAML-parser dependency.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `BACKEND_API_URL` | `https://api.balldontlie.io` | BALLDONTLIE API base URL |
| `API_TIMEOUT` | `30000` | Upstream timeout in milliseconds |
| `ENABLE_DEBUG` | `false` | Logs only method, query-free path, and query-field count |
| `ENABLE_SENSITIVE_ACCOUNT_TOOLS` | `false` | Enables sensitive Account tools only when exactly `true` |
| `TRUST_PROXY_HOPS` | `1` in production, `0` otherwise | Validated trusted proxy hop count; only `0` or `1` is accepted |
| `ENABLE_TRACING` | `false` | Enables Datadog tracing when an agent host is configured |

Authorization values, query values, request bodies, raw upstream errors, API-key responses, and hosted billing-session URLs are excluded from server logs and tracing tags.
