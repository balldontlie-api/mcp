import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/ncaaf-schemas.js";

export function createNCAAFTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "ncaaf_get_conferences",
      description: "Get all NCAAF conferences",
      inputSchema: schemas.ncaafConferencesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/conferences", params, headers);
      },
    },

    {
      name: "ncaaf_get_conference_by_id",
      description: "Get a specific NCAAF conference by ID",
      inputSchema: schemas.ncaafConferenceByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaf/v1/conferences/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_teams",
      description: "Get all NCAAF teams with optional filtering",
      inputSchema: schemas.ncaafTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/teams", params, headers);
      },
    },

    {
      name: "ncaaf_get_team_by_id",
      description: "Get a specific NCAAF team by ID",
      inputSchema: schemas.ncaafTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaf/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_players",
      description: "Get NCAAF players with optional filtering and pagination",
      inputSchema: schemas.ncaafPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/players", params, headers);
      },
    },

    {
      name: "ncaaf_get_active_players",
      description: "Get all currently active NCAAF players",
      inputSchema: schemas.ncaafPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_player_by_id",
      description: "Get a specific NCAAF player by ID",
      inputSchema: schemas.ncaafPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaf/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_standings",
      description: "Get NCAAF team standings by season and conference",
      inputSchema: schemas.ncaafStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_games",
      description:
        "Get NCAAF games with optional filtering by date, season, week, team, etc.",
      inputSchema: schemas.ncaafGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/games", params, headers);
      },
    },

    {
      name: "ncaaf_get_game_by_id",
      description: "Get a specific NCAAF game by ID",
      inputSchema: schemas.ncaafGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaf/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_rankings",
      description: "Get NCAAF rankings by season and week",
      inputSchema: schemas.ncaafRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_plays",
      description: "Get NCAAF play-by-play data for a specific game",
      inputSchema: schemas.ncaafPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/plays", params, headers);
      },
    },

    {
      name: "ncaaf_get_player_stats",
      description: "Get NCAAF player game statistics with filtering options",
      inputSchema: schemas.ncaafPlayerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/player_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_team_stats",
      description: "Get NCAAF team game statistics with filtering options",
      inputSchema: schemas.ncaafTeamStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/team_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_player_season_stats",
      description: "Get NCAAF player season statistics",
      inputSchema: schemas.ncaafPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/player_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_team_season_stats",
      description: "Get NCAAF team season statistics",
      inputSchema: schemas.ncaafTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaf/v1/team_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaf_get_betting_odds",
      description: "Get NCAAF betting odds for games. Either (season and week) or game_ids is required.",
      inputSchema: schemas.ncaafBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaf/v1/odds", params, headers);
      },
    },
  ];
}
