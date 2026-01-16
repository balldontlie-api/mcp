// ATP Tennis JSON schemas for tool parameters (Men's Singles Only)

export const atpPlayersSchema = {
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
    country_code: {
      type: "string",
      description: "Filter by country code (e.g., ESP, ITA)",
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

export const atpPlayerByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "Player ID",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const atpTournamentsSchema = {
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
    surface: {
      type: "string",
      description: "Filter by surface (Hard, Clay, Grass, Carpet)",
    },
    category: {
      type: "string",
      description: "Filter by category (Grand Slam, ATP 1000, ATP 500, ATP 250)",
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

export const atpTournamentByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "Tournament ID",
    },
    season: {
      type: "number",
      description: "Get tournament info for specific season year",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const atpRankingsSchema = {
  type: "object",
  properties: {
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    date: {
      type: "string",
      description: "Get rankings for specific date (YYYY-MM-DD)",
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

export const atpMatchesSchema = {
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
    round: {
      type: "string",
      description: "Filter by round (Finals, Semi-Finals, etc.)",
    },
    is_live: {
      type: "boolean",
      description: "Filter for live matches only",
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

export const atpMatchByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "Match ID",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const atpRaceSchema = {
  type: "object",
  properties: {
    player_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by player IDs",
    },
    date: {
      type: "string",
      description: "Get standings for specific date (YYYY-MM-DD)",
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

export const atpMatchStatsSchema = {
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
    set_number: {
      type: "number",
      description: "Filter by set number (0 for full match stats)",
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

export const atpPlayerCareerStatsSchema = {
  type: "object",
  properties: {
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

export const atpHeadToHeadSchema = {
  type: "object",
  properties: {
    player1_id: {
      type: "number",
      description: "First player ID",
    },
    player2_id: {
      type: "number",
      description: "Second player ID",
    },
  },
  required: ["player1_id", "player2_id"],
  additionalProperties: false,
};

export const atpOddsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by match IDs",
    },
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
  },
  additionalProperties: false,
};
