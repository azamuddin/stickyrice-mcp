import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";
import { workspaceTools, handleWorkspaceTool } from "./workspaces.js";
import { boardTools, handleBoardTool } from "./boards.js";
import { columnTools, handleColumnTool } from "./columns.js";
import { noteTools, handleNoteTool } from "./notes.js";
import { noteItemTools, handleNoteItemTool } from "./note-items.js";
import { tagTools, handleTagTool } from "./tags.js";

export function getTools(): Tool[] {
  return [
    ...workspaceTools,
    ...boardTools,
    ...columnTools,
    ...noteTools,
    ...noteItemTools,
    ...tagTools,
  ];
}

export async function handleToolCall(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  try {
    let result: unknown;

    // Route to appropriate handler
    if (name.includes("workspace")) {
      result = await handleWorkspaceTool(client, name, args);
    } else if (
      name.includes("board") ||
      name === "search_notes"
    ) {
      result = await handleBoardTool(client, name, args);
    } else if (name.includes("column")) {
      result = await handleColumnTool(client, name, args);
    } else if (
      name.includes("note") &&
      !name.includes("note_item")
    ) {
      result = await handleNoteTool(client, name, args);
    } else if (name.includes("note_item")) {
      result = await handleNoteItemTool(client, name, args);
    } else if (name.includes("tag")) {
      result = await handleTagTool(client, name, args);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
    };
  }
}
