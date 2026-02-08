// NCAAW JSON schemas for tool parameters

export const ncaawConferencesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const ncaawConferenceByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the conference to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const ncaawTeamsSchema = {
  type: "object",
  properties: {
    conference: {
      type: "string",
      description: "Filter teams by conference",
    },
  },
  additionalProperties: false,
};

export const ncaawTeamByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the team to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const ncaawPlayersSchema = {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by specific player IDs",
    },
    search: {
      type: "string",
      description: "Search players by name",
    },
  },
  additionalProperties: false,
};

export const ncaawPlayerByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the player to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const ncaawStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    conference_id: {
      type: "number",
      description: "Filter by conference ID (required)",
    },
  },
  required: ["conference_id"],
  additionalProperties: false,
};

export const ncaawGamesSchema = {
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
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Start date for date range filter (YYYY-MM-DD)",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "End date for date range filter (YYYY-MM-DD)",
    },
  },
  additionalProperties: false,
};

export const ncaawGameByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the game to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const ncaawRankingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    week: {
      type: "number",
      description: "Week number",
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

export const ncaawPlaysSchema = {
  type: "object",
  properties: {
    game_id: {
      type: "number",
      description: "Game ID (required)",
    },
  },
  required: ["game_id"],
  additionalProperties: false,
};

export const ncaawPlayerStatsSchema = {
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
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Start date for date range filter",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "End date for date range filter",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
  },
  additionalProperties: false,
};

export const ncaawTeamStatsSchema = {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Start date for date range filter",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "End date for date range filter",
    },
  },
  additionalProperties: false,
};

export const ncaawPlayerSeasonStatsSchema = {
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
    season: {
      type: "number",
      description: "Season year",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
  },
  additionalProperties: false,
};

export const ncaawTeamSeasonStatsSchema = {
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

export const ncaawBracketsSchema = {
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
    season: {
      type: "number",
      description: "Season year",
    },
    round_id: {
      type: "number",
      minimum: 0,
      maximum: 6,
      description: "Filter by tournament round (0-6)",
    },
  },
  additionalProperties: false,
};

export const ncaawBettingOddsSchema = {
  type: "object",
  properties: {
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
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
