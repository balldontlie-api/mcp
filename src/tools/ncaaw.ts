import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/ncaaw-schemas.js";

export function createNCAAWTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "ncaaw_get_conferences",
      description: "Get all NCAAW conferences",
      inputSchema: schemas.ncaawConferencesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/conferences", params, headers);
      },
    },

    {
      name: "ncaaw_get_conference_by_id",
      description: "Get a specific NCAAW conference by ID",
      inputSchema: schemas.ncaawConferenceByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaw/v1/conferences/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_teams",
      description: "Get all NCAAW teams with optional filtering",
      inputSchema: schemas.ncaawTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/teams", params, headers);
      },
    },

    {
      name: "ncaaw_get_team_by_id",
      description: "Get a specific NCAAW team by ID",
      inputSchema: schemas.ncaawTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaw/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_players",
      description: "Get NCAAW players with optional filtering and pagination",
      inputSchema: schemas.ncaawPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/players", params, headers);
      },
    },

    {
      name: "ncaaw_get_player_by_id",
      description: "Get a specific NCAAW player by ID",
      inputSchema: schemas.ncaawPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaw/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_active_players",
      description: "Get all currently active NCAAW players",
      inputSchema: schemas.ncaawPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_standings",
      description: "Get NCAAW team standings by season and conference",
      inputSchema: schemas.ncaawStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_games",
      description:
        "Get NCAAW games with optional filtering by date, season, team, etc.",
      inputSchema: schemas.ncaawGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/games", params, headers);
      },
    },

    {
      name: "ncaaw_get_game_by_id",
      description: "Get a specific NCAAW game by ID",
      inputSchema: schemas.ncaawGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/ncaaw/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_rankings",
      description: "Get NCAAW rankings by season and week",
      inputSchema: schemas.ncaawRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_plays",
      description: "Get NCAAW play-by-play data for a specific game",
      inputSchema: schemas.ncaawPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/plays", params, headers);
      },
    },

    {
      name: "ncaaw_get_player_stats",
      description: "Get NCAAW player game statistics with filtering options",
      inputSchema: schemas.ncaawPlayerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/player_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_team_stats",
      description: "Get NCAAW team game statistics with filtering options",
      inputSchema: schemas.ncaawTeamStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/team_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_player_season_stats",
      description: "Get NCAAW player season statistics",
      inputSchema: schemas.ncaawPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/player_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_team_season_stats",
      description: "Get NCAAW team season statistics",
      inputSchema: schemas.ncaawTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/team_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_brackets",
      description: "Get NCAAW tournament bracket information",
      inputSchema: schemas.ncaawBracketsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/ncaaw/v1/bracket",
          params,
          headers
        );
      },
    },

    {
      name: "ncaaw_get_betting_odds",
      description:
        "Get NCAAW betting odds for games. Either dates or game_ids is required. Note that NCAAW odds data is sparse and only available from the 2025-2026 season onwards.",
      inputSchema: schemas.ncaawBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/ncaaw/v1/odds", params, headers);
      },
    },
  ];
}
