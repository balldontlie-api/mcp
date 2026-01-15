// PGA Tour JSON schemas for tool parameters

export const pgaPlayersSchema = {
  type: "object",
  properties: {
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    search: {
      type: "string",
      description: "Search by player name",
    },
    first_name: {
      type: "string",
      description: "Filter by first name",
    },
    last_name: {
      type: "string",
      description: "Filter by last name",
    },
    country: {
      type: "string",
      description: "Filter by country",
    },
    active: {
      type: "boolean",
      description: "Filter by active status",
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

export const pgaTournamentsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    season: {
      type: "number",
      description: "Filter by season year",
    },
    status: {
      type: "string",
      enum: ["COMPLETED", "IN_PROGRESS", "SCHEDULED"],
      description: "Filter by status (COMPLETED, IN_PROGRESS, SCHEDULED)",
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

export const pgaCoursesSchema = {
  type: "object",
  properties: {
    course_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by course IDs",
    },
    search: {
      type: "string",
      description: "Search by course name",
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

export const pgaTournamentResultsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    season: {
      type: "number",
      description: "Filter by season year",
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

export const pgaTournamentCourseStatsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    course_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by course IDs",
    },
    hole_number: {
      type: "number",
      minimum: 1,
      maximum: 18,
      description: "Filter by hole number (1-18)",
    },
    round_number: {
      type: "number",
      minimum: 1,
      maximum: 4,
      description: "Filter by round number (1-4)",
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

export const pgaCourseHolesSchema = {
  type: "object",
  properties: {
    course_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by course IDs",
    },
    hole_number: {
      type: "number",
      minimum: 1,
      maximum: 18,
      description: "Filter by hole number (1-18)",
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

export const pgaPlayerRoundResultsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    round_number: {
      type: "number",
      minimum: 1,
      maximum: 4,
      description: "Filter by round number (1-4)",
    },
    season: {
      type: "number",
      description: "Filter by season year",
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

export const pgaPlayerRoundStatsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    round_number: {
      type: "number",
      minimum: -1,
      maximum: 4,
      description: "Filter by round number (1-4, -1 for tournament total)",
    },
    season: {
      type: "number",
      description: "Filter by season year",
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

export const pgaPlayerSeasonStatsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    stat_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by stat category IDs",
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

export const pgaPlayerScorecardsSchema = {
  type: "object",
  properties: {
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    round_number: {
      type: "number",
      minimum: 1,
      maximum: 4,
      description: "Filter by round number (1-4)",
    },
    hole_number: {
      type: "number",
      minimum: 1,
      maximum: 18,
      description: "Filter by hole number (1-18)",
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
