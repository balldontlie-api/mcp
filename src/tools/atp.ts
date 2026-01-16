import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/atp-schemas.js";

export function createATPTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "atp_get_players",
      description:
        "Get ATP tennis players with optional filters. Men's singles only. Free tier.",
      inputSchema: schemas.atpPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/atp/v1/players", params, headers);
      },
    },

    {
      name: "atp_get_player",
      description:
        "Get a specific ATP player by ID. Men's singles only. Free tier.",
      inputSchema: schemas.atpPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/atp/v1/players/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "atp_get_tournaments",
      description: "Get ATP tournaments with optional filters. Free tier.",
      inputSchema: schemas.atpTournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/tournaments",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_tournament",
      description: "Get a specific ATP tournament by ID. Free tier.",
      inputSchema: schemas.atpTournamentByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/atp/v1/tournaments/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "atp_get_rankings",
      description: "Get current ATP rankings. Free tier.",
      inputSchema: schemas.atpRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_matches",
      description:
        "Get ATP matches with optional filters. Requires ALL-STAR tier.",
      inputSchema: schemas.atpMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/atp/v1/matches", params, headers);
      },
    },

    {
      name: "atp_get_match",
      description: "Get a specific ATP match by ID. Requires ALL-STAR tier.",
      inputSchema: schemas.atpMatchByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/atp/v1/matches/${id}`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "atp_get_race",
      description:
        "Get ATP Race to Turin standings for season-ending ATP Finals qualification. Requires ALL-STAR tier.",
      inputSchema: schemas.atpRaceSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/atp_race",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_match_stats",
      description:
        "Get detailed ATP match statistics. Requires GOAT tier.",
      inputSchema: schemas.atpMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/match_stats",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_player_career_stats",
      description:
        "Get ATP player career statistics. Requires GOAT tier.",
      inputSchema: schemas.atpPlayerCareerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/player_career_stats",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_head_to_head",
      description:
        "Get head-to-head record between two ATP players. Requires GOAT tier.",
      inputSchema: schemas.atpHeadToHeadSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/atp/v1/head_to_head",
          params,
          headers
        );
      },
    },

    {
      name: "atp_get_odds",
      description:
        "Get betting odds for ATP matches. Requires at least one filter. Requires GOAT tier.",
      inputSchema: schemas.atpOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/atp/v1/odds", params, headers);
      },
    },
  ];
}
