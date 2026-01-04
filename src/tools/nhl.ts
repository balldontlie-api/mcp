import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/nhl-schemas.js";

export function createNHLTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "nhl_get_teams",
      description:
        "Get all NHL teams with optional filtering by conference or division",
      inputSchema: schemas.nhlTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/nhl/v1/teams", params, headers);
      },
    },

    {
      name: "nhl_get_team_by_id",
      description: "Get a specific NHL team by ID",
      inputSchema: schemas.nhlTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/nhl/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "nhl_get_team_season_stats",
      description: "Get season statistics for a specific NHL team",
      inputSchema: schemas.nhlTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/nhl/v1/teams/${id}/season_stats`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "nhl_get_team_stats_leaders",
      description: "Get NHL team statistical leaders",
      inputSchema: schemas.nhlTeamStatsLeadersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/team_stats/leaders",
          params,
          headers
        );
      },
    },

    {
      name: "nhl_get_players",
      description: "Get NHL players with optional filtering and pagination",
      inputSchema: schemas.nhlPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/nhl/v1/players", params, headers);
      },
    },

    {
      name: "nhl_get_player_season_stats",
      description: "Get season statistics for a specific NHL player",
      inputSchema: schemas.nhlPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id, ...queryParams } = params;
        return await apiClient.makeRequest(
          `/nhl/v1/players/${id}/season_stats`,
          queryParams,
          headers
        );
      },
    },

    {
      name: "nhl_get_player_stats_leaders",
      description: "Get NHL player statistical leaders",
      inputSchema: schemas.nhlPlayerStatsLeadersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/player_stats/leaders",
          params,
          headers
        );
      },
    },

    {
      name: "nhl_get_games",
      description:
        "Get NHL games with optional filtering by date, season, team, etc.",
      inputSchema: schemas.nhlGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/nhl/v1/games", params, headers);
      },
    },

    {
      name: "nhl_get_standings",
      description: "Get NHL team standings by season, conference, or division",
      inputSchema: schemas.nhlStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "nhl_get_box_scores",
      description:
        "Get NHL game box scores with detailed player and team statistics",
      inputSchema: schemas.nhlBoxScoresSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/box_scores",
          params,
          headers
        );
      },
    },

    {
      name: "nhl_get_betting_odds",
      description:
        "Get NHL betting odds for games. Either dates or game_ids is required.",
      inputSchema: schemas.nhlBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/nhl/v1/odds", params, headers);
      },
    },

    {
      name: "nhl_get_player_props",
      description:
        "Get NHL player prop betting odds. Player prop data is LIVE and updated in real-time. Returns all player props for the specified game.",
      inputSchema: schemas.nhlPlayerPropsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/odds/player_props",
          params,
          headers
        );
      },
    },

    {
      name: "nhl_get_plays",
      description:
        "Get NHL play-by-play data for a specific game. Returns plays in chronological order with a sequential order field starting from 1.",
      inputSchema: schemas.nhlPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/nhl/v1/plays", params, headers);
      },
    },

    {
      name: "nhl_get_player_injuries",
      description:
        "Get all currently injured NHL players. Returns all players currently on the injury report.",
      inputSchema: schemas.nhlPlayerInjuriesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/nhl/v1/player_injuries",
          params,
          headers
        );
      },
    },
  ];
}
