// WNBA JSON schemas for tool parameters

export const wnbaTeamsSchema = {
  type: "object",
  properties: {
    conference: {
      type: "string",
      enum: ["Eastern", "Western"],
      description: "Filter teams by conference",
    },
  },
  additionalProperties: false,
};

export const wnbaTeamByIdSchema = {
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

export const wnbaPlayersSchema = {
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

export const wnbaPlayerByIdSchema = {
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

export const wnbaGamesSchema = {
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
    season_type: {
      type: "string",
      description: "Filter by season type",
    },
  },
  additionalProperties: false,
};

export const wnbaGameByIdSchema = {
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

export const wnbaPlayerStatsSchema = {
  type: "object",
  properties: {
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

export const wnbaTeamStatsSchema = {
  type: "object",
  properties: {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
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

export const wnbaPlayerSeasonStatsSchema = {
  type: "object",
  properties: {
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
    season: {
      type: "number",
      description: "Filter by season",
    },
    season_type: {
      type: "number",
      description: "Filter by season type",
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

export const wnbaTeamSeasonStatsSchema = {
  type: "object",
  properties: {
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    season: {
      type: "number",
      description: "Filter by season",
    },
    season_type: {
      type: "number",
      description: "Filter by season type",
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

const paginationProperties = {
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
};

const gameAdvancedProperties = {
  game_ids: {
    type: "array",
    items: { type: "number" },
    description: "Filter by game IDs",
  },
  dates: {
    type: "array",
    items: { type: "string", format: "date" },
    description: "Filter by specific game dates",
  },
  seasons: {
    type: "array",
    items: { type: "number" },
    description: "Filter by seasons",
  },
  season: {
    type: "number",
    description: "Filter by season",
  },
  team_ids: {
    type: "array",
    items: { type: "number" },
    description: "Filter by team IDs",
  },
  season_type: {
    type: "string",
    enum: ["regular", "playoffs"],
    description: "Filter by season type",
  },
  postseason: {
    type: "boolean",
    description: "Filter by postseason status",
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
  period: {
    type: "number",
    description: "Filter by period; 0 represents full game",
  },
  ...paginationProperties,
};

const advancedSeasonProperties = {
  team_ids: {
    type: "array",
    items: { type: "number" },
    description: "Filter by team IDs",
  },
  season: {
    type: "number",
    description: "Season year",
  },
  season_type: {
    type: "string",
    enum: ["regular", "playoffs"],
    description: "Filter by season type",
  },
  postseason: {
    type: "boolean",
    description: "Filter by postseason status",
  },
  scope: {
    type: "string",
    enum: ["general", "clutch"],
    description: "Filter by stat scope",
  },
  measure_type: {
    type: "string",
    enum: [
      "advanced",
      "misc",
      "scoring",
      "usage",
      "defense",
      "four_factors",
      "opponent",
      "base",
    ],
    description: "Filter by stat category",
  },
  per_mode: {
    type: "string",
    enum: ["totals", "per_game"],
    description: "Filter by aggregation mode",
  },
  ...paginationProperties,
};

const shotLocationProperties = {
  season: {
    type: "number",
    description: "Season year",
  },
  season_type: {
    type: "string",
    enum: ["regular", "playoffs"],
    description: "Filter by season type",
  },
  postseason: {
    type: "boolean",
    description: "Filter by postseason status",
  },
  distance_range: {
    type: "string",
    enum: ["by_zone", "5ft_range"],
    description: "Filter by distance grouping",
  },
  per_mode: {
    type: "string",
    enum: ["totals", "per_game"],
    description: "Filter by aggregation mode",
  },
  ...paginationProperties,
};

export const wnbaPlayerGameAdvancedStatsSchema = {
  type: "object",
  properties: {
    ...gameAdvancedProperties,
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
  },
  additionalProperties: false,
};

export const wnbaTeamGameAdvancedStatsSchema = {
  type: "object",
  properties: gameAdvancedProperties,
  additionalProperties: false,
};

export const wnbaPlayerSeasonAdvancedStatsSchema = {
  type: "object",
  properties: {
    ...advancedSeasonProperties,
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const wnbaTeamSeasonAdvancedStatsSchema = {
  type: "object",
  properties: advancedSeasonProperties,
  required: ["season"],
  additionalProperties: false,
};

export const wnbaPlayerShotLocationsSchema = {
  type: "object",
  properties: {
    ...shotLocationProperties,
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
  required: ["season"],
  additionalProperties: false,
};

export const wnbaTeamShotLocationsSchema = {
  type: "object",
  properties: {
    ...shotLocationProperties,
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    measure_type: {
      type: "string",
      enum: [
        "advanced",
        "misc",
        "scoring",
        "usage",
        "defense",
        "four_factors",
        "opponent",
        "base",
      ],
      description: "Filter by stat category",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const wnbaStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Filter by season",
    },
    conference: {
      type: "string",
      enum: ["Eastern", "Western"],
      description: "Filter by conference",
    },
  },
  additionalProperties: false,
};

export const wnbaPlayerInjuriesSchema = {
  type: "object",
  properties: {
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
  additionalProperties: false,
};

export const wnbaPlaysSchema = {
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
