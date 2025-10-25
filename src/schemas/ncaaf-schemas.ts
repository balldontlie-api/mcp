// NCAAF JSON schemas for tool parameters

export const ncaafConferencesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const ncaafConferenceByIdSchema = {
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

export const ncaafTeamsSchema = {
  type: "object",
  properties: {
    conference: {
      type: "string",
      description: "Filter teams by conference",
    },
  },
  additionalProperties: false,
};

export const ncaafTeamByIdSchema = {
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

export const ncaafPlayersSchema = {
  type: "object",
  properties: {
    search: {
      type: "string",
      description: "Search players by name",
    },
    first_name: {
      type: "string",
      description: "Filter by first name",
    },
    last_name: {
      type: "string",
      description: "Filter by last name",
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
    position: {
      type: "string",
      description: "Filter by player position",
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

export const ncaafPlayerByIdSchema = {
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

export const ncaafStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    conference_id: {
      type: "number",
      description: "Filter by conference ID",
    },
  },
  additionalProperties: false,
};

export const ncaafGamesSchema = {
  type: "object",
  properties: {
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    weeks: {
      type: "array",
      items: { type: "number" },
      description: "Filter by week numbers",
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

export const ncaafGameByIdSchema = {
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

export const ncaafRankingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
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
  additionalProperties: false,
};

export const ncaafPlaysSchema = {
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

export const ncaafPlayerStatsSchema = {
  type: "object",
  properties: {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
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
    weeks: {
      type: "array",
      items: { type: "number" },
      description: "Filter by week numbers",
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

export const ncaafTeamStatsSchema = {
  type: "object",
  properties: {
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
    weeks: {
      type: "array",
      items: { type: "number" },
      description: "Filter by week numbers",
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

export const ncaafPlayerSeasonStatsSchema = {
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

export const ncaafTeamSeasonStatsSchema = {
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

export const ncaafBettingOddsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Filter by season (must be provided with week)",
    },
    week: {
      type: "number",
      description: "Filter by week (must be provided with season)",
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
