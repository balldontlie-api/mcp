# BALLDONTLIE Sports MCP Server

A Model Context Protocol (MCP) server that provides access to comprehensive sports data from the BALLDONTLIE API, including NBA, WNBA, NFL, MLB, EPL, NHL, and NCAAF statistics, player information, game data, and more.

## Features

- **99 Sports Endpoints**: Complete access to all BALLDONTLIE API endpoints
- **7 Major Sports**: NBA, WNBA, NFL, MLB, EPL, NHL, NCAAF
- **Comprehensive Data**: Teams, players, games, statistics, standings, injuries, and advanced analytics
- **Authentication**: Seamless API key forwarding to backend
- **Pagination**: Full support for cursor-based pagination
- **Error Handling**: Proper error forwarding and handling
- **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install @balldontlie/mcp-server
```

## Quick Start

### 1. Get API Key

Sign up at [BALLDONTLIE](https://app.balldontlie.io) to get your free API key.

### 2. Configure MCP Client

#### Option A: Use Hosted Remote Server (Recommended)

Add to your MCP client configuration (e.g., Claude Desktop) to use the hosted server:

```json
{
  "mcpServers": {
    "balldontlie-api": {
      "url": "https://mcp.balldontlie.io/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "<YOUR_BALLDONTLIE_API_KEY>"
      }
    }
  }
}
```

Replace `<YOUR_BALLDONTLIE_API_KEY>` with your actual API key from BALLDONTLIE.

#### Option B: Run from Source

Clone and run from source code:

```bash
git clone https://github.com/balldontlie-api/mcp-server.git
cd mcp-server
npm install
npm run build
npm start
```

Configure your MCP client to connect to the local server:

```json
{
  "mcpServers": {
    "balldontlie-api": {
      "url": "http://localhost:3000/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "<YOUR_BALLDONTLIE_API_KEY>"
      }
    }
  }
}
```

### 3. Use in Your MCP Client

The server will automatically provide all available tools. You can ask your AI assistant things like:

- "Get the current NBA standings"
- "Show me LeBron James' season stats"
- "What are today's NFL games?"
- "Get Manchester United's recent EPL matches"
- "Show me A'ja Wilson's WNBA season stats"
- "What are the current WNBA standings?"

## Environment Variables

| Variable               | Default                      | Description                                            |
| ---------------------- | ---------------------------- | ------------------------------------------------------ |
| `PORT`                 | `3000`                       | Server port when running locally                       |
| `BACKEND_API_URL`      | `https://api.balldontlie.io` | BALLDONTLIE API base URL                               |
| `API_TIMEOUT`          | `30000`                      | Request timeout in milliseconds                        |
| `LOG_LEVEL`            | `info`                       | Logging level (error, warn, info, debug)               |
| `NODE_ENV`             | `development`                | Environment (development, production, test)            |
| `ENABLE_DEBUG`         | `false`                      | Enable debug logging                                   |
| `ENABLE_TRACING`       | `false`                      | Enable DataDog APM tracing (requires DD_AGENT_HOST)    |
| `DD_AGENT_HOST`        | -                            | DataDog agent hostname for APM tracing                 |
| `DD_PROFILING_ENABLED` | `false`                      | Enable DataDog profiling                               |
| `SERVICE_VERSION`      | `1.0.0`                      | Service version for tracing                            |

## Available Tools

### NBA (15 tools)

| Tool                      | Description                  | Parameters                                                                         |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `nba_get_teams`           | Get all NBA teams            | `division`, `conference`                                                           |
| `nba_get_team_by_id`      | Get specific NBA team        | `id` (required)                                                                    |
| `nba_get_players`         | Get NBA players with filters | `search`, `first_name`, `last_name`, `team_ids`, `player_ids`, pagination          |
| `nba_get_player_by_id`    | Get specific NBA player      | `id` (required)                                                                    |
| `nba_get_active_players`  | Get active NBA players       | Same as `nba_get_players`                                                          |
| `nba_get_games`           | Get NBA games                | `dates`, `seasons`, `team_ids`, `postseason`, `start_date`, `end_date`, pagination |
| `nba_get_game_by_id`      | Get specific NBA game        | `id` (required)                                                                    |
| `nba_get_stats`           | Get NBA statistics           | `dates`, `seasons`, `team_ids`, `player_ids`, `game_ids`, `postseason`, pagination |
| `nba_get_season_averages` | Get season averages          | `season` (required), `category` (required), `type` (required), `player_ids`, `season_type` |
| `nba_get_advanced_stats`  | Get advanced statistics      | Same as `nba_get_stats`                                                            |
| `nba_get_box_scores`      | Get box scores               | `dates`, `seasons`, `team_ids`, `game_ids`, `postseason`, pagination               |
| `nba_get_live_box_scores` | Get live box scores          | Same as `nba_get_box_scores`                                                       |
| `nba_get_standings`       | Get team standings           | `season`, `conference`, `division`                                                 |
| `nba_get_leaders`         | Get statistical leaders      | `season`, `stat_type`, `per_page`                                                  |
| `nba_get_player_injuries` | Get player injuries          | `player_ids`, `team_ids`, pagination                                               |

### NFL (14 tools)

| Tool                               | Description                  | Parameters                                                                                  |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `nfl_get_teams`                    | Get all NFL teams            | `division`, `conference`                                                                    |
| `nfl_get_team_by_id`               | Get specific NFL team        | `id` (required)                                                                             |
| `nfl_get_players`                  | Get NFL players              | `search`, `first_name`, `last_name`, `team_ids`, `player_ids`, `position`, pagination       |
| `nfl_get_player_by_id`             | Get specific NFL player      | `id` (required)                                                                             |
| `nfl_get_active_players`           | Get active NFL players       | Same as `nfl_get_players`                                                                   |
| `nfl_get_games`                    | Get NFL games                | `dates`, `seasons`, `team_ids`, `weeks`, `postseason`, `start_date`, `end_date`, pagination |
| `nfl_get_game_by_id`               | Get specific NFL game        | `id` (required)                                                                             |
| `nfl_get_stats`                    | Get NFL statistics           | `dates`, `seasons`, `team_ids`, `player_ids`, `game_ids`, `weeks`, `postseason`, pagination |
| `nfl_get_season_stats`             | Get season statistics        | `season`, `player_ids`, `team_ids`, `postseason`, pagination                                |
| `nfl_get_standings`                | Get team standings           | `season`, `conference`, `division`                                                          |
| `nfl_get_player_injuries`          | Get player injuries          | `player_ids`, `team_ids`, pagination                                                        |
| `nfl_get_advanced_rushing_stats`   | Get advanced rushing stats   | `season`, `week`, `player_ids`, `team_ids`, `position`, pagination                          |
| `nfl_get_advanced_passing_stats`   | Get advanced passing stats   | Same as rushing                                                                             |
| `nfl_get_advanced_receiving_stats` | Get advanced receiving stats | Same as rushing                                                                             |

### MLB (12 tools)

| Tool                        | Description             | Parameters                                                                                      |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- |
| `mlb_get_teams`             | Get all MLB teams       | `division`, `league`                                                                            |
| `mlb_get_team_by_id`        | Get specific MLB team   | `id` (required)                                                                                 |
| `mlb_get_players`           | Get MLB players         | `search`, `first_name`, `last_name`, `team_ids`, `player_ids`, `position`, `active`, pagination |
| `mlb_get_player_by_id`      | Get specific MLB player | `id` (required)                                                                                 |
| `mlb_get_active_players`    | Get active MLB players  | Same as `mlb_get_players`                                                                       |
| `mlb_get_games`             | Get MLB games           | `dates`, `seasons`, `team_ids`, `postseason`, `start_date`, `end_date`, pagination              |
| `mlb_get_game_by_id`        | Get specific MLB game   | `id` (required)                                                                                 |
| `mlb_get_stats`             | Get MLB statistics      | `dates`, `seasons`, `team_ids`, `player_ids`, `game_ids`, `postseason`, pagination              |
| `mlb_get_season_stats`      | Get season statistics   | `season`, `player_ids`, `team_ids`, `postseason`, pagination                                    |
| `mlb_get_team_season_stats` | Get team season stats   | `season`, `team_ids`, `postseason`, pagination                                                  |
| `mlb_get_standings`         | Get team standings      | `season`, `league`, `division`                                                                  |
| `mlb_get_player_injuries`   | Get player injuries     | `player_ids`, `team_ids`, pagination                                                            |

### EPL (16 tools)

| Tool                           | Description             | Parameters                                                                    |
| ------------------------------ | ----------------------- | ----------------------------------------------------------------------------- |
| `epl_get_teams`                | Get all EPL teams       | pagination                                                                    |
| `epl_get_team_by_id`           | Get specific EPL team   | `id` (required)                                                               |
| `epl_get_team_players`         | Get team players        | `id` (required), pagination                                                   |
| `epl_get_team_season_stats`    | Get team season stats   | `id` (required), `season`, `stat_types`                                       |
| `epl_get_team_stats_leaders`   | Get team stat leaders   | `season`, `stat_type`, `per_page`                                             |
| `epl_get_standings`            | Get EPL standings       | `season`                                                                      |
| `epl_get_players`              | Get EPL players         | `search`, `team_ids`, `player_ids`, `position`, pagination                    |
| `epl_get_player_by_id`         | Get specific EPL player | `id` (required)                                                               |
| `epl_get_player_season_stats`  | Get player season stats | `id` (required), `season`, `stat_types`                                       |
| `epl_get_player_stats_leaders` | Get player stat leaders | `season`, `stat_type`, `per_page`                                             |
| `epl_get_games`                | Get EPL games           | `dates`, `seasons`, `team_ids`, `weeks`, `start_date`, `end_date`, pagination |
| `epl_get_game_by_id`           | Get specific EPL game   | `id` (required)                                                               |
| `epl_get_game_lineups`         | Get game lineups        | `id` (required)                                                               |
| `epl_get_game_goals`           | Get game goals          | `id` (required)                                                               |
| `epl_get_game_team_stats`      | Get game team stats     | `id` (required)                                                               |
| `epl_get_game_player_stats`    | Get game player stats   | `id` (required)                                                               |

### NHL (12 tools)

| Tool                           | Description             | Parameters                                                                          |
| ------------------------------ | ----------------------- | ----------------------------------------------------------------------------------- |
| `nhl_get_teams`                | Get all NHL teams       | `conference`, `division`, pagination                                                |
| `nhl_get_team_by_id`           | Get specific NHL team   | `id` (required)                                                                     |
| `nhl_get_team_season_stats`    | Get team season stats   | `id` (required), `season`                                                           |
| `nhl_get_team_stats_leaders`   | Get team stat leaders   | `season`, `stat_type`, `per_page`                                                   |
| `nhl_get_players`              | Get NHL players         | `search`, `team_ids`, `player_ids`, `position`, pagination                          |
| `nhl_get_player_by_id`         | Get specific NHL player | `id` (required)                                                                     |
| `nhl_get_player_season_stats`  | Get player season stats | `id` (required), `season`                                                           |
| `nhl_get_player_stats_leaders` | Get player stat leaders | `season`, `stat_type`, `per_page`                                                   |
| `nhl_get_games`                | Get NHL games           | `dates`, `seasons`, `team_ids`, `season_type`, `start_date`, `end_date`, pagination |
| `nhl_get_game_by_id`           | Get specific NHL game   | `id` (required)                                                                     |
| `nhl_get_standings`            | Get NHL standings       | `season`, `conference`, `division`                                                  |
| `nhl_get_box_scores`           | Get NHL box scores      | `dates`, `seasons`, `team_ids`, `game_ids`, `season_type`, pagination               |

### WNBA (14 tools)

| Tool                            | Description                  | Parameters                                                                       |
| ------------------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `wnba_get_teams`                | Get all WNBA teams           | `conference`                                                                     |
| `wnba_get_team_by_id`           | Get specific WNBA team       | `id` (required)                                                                  |
| `wnba_get_players`              | Get WNBA players             | `search`, `first_name`, `last_name`, `team_ids`, `player_ids`, pagination        |
| `wnba_get_player_by_id`         | Get specific WNBA player     | `id` (required)                                                                  |
| `wnba_get_active_players`       | Get active WNBA players      | Same as `wnba_get_players`                                                       |
| `wnba_get_games`                | Get WNBA games               | `dates`, `seasons`, `team_ids`, `season_type`, `start_date`, `end_date`, pagination |
| `wnba_get_game_by_id`           | Get specific WNBA game       | `id` (required)                                                                  |
| `wnba_get_player_stats`         | Get player game statistics   | `game_ids`, `dates`, `seasons`, `player_ids`, `team_ids`, pagination             |
| `wnba_get_team_stats`           | Get team game statistics     | `game_ids`, `dates`, `seasons`, `team_ids`, pagination                           |
| `wnba_get_player_season_stats`  | Get player season stats      | `player_ids`, `team_ids`, `season`, `season_type`, pagination                    |
| `wnba_get_team_season_stats`    | Get team season stats        | `team_ids`, `season`, `season_type`, pagination                                  |
| `wnba_get_standings`            | Get WNBA standings           | `season`, `conference`                                                           |
| `wnba_get_player_injuries`      | Get player injuries          | `player_ids`, `team_ids`, pagination                                             |
| `wnba_get_plays`                | Get play-by-play data        | `game_id` (required)                                                             |

### NCAAF (16 tools)

| Tool                             | Description                  | Parameters                                                                                  |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `ncaaf_get_conferences`          | Get all NCAAF conferences    | -                                                                                           |
| `ncaaf_get_conference_by_id`     | Get specific NCAAF conference| `id` (required)                                                                             |
| `ncaaf_get_teams`                | Get all NCAAF teams          | `conference`, pagination                                                                    |
| `ncaaf_get_team_by_id`           | Get specific NCAAF team      | `id` (required)                                                                             |
| `ncaaf_get_players`              | Get NCAAF players            | `search`, `first_name`, `last_name`, `team_ids`, `player_ids`, `position`, pagination       |
| `ncaaf_get_active_players`       | Get active NCAAF players     | Same as `ncaaf_get_players`                                                                 |
| `ncaaf_get_player_by_id`         | Get specific NCAAF player    | `id` (required)                                                                             |
| `ncaaf_get_standings`            | Get NCAAF standings          | `season`, `conference_id`, pagination                                                       |
| `ncaaf_get_games`                | Get NCAAF games              | `dates`, `seasons`, `team_ids`, `weeks`, `start_date`, `end_date`, pagination               |
| `ncaaf_get_game_by_id`           | Get specific NCAAF game      | `id` (required)                                                                             |
| `ncaaf_get_rankings`             | Get NCAAF rankings           | `season`, `week`, pagination                                                                |
| `ncaaf_get_plays`                | Get play-by-play data        | `game_id` (required)                                                                        |
| `ncaaf_get_player_stats`         | Get player game statistics   | `game_ids`, `dates`, `seasons`, `player_ids`, `team_ids`, `weeks`, pagination               |
| `ncaaf_get_team_stats`           | Get team game statistics     | `game_ids`, `dates`, `seasons`, `team_ids`, `weeks`, pagination                             |
| `ncaaf_get_player_season_stats`  | Get player season stats      | `season` (required), `player_ids`, `team_ids`, pagination                                   |
| `ncaaf_get_team_season_stats`    | Get team season stats        | `season` (required), `team_ids`, pagination                                                 |

## Authentication

The server forwards Authorization headers to the BALLDONTLIE API. Your MCP client should include the API key in requests:

```
Authorization: YOUR_API_KEY
```

## Error Handling

The server provides detailed error information:

- **Authentication Errors (401)**: Missing or invalid API key
- **Authorization Errors (403)**: Insufficient tier access
- **Validation Errors (400)**: Invalid parameters
- **Rate Limiting (429)**: Request rate exceeded
- **Server Errors (5xx)**: Backend API issues

## Development

```bash
# Clone and install
git clone <repository>
cd mcp-server
npm install

# Build
npm run build

# Run in development
npm run dev

# Clean build
npm run clean
```

## API Tiers

BALLDONTLIE offers different tiers with varying access levels:

- **Free**: Basic endpoints (teams, players, games)
- **ALL-STAR ($9.99/mo)**: Includes stats, injuries, standings
- **GOAT ($39.99/mo)**: Full access including advanced stats, box scores, betting odds

## Support

- [BALLDONTLIE API Documentation](https://docs.balldontlie.io)
- [Discord Community](https://discord.gg/cQJhfTPn8j)

## License

MIT
