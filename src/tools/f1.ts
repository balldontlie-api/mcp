import { MCPTool } from "../types.js";
import { APIClient } from "../client.js";
import * as schemas from "../schemas/f1-schemas.js";

export function createF1Tools(apiClient: APIClient): MCPTool[] {
  return [
    {
      name: "f1_get_drivers",
      description: "Get Formula 1 drivers with optional filters. Free tier.",
      inputSchema: schemas.f1DriversSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/drivers", params, headers);
      },
    },

    {
      name: "f1_get_teams",
      description: "Get Formula 1 teams (constructors) with optional filters. Free tier.",
      inputSchema: schemas.f1TeamsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/teams", params, headers);
      },
    },

    {
      name: "f1_get_circuits",
      description: "Get Formula 1 circuits with optional filters. Free tier.",
      inputSchema: schemas.f1CircuitsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/circuits", params, headers);
      },
    },

    {
      name: "f1_get_seasons",
      description: "Get Formula 1 seasons. Free tier.",
      inputSchema: schemas.f1SeasonsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/seasons", params, headers);
      },
    },

    {
      name: "f1_get_events",
      description: "Get Formula 1 race events (Grand Prix weekends) with optional filters. Free tier.",
      inputSchema: schemas.f1EventsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/events", params, headers);
      },
    },

    {
      name: "f1_get_sessions",
      description: "Get Formula 1 sessions (Practice, Qualifying, Sprint, Race) with optional filters. Requires PAID tier.",
      inputSchema: schemas.f1SessionsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/sessions", params, headers);
      },
    },

    {
      name: "f1_get_session_results",
      description: "Get Formula 1 session results (finishing positions, laps completed, etc.). Requires PAID tier.",
      inputSchema: schemas.f1SessionResultsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/session_results", params, headers);
      },
    },

    {
      name: "f1_get_driver_standings",
      description: "Get Formula 1 Driver Championship standings for a specific season. Requires PAID tier.",
      inputSchema: schemas.f1DriverStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/driver_standings", params, headers);
      },
    },

    {
      name: "f1_get_team_standings",
      description: "Get Formula 1 Constructors Championship standings for a specific season. Requires PAID tier.",
      inputSchema: schemas.f1TeamStandingsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/team_standings", params, headers);
      },
    },

    {
      name: "f1_get_lap_times",
      description: "Get detailed lap-by-lap timing data for Formula 1 sessions. Requires PAID+ tier.",
      inputSchema: schemas.f1LapTimesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/lap_times", params, headers);
      },
    },

    {
      name: "f1_get_qualifying_results",
      description: "Get detailed qualifying session results including Q1, Q2, and Q3 times. Requires PAID+ tier.",
      inputSchema: schemas.f1QualifyingResultsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/qualifying_results", params, headers);
      },
    },

    {
      name: "f1_get_pit_stops",
      description: "Get pit stop data including duration and timing. Requires PAID+ tier.",
      inputSchema: schemas.f1PitStopsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/pit_stops", params, headers);
      },
    },

    {
      name: "f1_get_tire_stints",
      description: "Get tire compound and stint data for each driver. Requires PAID+ tier.",
      inputSchema: schemas.f1TireStintsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/tire_stints", params, headers);
      },
    },

    {
      name: "f1_get_session_weather",
      description: "Get weather conditions during Formula 1 sessions. Requires PAID+ tier.",
      inputSchema: schemas.f1SessionWeatherSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/session_weather", params, headers);
      },
    },

    {
      name: "f1_get_race_control_messages",
      description: "Get race control messages including flags, safety car, and DRS notifications. Requires PAID+ tier.",
      inputSchema: schemas.f1RaceControlMessagesSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/race_control_messages", params, headers);
      },
    },

    {
      name: "f1_get_position_history",
      description: "Get lap-by-lap position changes for drivers during sessions. Requires PAID+ tier.",
      inputSchema: schemas.f1PositionHistorySchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/position_history", params, headers);
      },
    },

    {
      name: "f1_get_session_timing_stats",
      description: "Get detailed timing statistics including best laps, sector times, and speed trap data. Requires PAID+ tier.",
      inputSchema: schemas.f1SessionTimingStatsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/session_timing_stats", params, headers);
      },
    },

    {
      name: "f1_get_track_status",
      description: "Get track status changes during sessions (green flag, yellow flag, safety car, etc.). Requires PAID+ tier.",
      inputSchema: schemas.f1TrackStatusSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/track_status", params, headers);
      },
    },

    {
      name: "f1_get_futures_odds",
      description: "Get futures betting odds for Formula 1 championships (e.g., driver championship winner, constructor championship winner). Requires PAID+ tier.",
      inputSchema: schemas.f1FuturesOddsSchema,
      handler: async (params: any, headers?: Record<string, string>) => {
        return await apiClient.makeRequest("/f1/v1/odds/futures", params, headers);
      },
    },
  ];
}
