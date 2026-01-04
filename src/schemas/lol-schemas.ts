// League of Legends (LOL) JSON schemas for tool parameters

export const lolTeamsSchema = {
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

export const lolPlayersSchema = {
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

export const lolChampionsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolItemsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolSpellsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolRunePathsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolRunesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolTournamentsSchema = {
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

export const lolTournamentTeamsSchema = {
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

export const lolTournamentRosterSchema = {
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

export const lolChampionStatsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const lolMatchesSchema = {
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

export const lolMatchMapsSchema = {
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

export const lolPlayerMatchMapStatsSchema = {
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

export const lolTeamMatchMapStatsSchema = {
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

export const lolPlayerOverallStatsSchema = {
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
