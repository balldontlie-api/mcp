import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/pga-schemas.js";

export function createPGATools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "pga_get_players",
      description: "Get PGA Tour players with optional filters. Free tier.",
      inputSchema: schemas.pgaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/players", params, headers);
      },
    },

    {
      name: "pga_get_tournaments",
      description: "Get PGA Tour tournaments with optional filters. Free tier.",
      inputSchema: schemas.pgaTournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/tournaments", params, headers);
      },
    },

    {
      name: "pga_get_courses",
      description: "Get golf courses with optional filters. Free tier.",
      inputSchema: schemas.pgaCoursesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/courses", params, headers);
      },
    },

    {
      name: "pga_get_tournament_results",
      description: "Get tournament leaderboard/results. Requires ALL-STAR tier.",
      inputSchema: schemas.pgaTournamentResultsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/tournament_results", params, headers);
      },
    },

    {
      name: "pga_get_tournament_course_stats",
      description: "Get hole-by-hole tournament statistics. Requires ALL-STAR tier.",
      inputSchema: schemas.pgaTournamentCourseStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/tournament_course_stats", params, headers);
      },
    },

    {
      name: "pga_get_course_holes",
      description: "Get hole-by-hole course information. Requires ALL-STAR tier.",
      inputSchema: schemas.pgaCourseHolesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/course_holes", params, headers);
      },
    },

    {
      name: "pga_get_player_round_results",
      description: "Get round-by-round player scores. Requires GOAT tier.",
      inputSchema: schemas.pgaPlayerRoundResultsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/player_round_results", params, headers);
      },
    },

    {
      name: "pga_get_player_round_stats",
      description: "Get detailed player round statistics including strokes gained. Use round_number=-1 for tournament totals. Requires GOAT tier.",
      inputSchema: schemas.pgaPlayerRoundStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/player_round_stats", params, headers);
      },
    },

    {
      name: "pga_get_player_season_stats",
      description: "Get player season-level statistics. Requires GOAT tier.",
      inputSchema: schemas.pgaPlayerSeasonStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/player_season_stats", params, headers);
      },
    },

    {
      name: "pga_get_player_scorecards",
      description: "Get hole-by-hole player scores. Requires GOAT tier.",
      inputSchema: schemas.pgaPlayerScorecardsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/pga/v1/player_scorecards", params, headers);
      },
    },
  ];
}
