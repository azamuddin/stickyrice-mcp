import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const columnTools: Tool[] = [
  {
    name: "create_column",
    description: "Create a new column in a board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The Convex ID of the board",
        },
        title: {
          type: "string",
          description: "The column title",
        },
        order: {
          type: "number",
          description: "Display order (optional, defaults to end of list)",
        },
      },
      required: ["boardId", "title"],
    },
  },
  {
    name: "update_column",
    description: "Update an existing column",
    inputSchema: {
      type: "object",
      properties: {
        columnId: {
          type: "string",
          description: "The Convex ID of the column to update",
        },
        title: {
          type: "string",
          description: "New title for the column",
        },
        order: {
          type: "number",
          description: "New display order",
        },
        boardId: {
          type: "string",
          description: "Move column to a different board",
        },
      },
      required: ["columnId"],
    },
  },
  {
    name: "delete_column",
    description:
      "Delete a column and all its notes and items. This cannot be undone.",
    inputSchema: {
      type: "object",
      properties: {
        columnId: {
          type: "string",
          description: "The Convex ID of the column to delete",
        },
      },
      required: ["columnId"],
    },
  },
];

export async function handleColumnTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "create_column": {
      const boardId = args.boardId as string;
      if (!boardId) throw new Error("boardId is required");
      const title = args.title as string;
      if (!title) throw new Error("title is required");
      const order = args.order as number | undefined;
      return client.mutation("mcp:createColumn", { boardId, title, order });
    }

    case "update_column": {
      const columnId = args.columnId as string;
      if (!columnId) throw new Error("columnId is required");
      const title = args.title as string | undefined;
      const order = args.order as number | undefined;
      const boardId = args.boardId as string | undefined;
      return client.mutation("mcp:updateColumn", {
        columnId,
        title,
        order,
        boardId,
      });
    }

    case "delete_column": {
      const columnId = args.columnId as string;
      if (!columnId) throw new Error("columnId is required");
      return client.mutation("mcp:deleteColumn", { columnId });
    }

    default:
      throw new Error(`Unknown column tool: ${name}`);
  }
}
