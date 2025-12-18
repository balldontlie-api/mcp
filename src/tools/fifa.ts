import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/fifa-schemas.js";

export function createFIFATools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "fifa_get_teams",
      description: "Get all FIFA World Cup 2026 participating nations",
      inputSchema: schemas.fifaTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/teams",
          params,
          headers
        );
      },
    },

    {
      name: "fifa_get_stadiums",
      description: "Get all FIFA World Cup 2026 host stadiums",
      inputSchema: schemas.fifaStadiumsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/stadiums",
          params,
          headers
        );
      },
    },

    {
      name: "fifa_get_group_standings",
      description:
        "Get group stage standings for FIFA World Cup 2026. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.fifaGroupStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/group_standings",
          params,
          headers
        );
      },
    },

    {
      name: "fifa_get_matches",
      description:
        "Get all FIFA World Cup 2026 matches including group stage and knockout rounds. Requires GOAT tier.",
      inputSchema: schemas.fifaMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/matches",
          params,
          headers
        );
      },
    },

    {
      name: "fifa_get_betting_odds",
      description:
        "Get betting odds for FIFA World Cup 2026 matches. Requires GOAT tier.",
      inputSchema: schemas.fifaBettingOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/odds",
          params,
          headers
        );
      },
    },

    {
      name: "fifa_get_futures_odds",
      description:
        "Get futures betting odds for FIFA World Cup 2026 (e.g., tournament winner). Requires GOAT tier.",
      inputSchema: schemas.fifaFuturesOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/fifa/worldcup/v1/odds/futures",
          params,
          headers
        );
      },
    },
  ];
}
