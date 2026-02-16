import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/mlb-schemas.js";

export function createMLBTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "mlb_get_teams",
      description:
        "Get all MLB teams with optional filtering by division or league",
      inputSchema: schemas.mlbTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/teams", params, headers);
      },
    },

    {
      name: "mlb_get_team_by_id",
      description: "Get a specific MLB team by ID",
      inputSchema: schemas.mlbTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/mlb/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "mlb_get_players",
      description: "Get MLB players with optional filtering and pagination",
      inputSchema: schemas.mlbPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/players", params, headers);
      },
    },

    {
      name: "mlb_get_player_by_id",
      description: "Get a specific MLB player by ID",
      inputSchema: schemas.mlbPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/mlb/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "mlb_get_active_players",
      description: "Get all currently active MLB players",
      inputSchema: schemas.mlbPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_games",
      description:
        "Get MLB games with optional filtering by date, season, team, etc.",
      inputSchema: schemas.mlbGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/games", params, headers);
      },
    },

    {
      name: "mlb_get_game_by_id",
      description: "Get a specific MLB game by ID",
      inputSchema: schemas.mlbGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/mlb/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "mlb_get_stats",
      description: "Get MLB player and game statistics with filtering options",
      inputSchema: schemas.mlbStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/stats", params, headers);
      },
    },

    {
      name: "mlb_get_season_stats",
      description: "Get MLB player season statistics",
      inputSchema: schemas.mlbSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_team_season_stats",
      description: "Get MLB team season statistics",
      inputSchema: schemas.mlbTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/teams/season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_standings",
      description: "Get MLB team standings by season, league, or division",
      inputSchema: schemas.mlbStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_player_injuries",
      description: "Get MLB player injury reports and status",
      inputSchema: schemas.mlbPlayerInjuriesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/player_injuries",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_player_splits",
      description:
        "Get MLB player splits grouped by split_category (e.g., vs RHP/LHP, by month, by opponent, etc.)",
      inputSchema: schemas.mlbPlayerSplitsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/players/splits",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_player_versus",
      description:
        "Get MLB player vs player matchups. Head-to-head batting statistics for batter against pitchers for a specific team, or pitcher against batters from a specific team.",
      inputSchema: schemas.mlbPlayerVersusSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/players/versus",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_plays",
      description:
        "Get MLB play-by-play data for a specific game including game state, scoring plays, and batted ball details.",
      inputSchema: schemas.mlbPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/plays", params, headers);
      },
    },

    {
      name: "mlb_get_plate_appearances",
      description:
        "Get MLB plate appearance data for a specific game. Each plate appearance includes the outcome and all individual pitches with detailed Statcast metrics.",
      inputSchema: schemas.mlbPlateAppearancesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/plate_appearances",
          params,
          headers
        );
      },
    },

    {
      name: "mlb_get_odds",
      description:
        "Get MLB betting odds. Either dates or game_ids is required.",
      inputSchema: schemas.mlbOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/mlb/v1/odds", params, headers);
      },
    },

    {
      name: "mlb_get_player_props",
      description:
        "Get MLB player prop betting odds. Live data updated in real-time. Requires game_id.",
      inputSchema: schemas.mlbPlayerPropsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/mlb/v1/odds/player_props",
          params,
          headers
        );
      },
    },
  ];
}
