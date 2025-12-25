#!/usr/bin/env node
import { createClient } from "./convex-client.js";
import { runServer } from "./server.js";
import { readConfig, DEFAULT_CONVEX_URL } from "./config.js";
import { authenticate, logout, status } from "./auth.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Handle CLI commands
  if (command === "auth" || command === "login") {
    await authenticate();
    return;
  }

  if (command === "logout") {
    await logout();
    return;
  }

  if (command === "status") {
    await status();
    return;
  }

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(`
stickyrice-mcp - MCP server for Sticky Rice

Commands:
  auth      Authenticate with Sticky Rice (opens browser)
  logout    Remove saved credentials
  status    Show current authentication status
  help      Show this help message

Running without arguments starts the MCP server.

Environment Variables (optional if authenticated via 'auth'):
  CONVEX_URL            Convex deployment URL
  STICKYRICE_API_KEY    API key for authentication
`);
    return;
  }

  // Start MCP server
  // Try environment variables first, then saved config
  let convexUrl = process.env.CONVEX_URL;
  let apiKey = process.env.STICKYRICE_API_KEY;

  if (!apiKey) {
    const config = readConfig();
    if (config) {
      apiKey = config.apiKey;
      convexUrl = config.convexUrl;
    }
  }

  if (!convexUrl) {
    convexUrl = DEFAULT_CONVEX_URL;
  }

  if (!apiKey) {
    console.error("Not authenticated.");
    console.error("");
    console.error("Run 'npx stickyrice-mcp auth' to authenticate, or set:");
    console.error("  STICKYRICE_API_KEY environment variable");
    process.exit(1);
  }

  const client = createClient(convexUrl, apiKey);

  try {
    console.error("Authenticating with Sticky Rice...");
    await client.authenticate();
    console.error("Authentication successful");
  } catch (error) {
    console.error("Authentication failed:", error);
    console.error("");
    console.error("Try running 'npx stickyrice-mcp auth' to re-authenticate.");
    process.exit(1);
  }

  await runServer(client);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
