// NBA JSON schemas for tool parameters

export const nbaTeamsSchema = {
  type: "object",
  properties: {
    division: {
      type: "string",
      enum: [
        "Atlantic",
        "Central",
        "Southeast",
        "Northwest",
        "Pacific",
        "Southwest",
      ],
      description: "Filter teams by division",
    },
    conference: {
      type: "string",
      enum: ["East", "West"],
      description: "Filter teams by conference",
    },
  },
  additionalProperties: false,
};

export const nbaTeamByIdSchema = {
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

export const nbaPlayersSchema = {
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

export const nbaPlayerByIdSchema = {
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

export const nbaGamesSchema = {
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
    postseason: {
      type: "boolean",
      description: "Filter for postseason games",
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

export const nbaGameByIdSchema = {
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

export const nbaStatsSchema = {
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
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
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

export const nbaSeasonAveragesSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["general", "shooting", "defending", "playmaking", "efficiency", "misc"],
      description: "Category of season averages (general, shooting, defending, playmaking, efficiency, misc)",
    },
    season: {
      type: "number",
      description: "Season year",
    },
    season_type: {
      type: "string",
      enum: ["regular", "playoffs"],
      description: "Season type (regular or playoffs)",
      default: "regular"
    },
    type: {
      type: "string",
      description: "Type of stats (varies by category - e.g., 'base' for general, '5ft_range' for shooting)",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs - should be an array",
    },
  },
  required: ["category", "season", "type"],
  additionalProperties: false,
};

export const nbaBoxScoresSchema = {
  type: "object",
  properties: {
    date: {
      type: "string",
      format: "date",
      description: "Specific date to get box scores for (YYYY-MM-DD format, required)",
    },
    game_id: {
      type: "number",
      description: "Specific game ID to get box scores for",
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

export const nbaStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    conference: {
      type: "string",
      enum: ["East", "West"],
      description: "Filter by conference",
    },
    division: {
      type: "string",
      enum: [
        "Atlantic",
        "Central",
        "Southeast",
        "Northwest",
        "Pacific",
        "Southwest",
      ],
      description: "Filter by division",
    },
  },
  additionalProperties: false,
};

export const nbaLeadersSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    stat_type: {
      type: "string",
      enum: ["reb", "dreb", "tov", "ast", "oreb", "min", "pts", "stl", "blk"],
      description: "Type of statistic to get leaders for",
    },
    cursor: {
      type: "number",
      minimum: 0,
      description: "Cursor for pagination (starting index, 0-based)",
    },
    per_page: {
      type: "number",
      minimum: 1,
      maximum: 100,
      description: "Number of results per page (max 100, default 25)",
      default: 25
    },
  },
  required: ["season", "stat_type"],
  additionalProperties: false,
};

export const nbaPlayerInjuriesSchema = {
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
