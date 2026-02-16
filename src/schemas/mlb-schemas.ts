// MLB JSON schemas for tool parameters

export const mlbTeamsSchema = {
  type: "object",
  properties: {
    division: {
      type: "string",
      enum: ["East", "Central", "West"],
      description: "Filter teams by division",
    },
    league: {
      type: "string",
      enum: ["American", "National"],
      description: "Filter teams by league",
    },
  },
  additionalProperties: false,
};

export const mlbTeamByIdSchema = {
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

export const mlbPlayersSchema = {
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

export const mlbPlayerByIdSchema = {
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

export const mlbGamesSchema = {
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
    postseason: {
      type: "boolean",
      description: "Filter for postseason games",
    },
    season_type: {
      type: "string",
      enum: ["spring_training", "regular", "postseason"],
      description:
        "Filter by season type (spring_training, regular, or postseason). Takes precedence over postseason parameter.",
    },
  },
  additionalProperties: false,
};

export const mlbGameByIdSchema = {
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

export const mlbStatsSchema = {
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
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
  },
  additionalProperties: false,
};

export const mlbSeasonStatsSchema = {
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
    team_id: {
      type: "number",
      description: "Filter by team ID",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
    season_type: {
      type: "string",
      enum: ["spring_training", "regular", "postseason"],
      description:
        "Filter by season type. Takes precedence over postseason parameter.",
    },
    sort_by: {
      type: "string",
      description: "Sort by field",
    },
    sort_order: {
      type: "string",
      description: "Sort order (asc or desc)",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const mlbTeamSeasonStatsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    team_id: {
      type: "number",
      description: "Filter by specific team ID",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
    season_type: {
      type: "string",
      enum: ["spring_training", "regular", "postseason"],
      description:
        "Filter by season type. Takes precedence over postseason parameter.",
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

export const mlbStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const mlbPlayerInjuriesSchema = {
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

export const mlbPlayerSplitsSchema = {
  type: "object",
  properties: {
    player_id: {
      type: "number",
      description: "Player ID (required)",
    },
    season: {
      type: "number",
      description: "Season year (required)",
    },
  },
  required: ["player_id", "season"],
  additionalProperties: false,
};

export const mlbPlayerVersusSchema = {
  type: "object",
  properties: {
    player_id: {
      type: "number",
      description: "Player ID - batter or pitcher (required)",
    },
    opponent_team_id: {
      type: "number",
      description: "Opponent team ID (required)",
    },
  },
  required: ["player_id", "opponent_team_id"],
  additionalProperties: false,
};

export const mlbPlaysSchema = {
  type: "object",
  properties: {
    game_id: {
      type: "number",
      description: "The game ID (required)",
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
  required: ["game_id"],
  additionalProperties: false,
};

export const mlbPlateAppearancesSchema = {
  type: "object",
  properties: {
    game_id: {
      type: "number",
      description: "The game ID (required)",
    },
  },
  required: ["game_id"],
  additionalProperties: false,
};

export const mlbOddsSchema = {
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
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
  },
  additionalProperties: false,
};

export const mlbPlayerPropsSchema = {
  type: "object",
  properties: {
    game_id: {
      type: "number",
      description: "The game ID to retrieve player props for (required)",
    },
    player_id: {
      type: "number",
      description: "Filter props for a specific player",
    },
    prop_type: {
      type: "string",
      description:
        "Filter by prop type. Supported types: hits, home_runs, total_bases, rbis, stolen_bases.",
    },
    vendors: {
      type: "array",
      items: { type: "string" },
      description:
        "Filter by specific sportsbook vendors (e.g., draftkings, fanduel). If not provided, returns props from all available vendors.",
    },
  },
  required: ["game_id"],
  additionalProperties: false,
};
