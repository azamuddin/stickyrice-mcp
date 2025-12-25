import { writeConfig, DEFAULT_CONVEX_URL, readConfig, deleteConfig, getConfigPath } from "./config.js";

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_TIME = 10 * 60 * 1000; // 10 minutes

interface DeviceCodeResponse {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  expiresIn: number;
}

interface TokenResponse {
  status: "authorization_pending" | "approved";
  apiKey?: string;
  error?: string;
}

async function requestDeviceCode(httpUrl: string): Promise<DeviceCodeResponse> {
  const response = await fetch(`${httpUrl}/mcp/device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to request device code");
  }

  return response.json() as Promise<DeviceCodeResponse>;
}

async function pollForToken(httpUrl: string, userCode: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME) {
    const response = await fetch(`${httpUrl}/mcp/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userCode }),
    });

    const data = (await response.json()) as TokenResponse;

    if (data.status === "approved" && data.apiKey) {
      return data.apiKey;
    }

    if (data.error && data.error !== "authorization_pending") {
      throw new Error(data.error);
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error("Authorization timed out");
}

async function openBrowser(url: string): Promise<void> {
  const { platform } = process;

  let command: string;
  if (platform === "darwin") {
    command = "open";
  } else if (platform === "win32") {
    command = "start";
  } else {
    command = "xdg-open";
  }

  const { exec } = await import("child_process");
  exec(`${command} "${url}"`);
}

export async function authenticate(): Promise<void> {
  const convexUrl = DEFAULT_CONVEX_URL;
  const httpUrl = convexUrl.replace(".convex.cloud", ".convex.site");

  console.log("Authenticating with Sticky Rice...\n");

  // Request device code
  const { deviceCode, userCode, verificationUri } = await requestDeviceCode(httpUrl);

  console.log("Open this URL in your browser:\n");
  console.log(`  ${verificationUri}\n`);
  console.log(`Verify this code matches: ${deviceCode}\n`);

  // Try to open browser automatically
  try {
    await openBrowser(verificationUri);
  } catch {
    // Ignore if browser fails to open
  }

  console.log("Waiting for authorization...");

  // Poll for token
  try {
    const apiKey = await pollForToken(httpUrl, userCode);

    // Save config
    writeConfig({
      apiKey,
      convexUrl,
    });

    console.log("\n✓ Authenticated successfully!");
    console.log(`\nConfig saved to: ${getConfigPath()}`);
    console.log("\nYou can now configure Claude with:\n");
    console.log(
      JSON.stringify(
        {
          mcpServers: {
            stickyrice: {
              command: "npx",
              args: ["-y", "stickyrice-mcp"],
            },
          },
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("\n✗ Authentication failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export async function logout(): Promise<void> {
  const config = readConfig();
  if (!config) {
    console.log("Not currently authenticated.");
    return;
  }

  deleteConfig();
  console.log("Logged out successfully.");
}

export async function status(): Promise<void> {
  const config = readConfig();
  if (!config) {
    console.log("Not authenticated.");
    console.log("\nRun 'stickyrice-mcp auth' to authenticate.");
    return;
  }

  console.log("✓ Authenticated");
  console.log(`Config: ${getConfigPath()}`);
  console.log(`API Key: ${config.apiKey.substring(0, 10)}...`);
}
