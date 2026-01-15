// Shared Soccer JSON schemas for tool parameters
// Used by La Liga, Serie A, UCL, Bundesliga, and Ligue 1

export const soccerTeamsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const soccerRostersSchema = {
  type: "object",
  properties: {
    team_id: {
      type: "number",
      description: "Team ID (required)",
    },
    season: {
      type: "number",
      description: "Season year",
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
  required: ["team_id"],
  additionalProperties: false,
};

export const soccerPlayersSchema = {
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
    search: {
      type: "string",
      description: "Search players by name",
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

export const soccerStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const soccerMatchesSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates (YYYY-MM-DD format)",
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

export const soccerMatchEventsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
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

export const soccerMatchLineupsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
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

export const soccerPlayerMatchStatsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
    },
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
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

export const soccerTeamMatchStatsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
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

export const soccerBettingOddsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
    },
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates (YYYY-MM-DD format)",
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

export const soccerPlayerPropsSchema = {
  type: "object",
  properties: {
    match_id: {
      type: "number",
      description: "The match ID to retrieve player props for (required)",
    },
    player_id: {
      type: "number",
      description: "Filter props for a specific player",
    },
    prop_type: {
      type: "string",
      enum: [
        "anytime_goal",
        "assists",
        "first_goal",
        "first_half_goal",
        "goals_assists",
        "header_goal",
        "last_goal",
        "outside_box_goal",
        "saves",
        "second_half_goal",
        "shots",
        "shots_on_target",
        "tackles",
      ],
      description: "Filter by prop type",
    },
  },
  required: ["match_id"],
  additionalProperties: false,
};

// UCL-specific schema for futures odds
export const soccerFuturesOddsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

// MLS-specific schema for teams (season is optional, defaults to current)
export const mlsTeamsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (optional, defaults to current season)",
    },
  },
  additionalProperties: false,
};

// MLS-specific schema for players (no season required)
export const mlsPlayersSchema = {
  type: "object",
  properties: {
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    search: {
      type: "string",
      description: "Search players by name",
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

// MLS-specific schema for standings (season is optional)
export const mlsStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (optional)",
    },
  },
  additionalProperties: false,
};
