// Note: Using Server instead of McpServer because we need low-level control
// over request handling. McpServer is designed for higher-level patterns where
// you register individual tools/resources. Our implementation manually handles
// ListTools, CallTool, etc. schemas and routes to custom handlers.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StickyRiceClient } from "./convex-client.js";
import { getTools, handleToolCall } from "./tools/index.js";
import { getResources, handleResourceRead } from "./resources/index.js";

export async function createServer(client: StickyRiceClient): Promise<Server> {
  const server = new Server(
    {
      name: "stickyrice",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getTools() };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(client, name, args ?? {});
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: await getResources(client) };
  });

  // Read resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    return handleResourceRead(client, uri);
  });

  return server;
}

export async function runServer(client: StickyRiceClient): Promise<void> {
  const server = await createServer(client);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sticky Rice MCP server running on stdio");
}
