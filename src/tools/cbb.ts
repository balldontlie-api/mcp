import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/cbb-schemas.js";

export function createCBBTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "cbb_get_conferences",
      description: "Get all College Baseball (CBB) conferences",
      inputSchema: schemas.cbbConferencesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/conferences",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_teams",
      description:
        "Get College Baseball (CBB) teams with optional conference filter",
      inputSchema: schemas.cbbTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cbb/v1/teams", params, headers);
      },
    },

    {
      name: "cbb_get_players",
      description:
        "Get College Baseball (CBB) players with optional filtering and pagination",
      inputSchema: schemas.cbbPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cbb/v1/players", params, headers);
      },
    },

    {
      name: "cbb_get_active_players",
      description: "Get all currently active College Baseball (CBB) players",
      inputSchema: schemas.cbbPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_standings",
      description: "Get College Baseball (CBB) team standings by season",
      inputSchema: schemas.cbbStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_games",
      description:
        "Get College Baseball (CBB) games with optional filtering by date, season, team",
      inputSchema: schemas.cbbGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cbb/v1/games", params, headers);
      },
    },

    {
      name: "cbb_get_rankings",
      description: "Get College Baseball (CBB) rankings",
      inputSchema: schemas.cbbRankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/rankings",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_plays",
      description:
        "Get College Baseball (CBB) play-by-play data for a specific game",
      inputSchema: schemas.cbbPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cbb/v1/plays", params, headers);
      },
    },

    {
      name: "cbb_get_player_batting_stats",
      description: "Get College Baseball (CBB) player batting statistics",
      inputSchema: schemas.cbbPlayerBattingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/player_batting_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_player_pitching_stats",
      description: "Get College Baseball (CBB) player pitching statistics",
      inputSchema: schemas.cbbPlayerPitchingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/player_pitching_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_team_batting_stats",
      description: "Get College Baseball (CBB) team batting statistics",
      inputSchema: schemas.cbbTeamBattingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/team_batting_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_team_pitching_stats",
      description: "Get College Baseball (CBB) team pitching statistics",
      inputSchema: schemas.cbbTeamPitchingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/team_pitching_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_team_fielding_stats",
      description: "Get College Baseball (CBB) team fielding statistics",
      inputSchema: schemas.cbbTeamFieldingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/team_fielding_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_player_season_batting_stats",
      description:
        "Get College Baseball (CBB) player season batting statistics",
      inputSchema: schemas.cbbPlayerSeasonBattingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/player_season_batting_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_player_season_pitching_stats",
      description:
        "Get College Baseball (CBB) player season pitching statistics",
      inputSchema: schemas.cbbPlayerSeasonPitchingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/player_season_pitching_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_team_season_stats",
      description: "Get College Baseball (CBB) team season statistics",
      inputSchema: schemas.cbbTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/cbb/v1/team_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "cbb_get_odds",
      description:
        "Get College Baseball (CBB) betting odds. Either dates or game_ids is required.",
      inputSchema: schemas.cbbOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cbb/v1/odds", params, headers);
      },
    },
  ];
}
