import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/dota-schemas.js";

export function createDotaTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "dota_get_teams",
      description:
        "Get all Dota 2 professional teams with optional search filtering",
      inputSchema: schemas.dotaTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/dota/v1/teams", params, headers);
      },
    },

    {
      name: "dota_get_players",
      description:
        "Get Dota 2 professional players with optional filtering by search or team",
      inputSchema: schemas.dotaPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/dota/v1/players", params, headers);
      },
    },

    {
      name: "dota_get_heroes",
      description: "Get all Dota 2 heroes",
      inputSchema: schemas.dotaHeroesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/dota/v1/heroes", params, headers);
      },
    },

    {
      name: "dota_get_items",
      description: "Get all Dota 2 in-game items",
      inputSchema: schemas.dotaItemsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/dota/v1/items", params, headers);
      },
    },

    {
      name: "dota_get_abilities",
      description: "Get all Dota 2 hero abilities",
      inputSchema: schemas.dotaAbilitiesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/abilities",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_tournaments",
      description:
        "Get Dota 2 professional tournaments. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.dotaTournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/tournaments",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_tournament_teams",
      description:
        "Get teams participating in a specific Dota 2 tournament. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.dotaTournamentTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/tournament_teams",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_tournament_roster",
      description:
        "Get player rosters for a Dota 2 tournament and team. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.dotaTournamentRosterSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/tournament_roster",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_hero_stats",
      description:
        "Get aggregate statistics for Dota 2 heroes across professional matches. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.dotaHeroStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/hero_stats",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_matches",
      description:
        "Get Dota 2 professional matches with optional filtering by tournament or team. Requires GOAT tier.",
      inputSchema: schemas.dotaMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/dota/v1/matches", params, headers);
      },
    },

    {
      name: "dota_get_match_maps",
      description:
        "Get individual games within a Dota 2 match. Requires GOAT tier.",
      inputSchema: schemas.dotaMatchMapsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/match_maps",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_player_match_map_stats",
      description:
        "Get detailed player statistics for individual Dota 2 games. Requires GOAT tier.",
      inputSchema: schemas.dotaPlayerMatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/player_match_map_stats",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_team_match_map_stats",
      description:
        "Get detailed team statistics for individual Dota 2 games. Requires GOAT tier.",
      inputSchema: schemas.dotaTeamMatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/team_match_map_stats",
          params,
          headers
        );
      },
    },

    {
      name: "dota_get_player_overall_stats",
      description:
        "Get career statistics for Dota 2 professional players. Requires GOAT tier.",
      inputSchema: schemas.dotaPlayerOverallStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/dota/v1/player_overall_stats",
          params,
          headers
        );
      },
    },
  ];
}
