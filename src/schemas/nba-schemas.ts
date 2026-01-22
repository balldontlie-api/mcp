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
      description: "Date in YYYY-MM-DD format",
    },
  },
  required: ["date"],
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

export const nbaBettingOddsSchema = {
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

export const nbaLineupsSchema = {
  type: "object",
  properties: {
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs (required)",
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
  required: ["game_ids"],
  additionalProperties: false,
};

export const nbaPlayerPropsSchema = {
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
      enum: [
        "assists",
        "assists_1q",
        "assists_first3min",
        "blocks",
        "double_double",
        "points",
        "points_1q",
        "points_assists",
        "points_first3min",
        "points_rebounds",
        "points_rebounds_assists",
        "rebounds",
        "rebounds_1q",
        "rebounds_assists",
        "rebounds_first3min",
        "steals",
        "threes",
        "triple_double",
      ],
      description: "Filter by prop type",
    },
  },
  required: ["game_id"],
  additionalProperties: false,
};

export const nbaContractsByTeamSchema = {
  type: "object",
  properties: {
    team_id: {
      type: "number",
      description: "Team ID (required)",
    },
    season: {
      type: "number",
      description: "Season year (defaults to current season if not specified)",
    },
  },
  required: ["team_id"],
  additionalProperties: false,
};

export const nbaContractsByPlayerSchema = {
  type: "object",
  properties: {
    player_id: {
      type: "number",
      description: "Player ID (required)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by specific seasons",
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
  required: ["player_id"],
  additionalProperties: false,
};

export const nbaContractsAggregateSchema = {
  type: "object",
  properties: {
    player_id: {
      type: "number",
      description: "Player ID (required)",
    },
  },
  required: ["player_id"],
  additionalProperties: false,
};

export const nbaPlaysSchema = {
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

export const nbaTeamSeasonAveragesSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["general", "clutch", "shooting", "playtype", "tracking", "hustle", "shotdashboard"],
      description: "Statistical category (general, clutch, shooting, playtype, tracking, hustle, shotdashboard)",
    },
    season: {
      type: "number",
      description: "Season year (required)",
    },
    season_type: {
      type: "string",
      enum: ["regular", "playoffs", "ist"],
      description: "Season type (regular, playoffs, ist)",
    },
    type: {
      type: "string",
      description: "Statistics type - required for all categories except hustle. Options vary by category: general (base, advanced, scoring, misc, opponent, defense, violations), clutch (base, advanced, misc, scoring), shooting (by_zone_base, by_zone_opponent, 5ft_range_base, 5ft_range_opponent), playtype (cut, handoff, isolation, offrebound, offscreen, postup, prballhandler, prrollman, spotup, transition, misc), tracking (painttouch, efficiency, speeddistance, defense, elbowtouch, posttouch, passing, drives, rebounding, catchshoot, pullupshot, possessions), shotdashboard (overall, pullups, catch_and_shoot, less_than_10_ft)",
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
  required: ["category", "season", "season_type"],
  additionalProperties: false,
};

export const nbaAdvancedStatsV2Schema = {
  type: "object",
  properties: {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Start date for filtering (YYYY-MM-DD)",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "End date for filtering (YYYY-MM-DD)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason games only",
    },
    period: {
      type: "number",
      description: "Filter by game period (0 for full game stats)",
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
