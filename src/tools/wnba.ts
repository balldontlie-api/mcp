import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/wnba-schemas.js";

export function createWNBATools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "wnba_get_teams",
      description: "Get all WNBA teams with optional filtering by conference",
      inputSchema: schemas.wnbaTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wnba/v1/teams", params, headers);
      },
    },

    {
      name: "wnba_get_team_by_id",
      description: "Get a specific WNBA team by ID",
      inputSchema: schemas.wnbaTeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/wnba/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "wnba_get_players",
      description: "Get WNBA players with optional filtering and pagination",
      inputSchema: schemas.wnbaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wnba/v1/players", params, headers);
      },
    },

    {
      name: "wnba_get_player_by_id",
      description: "Get a specific WNBA player by ID",
      inputSchema: schemas.wnbaPlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/wnba/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "wnba_get_active_players",
      description: "Get all currently active WNBA players",
      inputSchema: schemas.wnbaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/players/active",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_games",
      description:
        "Get WNBA games with optional filtering by date, season, team, etc.",
      inputSchema: schemas.wnbaGamesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wnba/v1/games", params, headers);
      },
    },

    {
      name: "wnba_get_game_by_id",
      description: "Get a specific WNBA game by ID",
      inputSchema: schemas.wnbaGameByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/wnba/v1/games/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "wnba_get_player_stats",
      description: "Get WNBA player game statistics with filtering options",
      inputSchema: schemas.wnbaPlayerStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/player_stats",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_team_stats",
      description: "Get WNBA team game statistics with filtering options",
      inputSchema: schemas.wnbaTeamStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/team_stats",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_player_season_stats",
      description: "Get WNBA player season statistics",
      inputSchema: schemas.wnbaPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/player_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_team_season_stats",
      description: "Get WNBA team season statistics",
      inputSchema: schemas.wnbaTeamSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/team_season_stats",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_standings",
      description: "Get WNBA team standings by season or conference",
      inputSchema: schemas.wnbaStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/standings",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_player_injuries",
      description: "Get WNBA player injury reports and status",
      inputSchema: schemas.wnbaPlayerInjuriesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/wnba/v1/player_injuries",
          params,
          headers
        );
      },
    },

    {
      name: "wnba_get_plays",
      description: "Get WNBA play-by-play data for a specific game",
      inputSchema: schemas.wnbaPlaysSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/wnba/v1/plays", params, headers);
      },
    },
  ];
}
