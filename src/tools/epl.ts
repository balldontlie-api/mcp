import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as soccerSchemas from "../schemas/soccer-schemas.js";

export function createEPLTools(apiClient: APIClient): MCPTool[] {
  return [
    // ============================================
    // EPL v2 Endpoints (Current - Recommended)
    // ============================================

    {
      name: "epl_v2_get_teams",
      description: "Get all EPL teams for a given season",
      inputSchema: soccerSchemas.eplV2TeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/teams", params, headers);
      },
    },

    {
      name: "epl_v2_get_rosters",
      description: "Get EPL team rosters with player information for a specific team and season",
      inputSchema: soccerSchemas.eplV2RostersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/rosters", params, headers);
      },
    },

    {
      name: "epl_v2_get_players",
      description: "Get EPL players with optional filtering by team or search term",
      inputSchema: soccerSchemas.eplV2PlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/players", params, headers);
      },
    },

    {
      name: "epl_v2_get_standings",
      description: "Get EPL standings for a specific season",
      inputSchema: soccerSchemas.eplV2StandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/standings", params, headers);
      },
    },

    {
      name: "epl_v2_get_matches",
      description: "Get EPL matches with optional filtering by season, dates, or teams",
      inputSchema: soccerSchemas.soccerMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/matches", params, headers);
      },
    },

    {
      name: "epl_v2_get_match_events",
      description: "Get EPL match events (goals, cards, substitutions, etc.)",
      inputSchema: soccerSchemas.soccerMatchEventsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/match_events", params, headers);
      },
    },

    {
      name: "epl_v2_get_match_lineups",
      description: "Get EPL match lineups (starting and substitute players)",
      inputSchema: soccerSchemas.soccerMatchLineupsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/match_lineups", params, headers);
      },
    },

    {
      name: "epl_v2_get_player_match_stats",
      description: "Get EPL player match statistics",
      inputSchema: soccerSchemas.soccerPlayerMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/player_match_stats", params, headers);
      },
    },

    {
      name: "epl_v2_get_team_match_stats",
      description: "Get EPL team match statistics",
      inputSchema: soccerSchemas.soccerTeamMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/team_match_stats", params, headers);
      },
    },

    {
      name: "epl_v2_get_betting_odds",
      description: "Get EPL betting odds for matches. Includes moneyline odds for home, away, and draw outcomes.",
      inputSchema: soccerSchemas.soccerBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/odds", params, headers);
      },
    },

    {
      name: "epl_v2_get_player_props",
      description: "Get EPL player prop betting odds. Player prop data is LIVE and updated in real-time.",
      inputSchema: soccerSchemas.eplV2PlayerPropsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v2/odds/player_props", params, headers);
      },
    },

  ];
}
