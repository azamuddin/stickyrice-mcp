import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const boardTools: Tool[] = [
  {
    name: "list_boards",
    description: "List all boards for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_board",
    description:
      "Get a board with all its columns, notes, and items. Returns the full board structure.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The Convex ID of the board",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "create_board",
    description: "Create a new board",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The board title",
        },
        order: {
          type: "number",
          description: "Display order (optional, defaults to end of list)",
        },
        workspaceId: {
          type: "string",
          description:
            "The workspace ID to create the board in (optional, defaults to Personal)",
        },
        type: {
          type: "string",
          enum: ["simple", "kanban"],
          description: "Board type: 'simple' for chronological list, 'kanban' for column-based (default: kanban)",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "update_board",
    description: "Update an existing board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The Convex ID of the board to update",
        },
        title: {
          type: "string",
          description: "New title for the board",
        },
        order: {
          type: "number",
          description: "New display order",
        },
        workspaceId: {
          type: "string",
          description:
            "Move board to workspace (use null to move to Personal)",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "delete_board",
    description:
      "Delete a board and all its columns, notes, and items. This cannot be undone.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The Convex ID of the board to delete",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "search_notes",
    description: "Search notes by keyword across all boards",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (searches in note titles and item content)",
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 20)",
        },
      },
      required: ["query"],
    },
  },
];

export async function handleBoardTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_boards": {
      return client.query("mcp:listBoards", {});
    }

    case "get_board": {
      const boardId = args.boardId as string;
      if (!boardId) throw new Error("boardId is required");
      return client.query("mcp:getFullBoard", { boardId });
    }

    case "create_board": {
      const title = args.title as string;
      if (!title) throw new Error("title is required");
      const order = args.order as number | undefined;
      const workspaceId = args.workspaceId as string | undefined;
      const type = args.type as "simple" | "kanban" | undefined;
      return client.mutation("mcp:createBoard", { title, order, workspaceId, type });
    }

    case "update_board": {
      const boardId = args.boardId as string;
      if (!boardId) throw new Error("boardId is required");
      const title = args.title as string | undefined;
      const order = args.order as number | undefined;
      const workspaceId = args.workspaceId as string | null | undefined;
      return client.mutation("mcp:updateBoard", {
        boardId,
        title,
        order,
        workspaceId,
      });
    }

    case "delete_board": {
      const boardId = args.boardId as string;
      if (!boardId) throw new Error("boardId is required");
      return client.mutation("mcp:deleteBoard", { boardId });
    }

    case "search_notes": {
      const query = args.query as string;
      if (!query) throw new Error("query is required");
      const limit = (args.limit as number) ?? 20;
      return client.query("mcp:searchNotes", { query, limit });
    }

    default:
      throw new Error(`Unknown board tool: ${name}`);
  }
}
