import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as eplSchemas from "../schemas/epl-schemas.js";
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

    // ============================================
    // EPL v1 Endpoints (DEPRECATED)
    // ============================================

    {
      name: "epl_get_teams",
      description: "[DEPRECATED - Use epl_v2_get_teams] Get all EPL teams",
      inputSchema: eplSchemas.eplTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v1/teams", params, headers);
      },
    },

    {
      name: "epl_get_team_players",
      description: "[DEPRECATED - Use epl_v2_get_rosters] Get players for a specific EPL team",
      inputSchema: eplSchemas.eplTeamPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/epl/v1/teams/${id}/players`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "epl_get_team_season_stats",
      description: "[DEPRECATED - No v2 equivalent] Get season statistics for a specific EPL team",
      inputSchema: eplSchemas.eplTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/epl/v1/teams/${id}/season_stats`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "epl_get_team_stats_leaders",
      description: "[DEPRECATED - No v2 equivalent] Get EPL team statistical leaders",
      inputSchema: eplSchemas.eplTeamStatsLeadersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/epl/v1/team_stats/leaders",
          params,
          headers
        );
      },
    },

    {
      name: "epl_get_standings",
      description: "[DEPRECATED - Use epl_v2_get_standings] Get EPL team standings",
      inputSchema: eplSchemas.eplStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/epl/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "epl_get_players",
      description: "[DEPRECATED - Use epl_v2_get_players] Get EPL players with optional filtering and pagination",
      inputSchema: eplSchemas.eplPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v1/players", params, headers);
      },
    },

    {
      name: "epl_get_player_season_stats",
      description: "[DEPRECATED - No v2 equivalent] Get season statistics for a specific EPL player",
      inputSchema: eplSchemas.eplPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/epl/v1/players/${id}/season_stats`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "epl_get_player_stats_leaders",
      description: "[DEPRECATED - No v2 equivalent] Get EPL player statistical leaders",
      inputSchema: eplSchemas.eplPlayerStatsLeadersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/epl/v1/player_stats/leaders",
          params,
          headers
        );
      },
    },

    {
      name: "epl_get_games",
      description:
        "[DEPRECATED - Use epl_v2_get_matches] Get EPL games with optional filtering by season, team, and week",
      inputSchema: eplSchemas.eplGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v1/games", params, headers);
      },
    },

    {
      name: "epl_get_game_lineups",
      description: "[DEPRECATED - Use epl_v2_get_match_lineups] Get lineups for a specific EPL game",
      inputSchema: eplSchemas.eplGameLineupsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/epl/v1/games/${id}/lineups`,
          undefined,
          headers
        );
      },
    },

    {
      name: "epl_get_game_goals",
      description: "[DEPRECATED - Use epl_v2_get_match_events] Get goals scored in a specific EPL game",
      inputSchema: eplSchemas.eplGameGoalsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/epl/v1/games/${id}/goals`,
          undefined,
          headers
        );
      },
    },

    {
      name: "epl_get_game_team_stats",
      description: "[DEPRECATED - Use epl_v2_get_team_match_stats] Get team statistics for a specific EPL game",
      inputSchema: eplSchemas.eplGameTeamStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/epl/v1/games/${id}/team_stats`,
          undefined,
          headers
        );
      },
    },

    {
      name: "epl_get_game_player_stats",
      description: "[DEPRECATED - Use epl_v2_get_player_match_stats] Get player statistics for a specific EPL game",
      inputSchema: eplSchemas.eplGamePlayerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/epl/v1/games/${id}/player_stats`,
          undefined,
          headers
        );
      },
    },

    {
      name: "epl_get_betting_odds",
      description:
        "[DEPRECATED - Use epl_v2_get_betting_odds] Get EPL betting odds for games. Either (season and week) or game_ids is required. EPL odds include moneyline odds for home, away, and draw outcomes only (no spreads or totals).",
      inputSchema: eplSchemas.eplBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/epl/v1/odds", params, headers);
      },
    },

    {
      name: "epl_get_player_props",
      description:
        "[DEPRECATED - Use epl_v2_get_player_props] Get EPL player prop betting odds. Player prop data is LIVE and updated in real-time. Returns all player props for the specified game.",
      inputSchema: eplSchemas.eplPlayerPropsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/epl/v1/odds/player_props",
          params,
          headers
        );
      },
    },
  ];
}
