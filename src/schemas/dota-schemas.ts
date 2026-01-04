// Dota 2 JSON schemas for tool parameters

export const dotaTeamsSchema = {
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

export const dotaPlayersSchema = {
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

export const dotaHeroesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const dotaItemsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const dotaAbilitiesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const dotaTournamentsSchema = {
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
  },
  additionalProperties: false,
};

export const dotaTournamentTeamsSchema = {
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

export const dotaTournamentRosterSchema = {
  type: "object",
  properties: {
    tournament_id: {
      type: "number",
      description: "Tournament ID (required)",
    },
    team_id: {
      type: "number",
      description: "Team ID (required)",
    },
  },
  required: ["tournament_id", "team_id"],
  additionalProperties: false,
};

export const dotaHeroStatsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const dotaMatchesSchema = {
  type: "object",
  properties: {
    tournament_id: {
      type: "number",
      description: "Filter by tournament ID",
    },
    team_id: {
      type: "number",
      description: "Filter by team ID",
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

export const dotaMatchMapsSchema = {
  type: "object",
  properties: {
    match_id: {
      type: "number",
      description: "Match ID to get games for (required)",
    },
  },
  required: ["match_id"],
  additionalProperties: false,
};

export const dotaPlayerMatchMapStatsSchema = {
  type: "object",
  properties: {
    match_map_id: {
      type: "number",
      description: "Filter by match map ID",
    },
    player_id: {
      type: "number",
      description: "Filter by player ID",
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

export const dotaTeamMatchMapStatsSchema = {
  type: "object",
  properties: {
    match_map_id: {
      type: "number",
      description: "Filter by match map ID",
    },
    team_id: {
      type: "number",
      description: "Filter by team ID",
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

export const dotaPlayerOverallStatsSchema = {
  type: "object",
  properties: {
    player_id: {
      type: "number",
      description: "Filter by player ID",
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
