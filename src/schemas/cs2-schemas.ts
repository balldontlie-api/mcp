// CS2 (Counter-Strike 2) JSON schemas for tool parameters

export const cs2TeamsSchema = {
  type: "object",
  properties: {
    search: {
      type: "string",
      description: "Search teams by name",
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

export const cs2TeamByIdSchema = {
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

export const cs2PlayersSchema = {
  type: "object",
  properties: {
    search: {
      type: "string",
      description: "Search players by nickname or name",
    },
    team_id: {
      type: "number",
      description: "Filter by team ID",
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

export const cs2PlayerByIdSchema = {
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

export const cs2TournamentsSchema = {
  type: "object",
  properties: {
    search: {
      type: "string",
      description: "Search tournaments by name",
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

export const cs2TournamentByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the tournament to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const cs2TournamentTeamsSchema = {
  type: "object",
  properties: {
    tournament_id: {
      type: "number",
      description: "Tournament ID (required)",
    },
  },
  required: ["tournament_id"],
  additionalProperties: false,
};

export const cs2TeamMapPoolSchema = {
  type: "object",
  properties: {
    team_id: {
      type: "number",
      description: "Team ID (required)",
    },
  },
  required: ["team_id"],
  additionalProperties: false,
};

export const cs2RankingsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const cs2MatchesSchema = {
  type: "object",
  properties: {
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    tournament_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by tournament IDs",
    },
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by dates (YYYY-MM-DD format)",
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

export const cs2MatchByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the match to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const cs2MatchMapsSchema = {
  type: "object",
  properties: {
    match_ids: {
      type: "array",
      items: { type: "number" },
      description: "Match IDs (required)",
    },
  },
  required: ["match_ids"],
  additionalProperties: false,
};

export const cs2MatchMapStatsSchema = {
  type: "object",
  properties: {
    match_map_id: {
      type: "number",
      description: "Match map ID (required)",
    },
  },
  required: ["match_map_id"],
  additionalProperties: false,
};

export const cs2PlayerMatchStatsSchema = {
  type: "object",
  properties: {
    match_id: {
      type: "number",
      description: "Match ID (required)",
    },
  },
  required: ["match_id"],
  additionalProperties: false,
};

export const cs2PlayerMatchMapStatsSchema = {
  type: "object",
  properties: {
    match_map_id: {
      type: "number",
      description: "Match map ID (required)",
    },
  },
  required: ["match_map_id"],
  additionalProperties: false,
};

export const cs2PlayerAccuracyStatsSchema = {
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
