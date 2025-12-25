import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const tagTools: Tool[] = [
  {
    name: "list_tags",
    description: "List all tags for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "create_tag",
    description: "Create a new tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tag name",
        },
        color: {
          type: "string",
          description: "Tag color (hex code or color name)",
        },
      },
      required: ["name", "color"],
    },
  },
  {
    name: "tag_note",
    description: "Apply a tag to a note",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note",
        },
        tagId: {
          type: "string",
          description: "The Convex ID of the tag to apply",
        },
      },
      required: ["noteId", "tagId"],
    },
  },
  {
    name: "untag_note",
    description: "Remove a tag from a note",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "The Convex ID of the note",
        },
        tagId: {
          type: "string",
          description: "The Convex ID of the tag to remove",
        },
      },
      required: ["noteId", "tagId"],
    },
  },
];

export async function handleTagTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_tags": {
      return client.query("mcp:listTags", {});
    }

    case "create_tag": {
      const tagName = args.name as string;
      const color = args.color as string;

      if (!tagName || !color) {
        throw new Error("name and color are required");
      }

      return client.mutation("mcp:createTag", { name: tagName, color });
    }

    case "tag_note": {
      const noteId = args.noteId as string;
      const tagId = args.tagId as string;

      if (!noteId || !tagId) {
        throw new Error("noteId and tagId are required");
      }

      return client.mutation("mcp:tagNote", { noteId, tagId });
    }

    case "untag_note": {
      const noteId = args.noteId as string;
      const tagId = args.tagId as string;

      if (!noteId || !tagId) {
        throw new Error("noteId and tagId are required");
      }

      return client.mutation("mcp:untagNote", { noteId, tagId });
    }

    default:
      throw new Error(`Unknown tag tool: ${name}`);
  }
}
