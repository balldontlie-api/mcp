// NHL JSON schemas for tool parameters

export const nhlTeamsSchema = {
  type: "object",
  properties: {
    conference: {
      type: "string",
      description: "Filter teams by conference",
    },
    division: {
      type: "string",
      description: "Filter teams by division",
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

export const nhlTeamByIdSchema = {
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

export const nhlTeamSeasonStatsSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the team",
    },
    season: {
      type: "number",
      description: "Season year",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
  },
  required: ["id", "season"],
  additionalProperties: false,
};

export const nhlTeamStatsLeadersSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    type: {
      type: "string",
      description: "Type of statistic to get leaders for",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
  },
  required: ["season", "type"],
  additionalProperties: false,
};

export const nhlPlayersSchema = {
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
      description: "Filter by specific player IDs",
    },
    team_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by team IDs",
    },
    name: {
      type: "string",
      description: "Filter by player name",
    },
    seasons: {
      type: "array",
      items: { type: "number" },
      description: "Filter by seasons",
    },
  },
  additionalProperties: false,
};

export const nhlPlayerByIdSchema = {
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

export const nhlPlayerSeasonStatsSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The ID of the player",
    },
    season: {
      type: "number",
      description: "Season year",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
  },
  required: ["id", "season"],
  additionalProperties: false,
};

export const nhlPlayerStatsLeadersSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    type: {
      type: "string",
      description: "Type of statistic to get leaders for",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason stats",
    },
  },
  required: ["season", "type"],
  additionalProperties: false,
};

export const nhlGamesSchema = {
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
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
    postseason: {
      type: "boolean",
      description: "Filter for postseason games",
    },
  },
  additionalProperties: false,
};

export const nhlGameByIdSchema = {
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

export const nhlStandingsSchema = {
  type: "object",
  properties: {
    season: {
      type: "number",
      description: "Season year",
    },
    conference: {
      type: "string",
      description: "Filter by conference",
    },
    division: {
      type: "string",
      description: "Filter by division",
    },
  },
  additionalProperties: false,
};

export const nhlBoxScoresSchema = {
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
    dates: {
      type: "array",
      items: { type: "string", format: "date" },
      description: "Filter by specific dates",
    },
    season: {
      type: "number",
      description: "Filter by season",
    },
    game_ids: {
      type: "array",
      items: { type: "number" },
      description: "Filter by game IDs",
    },
  },
  additionalProperties: false,
};

export const nhlBettingOddsSchema = {
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

export const nhlPlayerPropsSchema = {
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
        "anytime_goal",
        "anytime_goal_1p",
        "anytime_goal_2p",
        "anytime_goal_3p",
        "assists",
        "first_goal",
        "first_goal_2p",
        "first_goal_3p",
        "goals",
        "last_goal",
        "overtime_goal",
        "points",
        "points_1p",
        "points_2p",
        "points_3p",
        "power_play_points",
        "saves",
        "second_goal",
        "shots_on_goal",
        "shots_on_goal_1p",
        "shots_on_goal_2p",
        "shots_on_goal_3p",
        "third_goal",
      ],
      description: "Filter by prop type",
    },
  },
  required: ["game_id"],
  additionalProperties: false,
};

export const nhlPlaysSchema = {
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

export const nhlPlayerInjuriesSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
