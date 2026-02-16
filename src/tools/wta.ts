import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/wta-schemas.js";

export function createWTATools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "wta_get_players",
      description:
        "Get WTA tennis players with optional filters. Women's singles only. Free tier.",
      inputSchema: schemas.wtaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wta/v1/players", params, headers);
      },
    },

    {
      name: "wta_get_player",
      description:
        "Get a specific WTA player by ID. Women's singles only. Free tier.",
      inputSchema: schemas.wtaPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/wta/v1/players/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "wta_get_tournaments",
      description: "Get WTA tournaments with optional filters. Free tier.",
      inputSchema: schemas.wtaTournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wta/v1/tournaments",
          params,
          headers
        );
      },
    },

    {
      name: "wta_get_tournament",
      description: "Get a specific WTA tournament by ID. Free tier.",
      inputSchema: schemas.wtaTournamentByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/wta/v1/tournaments/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "wta_get_rankings",
      description: "Get current WTA rankings. Free tier.",
      inputSchema: schemas.wtaRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wta/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "wta_get_matches",
      description:
        "Get WTA matches with optional filters. Requires ALL-STAR tier.",
      inputSchema: schemas.wtaMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wta/v1/matches", params, headers);
      },
    },

    {
      name: "wta_get_match",
      description: "Get a specific WTA match by ID. Requires ALL-STAR tier.",
      inputSchema: schemas.wtaMatchByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/wta/v1/matches/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "wta_get_head_to_head",
      description:
        "Get head-to-head record between two WTA players. Requires GOAT tier.",
      inputSchema: schemas.wtaHeadToHeadSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wta/v1/head_to_head",
          params,
          headers
        );
      },
    },

    {
      name: "wta_get_odds",
      description:
        "Get betting odds for WTA matches. Requires at least one filter. Requires GOAT tier.",
      inputSchema: schemas.wtaOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wta/v1/odds", params, headers);
      },
    },

    {
      name: "wta_get_match_stats",
      description:
        "Get detailed WTA match statistics. Requires GOAT tier.",
      inputSchema: schemas.wtaMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wta/v1/match_stats",
          params,
          headers
        );
      },
    },
  ];
}
