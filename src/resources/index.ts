import type { Resource } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export async function getResources(client: StickyRiceClient): Promise<Resource[]> {
  const resources: Resource[] = [
    {
      uri: "stickyrice://boards",
      name: "All Boards",
      description: "List of all user's boards",
      mimeType: "application/json",
    },
    {
      uri: "stickyrice://tags",
      name: "All Tags",
      description: "User's tag library",
      mimeType: "application/json",
    },
    {
      uri: "stickyrice://todos",
      name: "All Todos",
      description: "All incomplete todo and doing items across all notes",
      mimeType: "application/json",
    },
  ];

  // Add dynamic board resources
  try {
    const boards = await client.query<Array<{ id: string; title: string }>>(
      "mcp:listBoards",
      {}
    );

    for (const board of boards) {
      resources.push({
        uri: `stickyrice://board/${board.id}`,
        name: board.title,
        description: `Board: ${board.title}`,
        mimeType: "application/json",
      });
    }
  } catch {
    // If we can't fetch boards, just return static resources
  }

  return resources;
}

export async function handleResourceRead(
  client: StickyRiceClient,
  uri: string
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  const url = new URL(uri);
  const path = url.pathname.replace(/^\/\//, "");

  let data: unknown;

  if (uri === "stickyrice://boards") {
    data = await client.query("mcp:listBoards", {});
  } else if (uri === "stickyrice://tags") {
    data = await client.query("mcp:listTags", {});
  } else if (uri === "stickyrice://todos") {
    data = await client.query("mcp:listTodos", {});
  } else if (path.startsWith("board/")) {
    const boardId = path.replace("board/", "");
    data = await client.query("mcp:getFullBoard", { boardId });
  } else if (path.startsWith("note/")) {
    const noteId = path.replace("note/", "");
    data = await client.query("mcp:getNote", { noteId });
  } else {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}
