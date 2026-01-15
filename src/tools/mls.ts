import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/soccer-schemas.js";

export function createMLSTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "mls_get_teams",
      description: "Get all MLS teams for a given season. Defaults to current season if not specified.",
      inputSchema: schemas.mlsTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/teams", params, headers);
      },
    },

    {
      name: "mls_get_rosters",
      description: "Get MLS team rosters with player information for a specific team and season",
      inputSchema: schemas.soccerRostersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/rosters", params, headers);
      },
    },

    {
      name: "mls_get_players",
      description: "Get MLS players with optional filtering by team or search term",
      inputSchema: schemas.mlsPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/players", params, headers);
      },
    },

    {
      name: "mls_get_standings",
      description: "Get MLS standings for a specific season. MLS uses conference-based standings (Eastern and Western Conference).",
      inputSchema: schemas.mlsStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/standings", params, headers);
      },
    },

    {
      name: "mls_get_matches",
      description: "Get MLS matches with optional filtering by season, dates, or teams",
      inputSchema: schemas.soccerMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/matches", params, headers);
      },
    },

    {
      name: "mls_get_match_events",
      description: "Get MLS match events (goals, cards, substitutions, etc.)",
      inputSchema: schemas.soccerMatchEventsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/match_events", params, headers);
      },
    },

    {
      name: "mls_get_match_lineups",
      description: "Get MLS match lineups (starting and substitute players)",
      inputSchema: schemas.soccerMatchLineupsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/match_lineups", params, headers);
      },
    },

    {
      name: "mls_get_player_match_stats",
      description: "Get MLS player match statistics",
      inputSchema: schemas.soccerPlayerMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/player_match_stats", params, headers);
      },
    },

    {
      name: "mls_get_team_match_stats",
      description: "Get MLS team match statistics",
      inputSchema: schemas.soccerTeamMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/team_match_stats", params, headers);
      },
    },

    {
      name: "mls_get_betting_odds",
      description: "Get MLS betting odds for matches. Includes moneyline odds for home, away, and draw outcomes only (no spreads or totals).",
      inputSchema: schemas.soccerBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/odds", params, headers);
      },
    },

    {
      name: "mls_get_player_props",
      description: "Get MLS player prop betting odds. Player prop data is LIVE and updated in real-time. Returns all player props for the specified match.",
      inputSchema: schemas.soccerPlayerPropsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mls/v1/odds/player_props", params, headers);
      },
    },
  ];
}
