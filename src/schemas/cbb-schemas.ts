// CBB (College Baseball) JSON schemas for tool parameters

export const cbbConferencesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const cbbTeamsSchema = {
  type: "object",
  properties: {
    conference_id: {
      type: "string",
      description: "Filter by conference ID",
    },
  },
  additionalProperties: false,
};

export const cbbPlayersSchema = {
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
      description: "Filter by player IDs",
    },
    search: {
      type: "string",
      description: "Search by player name",
    },
  },
  additionalProperties: false,
};

export const cbbStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year (required)",
    },
    conference_id: {
      type: "number",
      description: "Filter by conference ID",
    },
  },
  required: ["season"],
  additionalProperties: false,
};

export const cbbGamesSchema = {
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
      description: "Filter games after this date (YYYY-MM-DD)",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter games before this date (YYYY-MM-DD)",
    },
  },
  additionalProperties: false,
};

export const cbbRankingsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const cbbPlaysSchema = {
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

export const cbbPlayerBattingStatsSchema = {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Filter stats after this date",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter stats before this date",
    },
  },
  additionalProperties: false,
};

export const cbbPlayerPitchingStatsSchema = {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Filter stats after this date",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter stats before this date",
    },
  },
  additionalProperties: false,
};

export const cbbTeamBattingStatsSchema = {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Filter stats after this date",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter stats before this date",
    },
  },
  additionalProperties: false,
};

export const cbbTeamPitchingStatsSchema = {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Filter stats after this date",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter stats before this date",
    },
  },
  additionalProperties: false,
};

export const cbbTeamFieldingStatsSchema = {
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
      description: "Filter by specific dates (YYYY-MM-DD format)",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Filter stats after this date",
    },
    end_date: {
      type: "string",
      format: "date",
      description: "Filter stats before this date",
    },
  },
  additionalProperties: false,
};

export const cbbPlayerSeasonBattingStatsSchema = {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    season: {
      type: "number",
      description: "Filter by season",
    },
  },
  additionalProperties: false,
};

export const cbbPlayerSeasonPitchingStatsSchema = {
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
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    season: {
      type: "number",
      description: "Filter by season",
    },
  },
  additionalProperties: false,
};

export const cbbTeamSeasonStatsSchema = {
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
    season: {
      type: "number",
      description: "Filter by season",
    },
  },
  additionalProperties: false,
};

export const cbbOddsSchema = {
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
      description: "Filter by game dates (YYYY-MM-DD format)",
    },
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
  },
  additionalProperties: false,
};
