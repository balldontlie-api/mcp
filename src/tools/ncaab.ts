import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/ncaab-schemas.js";

export function createNCAABTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "ncaab_get_conferences",
      description: "Get all NCAAB conferences",
      inputSchema: schemas.ncaabConferencesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaab/v1/conferences", params, headers);
      },
    },

    {
      name: "ncaab_get_conference_by_id",
      description: "Get a specific NCAAB conference by ID",
      inputSchema: schemas.ncaabConferenceByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaab/v1/conferences/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaab_get_teams",
      description: "Get all NCAAB teams with optional filtering",
      inputSchema: schemas.ncaabTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaab/v1/teams", params, headers);
      },
    },

    {
      name: "ncaab_get_team_by_id",
      description: "Get a specific NCAAB team by ID",
      inputSchema: schemas.ncaabTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaab/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaab_get_players",
      description: "Get NCAAB players with optional filtering and pagination",
      inputSchema: schemas.ncaabPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaab/v1/players", params, headers);
      },
    },

    {
      name: "ncaab_get_player_by_id",
      description: "Get a specific NCAAB player by ID",
      inputSchema: schemas.ncaabPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaab/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaab_get_active_players",
      description: "Get all currently active NCAAB players",
      inputSchema: schemas.ncaabPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_standings",
      description: "Get NCAAB team standings by season and conference",
      inputSchema: schemas.ncaabStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_games",
      description:
        "Get NCAAB games with optional filtering by date, season, week, team, etc.",
      inputSchema: schemas.ncaabGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaab/v1/games", params, headers);
      },
    },

    {
      name: "ncaab_get_game_by_id",
      description: "Get a specific NCAAB game by ID",
      inputSchema: schemas.ncaabGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaab/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaab_get_rankings",
      description: "Get NCAAB rankings by season and week",
      inputSchema: schemas.ncaabRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_plays",
      description: "Get NCAAB play-by-play data for a specific game",
      inputSchema: schemas.ncaabPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaab/v1/plays", params, headers);
      },
    },

    {
      name: "ncaab_get_player_stats",
      description: "Get NCAAB player game statistics with filtering options",
      inputSchema: schemas.ncaabPlayerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/player_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_team_stats",
      description: "Get NCAAB team game statistics with filtering options",
      inputSchema: schemas.ncaabTeamStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/team_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_player_season_stats",
      description: "Get NCAAB player season statistics",
      inputSchema: schemas.ncaabPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/player_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_team_season_stats",
      description: "Get NCAAB team season statistics",
      inputSchema: schemas.ncaabTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/team_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaab_get_brackets",
      description: "Get NCAAB tournament bracket information",
      inputSchema: schemas.ncaabBracketsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaab/v1/brackets",
          params,
          headers
        );
      },
    },
  ];
}
