# stickyrice-mcp

MCP (Model Context Protocol) server for [Sticky Rice](https://stickyrice.app) - interact with your notes from Claude.

## Quick Start

### 1. Authenticate

```bash
npx stickyrice-mcp auth
```

This opens your browser to authorize the connection. Once approved, your credentials are saved locally.

### 2. Configure Claude

Add to your Claude config (`~/.claude.json` or Claude Desktop settings):

```json
{
  "mcpServers": {
    "stickyrice": {
      "command": "npx",
      "args": ["-y", "stickyrice-mcp"]
    }
  }
}
```

### 3. Restart Claude

You're done! Ask Claude about your notes.

## Commands

```bash
npx stickyrice-mcp auth     # Authenticate (opens browser)
npx stickyrice-mcp logout   # Remove saved credentials
npx stickyrice-mcp status   # Check authentication status
npx stickyrice-mcp help     # Show help
```

## Available Tools

### Workspaces
| Tool | Description |
|------|-------------|
| `list_workspaces` | List all your workspaces |
| `create_workspace` | Create a new workspace |
| `update_workspace` | Update workspace name or order |
| `delete_workspace` | Delete a workspace (moves boards to Personal) |

### Boards
| Tool | Description |
|------|-------------|
| `list_boards` | List all your boards |
| `get_board` | Get a board with all columns, notes, and items |
| `create_board` | Create a new board |
| `update_board` | Update board title, order, or move to workspace |
| `delete_board` | Delete a board and all its contents |
| `search_notes` | Search notes by keyword across all boards |

### Columns
| Tool | Description |
|------|-------------|
| `create_column` | Create a new column in a board |
| `update_column` | Update column title, order, or move to another board |
| `delete_column` | Delete a column and all its notes |

### Notes
| Tool | Description |
|------|-------------|
| `create_note` | Create a new note in a column |
| `update_note` | Update note title, color, or move to another column |
| `delete_note` | Delete a note and all its items |
| `get_note` | Get a single note with all details |

### Note Items
| Tool | Description |
|------|-------------|
| `add_note_item` | Add a bullet journal item to a note |
| `update_note_item` | Update item content or type (todo, doing, done, etc.) |
| `delete_note_item` | Remove an item from a note |

### Tags
| Tool | Description |
|------|-------------|
| `list_tags` | List all your tags |
| `create_tag` | Create a new tag |
| `tag_note` | Apply a tag to a note |
| `untag_note` | Remove a tag from a note |

## Available Resources

| Resource | Description |
|----------|-------------|
| `stickyrice://boards` | All boards |
| `stickyrice://board/{id}` | Full board with notes |
| `stickyrice://note/{id}` | Single note details |
| `stickyrice://tags` | All tags |
| `stickyrice://todos` | All incomplete todos |

## Examples

Ask Claude things like:

**Workspaces & Organization:**
- "Create a new workspace called 'Projects'"
- "Show me all my workspaces"
- "Create a new board called 'Q1 Goals' in my Projects workspace"

**Boards & Columns:**
- "Show me all my boards"
- "Create a column called 'In Progress' in my Work board"
- "What's on my Growth Plan board?"

**Notes & Items:**
- "Create a new note in my Ideas column with title 'MCP Integration'"
- "Add a todo item 'Review PR' to my Tasks note"
- "Mark the first todo in my Tasks note as done"
- "Delete the Mobile App note from my Product column"

**Search & Tags:**
- "Search my notes for 'meeting'"
- "Tag my Project note with 'urgent'"

## Manual Authentication

If you prefer not to use browser auth, you can set environment variables:

```json
{
  "mcpServers": {
    "stickyrice": {
      "command": "npx",
      "args": ["-y", "stickyrice-mcp"],
      "env": {
        "CONVEX_URL": "https://glad-dragon-481.convex.cloud",
        "STICKYRICE_API_KEY": "sr_your_api_key"
      }
    }
  }
}
```

Get your API key from Sticky Rice Settings.

## Requirements

- Node.js 18 or higher
- A Sticky Rice account
- Claude Desktop or Claude Code

## License

MIT
