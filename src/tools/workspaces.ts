import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const workspaceTools: Tool[] = [
  {
    name: "list_workspaces",
    description: "List all workspaces for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "create_workspace",
    description: "Create a new workspace",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The workspace name",
        },
        order: {
          type: "number",
          description: "Display order (optional, defaults to end of list)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_workspace",
    description: "Update an existing workspace",
    inputSchema: {
      type: "object",
      properties: {
        workspaceId: {
          type: "string",
          description: "The Convex ID of the workspace to update",
        },
        name: {
          type: "string",
          description: "New name for the workspace",
        },
        order: {
          type: "number",
          description: "New display order",
        },
      },
      required: ["workspaceId"],
    },
  },
  {
    name: "delete_workspace",
    description:
      "Delete a workspace. All boards in the workspace will be moved to Personal.",
    inputSchema: {
      type: "object",
      properties: {
        workspaceId: {
          type: "string",
          description: "The Convex ID of the workspace to delete",
        },
      },
      required: ["workspaceId"],
    },
  },
];

export async function handleWorkspaceTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_workspaces": {
      return client.query("mcp:listWorkspaces", {});
    }

    case "create_workspace": {
      const workspaceName = args.name as string;
      if (!workspaceName) throw new Error("name is required");
      const order = args.order as number | undefined;
      return client.mutation("mcp:createWorkspace", { name: workspaceName, order });
    }

    case "update_workspace": {
      const workspaceId = args.workspaceId as string;
      if (!workspaceId) throw new Error("workspaceId is required");
      const name = args.name as string | undefined;
      const order = args.order as number | undefined;
      return client.mutation("mcp:updateWorkspace", { workspaceId, name, order });
    }

    case "delete_workspace": {
      const workspaceId = args.workspaceId as string;
      if (!workspaceId) throw new Error("workspaceId is required");
      return client.mutation("mcp:deleteWorkspace", { workspaceId });
    }

    default:
      throw new Error(`Unknown workspace tool: ${name}`);
  }
}
