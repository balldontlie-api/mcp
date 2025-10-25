import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/nba-schemas.js";

export function createNBATools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "nba_get_teams",
      description:
        "Get all NBA teams with optional filtering by division or conference",
      inputSchema: schemas.nbaTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/teams", params, headers);
      },
    },

    {
      name: "nba_get_team_by_id",
      description: "Get a specific NBA team by ID",
      inputSchema: schemas.nbaTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "nba_get_players",
      description: "Get NBA players with optional filtering and pagination",
      inputSchema: schemas.nbaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/players", params, headers);
      },
    },

    {
      name: "nba_get_player_by_id",
      description: "Get a specific NBA player by ID",
      inputSchema: schemas.nbaPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "nba_get_active_players",
      description: "Get all currently active NBA players",
      inputSchema: schemas.nbaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "nba_get_games",
      description:
        "Get NBA games with optional filtering by date, season, team, etc.",
      inputSchema: schemas.nbaGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/games", params, headers);
      },
    },

    {
      name: "nba_get_game_by_id",
      description: "Get a specific NBA game by ID",
      inputSchema: schemas.nbaGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "nba_get_stats",
      description: "Get NBA player and game statistics with filtering options",
      inputSchema: schemas.nbaStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/stats", params, headers);
      },
    },

    {
      name: "nba_get_season_averages",
      description: "Get NBA player season averages by category and type",
      inputSchema: schemas.nbaSeasonAveragesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { category, season_type = "regular", ...queryParams } = params;

        if (!category) {
          throw new Error("Category is required for season averages");
        }

        return await apiClient.makeRequest(
          `/v1/season_averages/${category}`,
          { season_type, ...queryParams },
          headers
        );
      },
    },

    {
      name: "nba_get_advanced_stats",
      description: "Get NBA advanced statistics and analytics",
      inputSchema: schemas.nbaStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/v1/stats/advanced",
          params,
          headers
        );
      },
    },

    {
      name: "nba_get_box_scores",
      description: "Get NBA game box scores with detailed player statistics",
      inputSchema: schemas.nbaBoxScoresSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/box_scores", params, headers);
      },
    },

    {
      name: "nba_get_live_box_scores",
      description: "Get live NBA game box scores for ongoing games",
      inputSchema: schemas.nbaBoxScoresSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/v1/box_scores/live",
          params,
          headers
        );
      },
    },

    {
      name: "nba_get_standings",
      description: "Get NBA team standings by season, conference, or division",
      inputSchema: schemas.nbaStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/standings", params, headers);
      },
    },

    {
      name: "nba_get_leaders",
      description: "Get NBA statistical leaders with cursor-based pagination",
      inputSchema: schemas.nbaLeadersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { cursor = 0, per_page = 25, ...apiParams } = params;

        // Get full results from API (only season and stat_type are sent to API)
        const response = await apiClient.makeRequest("/v1/leaders", apiParams, headers);

        // Implement cursor-based pagination on the client side
        if (response.data && Array.isArray(response.data)) {
          const startIndex = cursor;
          const endIndex = startIndex + per_page;
          const paginatedData = response.data.slice(startIndex, endIndex);

          // Add pagination metadata
          const hasNextPage = endIndex < response.data.length;
          const nextCursor = hasNextPage ? endIndex : null;

          return {
            data: paginatedData,
            meta: {
              total_count: response.data.length,
              per_page: per_page,
              cursor: cursor,
              next_cursor: nextCursor,
              has_next_page: hasNextPage
            }
          };
        }

        return response;
      },
    },

    {
      name: "nba_get_player_injuries",
      description: "Get NBA player injury reports and status",
      inputSchema: schemas.nbaPlayerInjuriesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/v1/player_injuries",
          params,
          headers
        );
      },
    },

    {
      name: "nba_get_betting_odds",
      description: "Get NBA betting odds for games. Either dates or game_ids is required.",
      inputSchema: schemas.nbaBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/v1/odds", params, headers);
      },
    },
  ];
}
