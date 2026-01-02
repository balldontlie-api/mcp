import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/cs2-schemas.js";

export function createCS2Tools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "cs2_get_teams",
      description:
        "Get all CS2 (Counter-Strike 2) teams with optional search filtering",
      inputSchema: schemas.cs2TeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/teams", params, headers);
      },
    },

    {
      name: "cs2_get_team_by_id",
      description: "Get a specific CS2 team by ID",
      inputSchema: schemas.cs2TeamByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/cs/v1/teams/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "cs2_get_players",
      description:
        "Get CS2 players with optional filtering by search, team, or active status",
      inputSchema: schemas.cs2PlayersSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/players", params, headers);
      },
    },

    {
      name: "cs2_get_player_by_id",
      description: "Get a specific CS2 player by ID",
      inputSchema: schemas.cs2PlayerByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/cs/v1/players/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "cs2_get_tournaments",
      description:
        "Get all CS2 tournaments with optional search filtering",
      inputSchema: schemas.cs2TournamentsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/tournaments", params, headers);
      },
    },

    {
      name: "cs2_get_tournament_by_id",
      description: "Get a specific CS2 tournament by ID",
      inputSchema: schemas.cs2TournamentByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/cs/v1/tournaments/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "cs2_get_tournament_teams",
      description:
        "Get all teams participating in a specific CS2 tournament",
      inputSchema: schemas.cs2TournamentTeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/tournament_teams", params, headers);
      },
    },

    {
      name: "cs2_get_team_map_pool",
      description:
        "Get map pool statistics for a specific CS2 team. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.cs2TeamMapPoolSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/team_map_pool", params, headers);
      },
    },

    {
      name: "cs2_get_rankings",
      description:
        "Get current official CS2 team rankings based on the Valve World Rankings system. Requires ALL-STAR tier or higher.",
      inputSchema: schemas.cs2RankingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/rankings", params, headers);
      },
    },

    {
      name: "cs2_get_matches",
      description:
        "Get CS2 matches with optional filtering by team, tournament, or dates. Requires GOAT tier.",
      inputSchema: schemas.cs2MatchesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/matches", params, headers);
      },
    },

    {
      name: "cs2_get_match_by_id",
      description: "Get a specific CS2 match by ID. Requires GOAT tier.",
      inputSchema: schemas.cs2MatchByIdSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        const { id } = params;
        return await apiClient.makeRequest(
          `/cs/v1/matches/${id}`,
          undefined,
          headers
        );
      },
    },

    {
      name: "cs2_get_match_maps",
      description:
        "Get all maps (games) for specified CS2 matches. Requires GOAT tier.",
      inputSchema: schemas.cs2MatchMapsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/match_maps", params, headers);
      },
    },

    {
      name: "cs2_get_match_map_stats",
      description:
        "Get detailed round-by-round statistics for a specific map in a CS2 match. Requires GOAT tier.",
      inputSchema: schemas.cs2MatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/match_map_stats", params, headers);
      },
    },

    {
      name: "cs2_get_player_match_stats",
      description:
        "Get player statistics aggregated across all maps in a CS2 match. Requires GOAT tier.",
      inputSchema: schemas.cs2PlayerMatchStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/player_match_stats", params, headers);
      },
    },

    {
      name: "cs2_get_player_match_map_stats",
      description:
        "Get player statistics for a specific map within a CS2 match. Requires GOAT tier.",
      inputSchema: schemas.cs2PlayerMatchMapStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/player_match_map_stats", params, headers);
      },
    },

    {
      name: "cs2_get_player_accuracy_stats",
      description:
        "Get accuracy statistics for a specific CS2 player, broken down by hit groups (body parts). Requires GOAT tier.",
      inputSchema: schemas.cs2PlayerAccuracyStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/cs/v1/player_accuracy_stats", params, headers);
      },
    },
  ];
}
