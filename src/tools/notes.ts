import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const noteTools: Tool[] = [
  {
    name: "create_note",
    description: "Create a new note in a column",
    inputSchema: {
      type: "object",
      properties: {
        columnId: {
          type: "string",
          description: "The Convex ID of the column to add the note to",
        },
        title: {
          type: "string",
          description: "The note title/content",
        },
        color: {
          type: "string",
          enum: ["yellow", "blue", "green", "pink", "purple", "orange", "gray"],
          description: "Note background color",
        },
        type: {
          type: "string",
          enum: ["standard", "big_text"],
          description: "Note type (default: standard)",
        },
        titleSize: {
          type: "string",
          enum: ["normal", "biggest"],
          description: "Title size for standard notes (default: normal)",
        },
        link: {
          type: "string",
          description: "URL to attach to the note",
        },
        linkLabel: {
          type: "string",
          description: "Display label for the link",
        },
        bigtext_config: {
          type: "object",
          description: "Configuration for big_text notes",
          properties: {
            textAlign: {
              type: "string",
              enum: ["left", "center", "right"],
              description: "Text alignment",
            },
            bold: {
              type: "boolean",
              description: "Bold text",
            },
            italic: {
              type: "boolean",
              description: "Italic text",
            },
            underline: {
              type: "boolean",
              description: "Underlined text",
            },
          },
        },
      },
      required: ["columnId", "title", "color"],
    },
  },
  {
    name: "update_note",
    description: "Update an existing note",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note to update",
        },
        title: {
          type: "string",
          description: "New title/content",
        },
        color: {
          type: "string",
          enum: ["yellow", "blue", "green", "pink", "purple", "orange", "gray"],
        },
        columnId: {
          type: "string",
          description: "Move note to a different column",
        },
        type: {
          type: "string",
          enum: ["standard", "big_text"],
          description: "Note type",
        },
        titleSize: {
          type: "string",
          enum: ["normal", "biggest"],
          description: "Title size for standard notes",
        },
        link: {
          type: "string",
          description: "URL to attach to the note",
        },
        linkLabel: {
          type: "string",
          description: "Display label for the link",
        },
        bigtext_config: {
          type: "object",
          description: "Configuration for big_text notes",
          properties: {
            textAlign: {
              type: "string",
              enum: ["left", "center", "right"],
              description: "Text alignment",
            },
            bold: {
              type: "boolean",
              description: "Bold text",
            },
            italic: {
              type: "boolean",
              description: "Italic text",
            },
            underline: {
              type: "boolean",
              description: "Underlined text",
            },
          },
        },
      },
      required: ["noteId"],
    },
  },
  {
    name: "delete_note",
    description: "Delete a note and all its items",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note to delete",
        },
      },
      required: ["noteId"],
    },
  },
  {
    name: "get_note",
    description: "Get a single note with all its items and tags",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note",
        },
      },
      required: ["noteId"],
    },
  },
];

export async function handleNoteTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "create_note": {
      const columnId = args.columnId as string;
      const title = args.title as string;
      const color = args.color as string;
      const type = (args.type as string) ?? "standard";

      if (!columnId || !title || !color) {
        throw new Error("columnId, title, and color are required");
      }

      const createArgs: Record<string, unknown> = {
        columnId,
        title,
        color,
        type,
      };
      if (args.titleSize !== undefined) createArgs.titleSize = args.titleSize;
      if (args.link !== undefined) createArgs.link = args.link;
      if (args.linkLabel !== undefined) createArgs.linkLabel = args.linkLabel;
      if (args.bigtext_config !== undefined) createArgs.bigtext_config = args.bigtext_config;

      return client.mutation("mcp:createNote", createArgs);
    }

    case "update_note": {
      const noteId = args.noteId as string;
      if (!noteId) throw new Error("noteId is required");

      const updates: Record<string, unknown> = { noteId };
      if (args.title !== undefined) updates.title = args.title;
      if (args.color !== undefined) updates.color = args.color;
      if (args.columnId !== undefined) updates.columnId = args.columnId;
      if (args.type !== undefined) updates.type = args.type;
      if (args.titleSize !== undefined) updates.titleSize = args.titleSize;
      if (args.link !== undefined) updates.link = args.link;
      if (args.linkLabel !== undefined) updates.linkLabel = args.linkLabel;
      if (args.bigtext_config !== undefined) updates.bigtext_config = args.bigtext_config;

      return client.mutation("mcp:updateNote", updates);
    }

    case "delete_note": {
      const noteId = args.noteId as string;
      if (!noteId) throw new Error("noteId is required");

      return client.mutation("mcp:deleteNote", { noteId });
    }

    case "get_note": {
      const noteId = args.noteId as string;
      if (!noteId) throw new Error("noteId is required");

      return client.query("mcp:getNote", { noteId });
    }

    default:
      throw new Error(`Unknown note tool: ${name}`);
  }
}
