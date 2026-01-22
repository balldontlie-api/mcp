// Formula 1 JSON schemas for tool parameters

export const f1DriversSchema = {
  type: "object",
  properties: {
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    search: {
      type: "string",
      description: "Search drivers by name",
    },
    country_code: {
      type: "string",
      description: "Filter by ISO country code",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1TeamsSchema = {
  type: "object",
  properties: {
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    search: {
      type: "string",
      description: "Search teams by name",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1CircuitsSchema = {
  type: "object",
  properties: {
    circuit_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by circuit IDs",
    },
    search: {
      type: "string",
      description: "Search circuits by name",
    },
    country_code: {
      type: "string",
      description: "Filter by ISO country code",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1SeasonsSchema = {
  type: "object",
  properties: {
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1EventsSchema = {
  type: "object",
  properties: {
    event_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by event IDs",
    },
    circuit_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by circuit IDs",
    },
    season: {
      type: "number",
      description: "Filter by season year",
    },
    status: {
      type: "string",
      description: "Filter by event status",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1SessionsSchema = {
  type: "object",
  properties: {
    event_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by event IDs",
    },
    type: {
      type: "string",
      description: "Filter by session type (Practice, Qualifying, Sprint, Race)",
    },
    status: {
      type: "string",
      description: "Filter by session status",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1SessionResultsSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1DriverStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const f1TeamStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const f1LapTimesSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs (required)",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    lap_number: {
      type: "number",
      description: "Filter by specific lap number",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  required: ["session_ids"],
  additionalProperties: false,
};

export const f1QualifyingResultsSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1PitStopsSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1TireStintsSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1SessionWeatherSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1RaceControlMessagesSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    category: {
      type: "string",
      description: "Filter by message category",
    },
    flag: {
      type: "string",
      description: "Filter by flag type",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1PositionHistorySchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs (required)",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    lap_number: {
      type: "number",
      description: "Filter by specific lap number",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  required: ["session_ids"],
  additionalProperties: false,
};

export const f1SessionTimingStatsSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    driver_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by driver IDs",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1TrackStatusSchema = {
  type: "object",
  properties: {
    session_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by session IDs",
    },
    status: {
      type: "string",
      description: "Filter by track status code",
    },
    cursor: {
      type: "number",
      description: "Pagination cursor",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100)",
    },
  },
  additionalProperties: false,
};

export const f1FuturesOddsSchema = {
  type: "object",
  properties: {
    event_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by event IDs",
    },
    market_type: {
      type: "string",
      description: "Filter by market type (e.g., driver_championship, constructor_championship)",
    },
  },
  additionalProperties: false,
};
