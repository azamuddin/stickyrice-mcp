import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const noteItemTools: Tool[] = [
  {
    name: "add_note_item",
    description: "Add a bullet journal item to a note",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note",
        },
        content: {
          type: "string",
          description: "The text content of the item",
        },
        type: {
          type: "string",
          enum: ["todo", "doing", "todo_done", "event", "event_done", "note", "cancelled"],
          description: "Item type (default: note)",
        },
      },
      required: ["noteId", "content"],
    },
  },
  {
    name: "update_note_item",
    description: "Update a note item (change content or status)",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
          description: "The Convex ID of the item",
        },
        content: {
          type: "string",
          description: "New text content",
        },
        type: {
          type: "string",
          enum: ["todo", "doing", "todo_done", "event", "event_done", "note", "cancelled"],
          description: "New item type/status",
        },
      },
      required: ["itemId"],
    },
  },
  {
    name: "delete_note_item",
    description: "Delete a note item",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
          description: "The Convex ID of the item to delete",
        },
      },
      required: ["itemId"],
    },
  },
];

export async function handleNoteItemTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "add_note_item": {
      const noteId = args.noteId as string;
      const content = args.content as string;
      const type = (args.type as string) ?? "note";

      if (!noteId || !content) {
        throw new Error("noteId and content are required");
      }

      return client.mutation("mcp:createNoteItem", {
        noteId,
        content,
        type,
      });
    }

    case "update_note_item": {
      const itemId = args.itemId as string;
      if (!itemId) throw new Error("itemId is required");

      const updates: Record<string, unknown> = { itemId };
      if (args.content !== undefined) updates.content = args.content;
      if (args.type !== undefined) updates.type = args.type;

      return client.mutation("mcp:updateNoteItem", updates);
    }

    case "delete_note_item": {
      const itemId = args.itemId as string;
      if (!itemId) throw new Error("itemId is required");

      return client.mutation("mcp:deleteNoteItem", { itemId });
    }

    default:
      throw new Error(`Unknown note item tool: ${name}`);
  }
}
