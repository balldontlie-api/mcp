import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/lol-schemas.js";

export function createLOLTools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "lol_get_teams",
      description:
        "Get all League of Legends professional teams with optional search filtering",
      inputSchema: schemas.lolTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/teams", params, headers);
      },
    },

    {
      name: "lol_get_players",
      description:
        "Get League of Legends professional players with optional filtering by search or team",
      inputSchema: schemas.lolPlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/players", params, headers);
      },
    },

    {
      name: "lol_get_champions",
      description: "Get all League of Legends champions",
      inputSchema: schemas.lolChampionsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/champions",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_items",
      description: "Get all League of Legends in-game items",
      inputSchema: schemas.lolItemsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/items", params, headers);
      },
    },

    {
      name: "lol_get_spells",
      description: "Get all League of Legends summoner spells",
      inputSchema: schemas.lolSpellsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/spells", params, headers);
      },
    },

    {
      name: "lol_get_rune_paths",
      description:
        "Get all League of Legends rune paths (Domination, Inspiration, Precision, Resolve, Sorcery)",
      inputSchema: schemas.lolRunePathsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/rune_paths",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_runes",
      description:
        "Get all League of Legends runes with their paths and types",
      inputSchema: schemas.lolRunesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/runes", params, headers);
      },
    },

    {
      name: "lol_get_tournaments",
      description:
        "Get League of Legends professional tournaments. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.lolTournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/tournaments",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_tournament_teams",
      description:
        "Get teams participating in a specific League of Legends tournament. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.lolTournamentTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/tournament_teams",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_tournament_roster",
      description:
        "Get player rosters for a League of Legends tournament and team. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.lolTournamentRosterSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/tournament_roster",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_champion_stats",
      description:
        "Get aggregate statistics for League of Legends champions across professional matches. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.lolChampionStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/champion_stats",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_matches",
      description:
        "Get League of Legends professional matches with optional filtering by tournament or team. Requires GOAT tier.",
      inputSchema: schemas.lolMatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/lol/v1/matches", params, headers);
      },
    },

    {
      name: "lol_get_match_maps",
      description:
        "Get individual games within a League of Legends match. Requires GOAT tier.",
      inputSchema: schemas.lolMatchMapsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/match_maps",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_player_match_map_stats",
      description:
        "Get detailed player statistics for individual League of Legends games. Requires GOAT tier.",
      inputSchema: schemas.lolPlayerMatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/player_match_map_stats",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_team_match_map_stats",
      description:
        "Get detailed team statistics for individual League of Legends games. Requires GOAT tier.",
      inputSchema: schemas.lolTeamMatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/team_match_map_stats",
          params,
          headers
        );
      },
    },

    {
      name: "lol_get_player_overall_stats",
      description:
        "Get career statistics for League of Legends professional players. Requires GOAT tier.",
      inputSchema: schemas.lolPlayerOverallStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest(
          "/lol/v1/player_overall_stats",
          params,
          headers
        );
      },
    },
  ];
}
