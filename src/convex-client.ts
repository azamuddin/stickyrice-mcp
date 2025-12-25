interface ConvexClientConfig {
  url: string;
  apiKey: string;
}

export class StickyRiceClient {
  private convexUrl: string;
  private apiKey: string;
  private userId: string | null = null;
  private httpUrl: string;

  constructor(config: ConvexClientConfig) {
    this.convexUrl = config.url;
    this.apiKey = config.apiKey;
    // Convert deployment URL to HTTP URL
    // e.g., https://xxx.convex.cloud -> https://xxx.convex.site
    this.httpUrl = config.url.replace(".convex.cloud", ".convex.site");
  }

  async authenticate(): Promise<string> {
    const response = await fetch(`${this.httpUrl}/mcp/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as { error: string };
      throw new Error(`Authentication failed: ${error.error}`);
    }

    const data = (await response.json()) as { userId: string };
    this.userId = data.userId;
    return this.userId;
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error("Not authenticated. Call authenticate() first.");
    }
    return this.userId;
  }

  // Call a Convex query function via HTTP Action proxy
  async query<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(`${this.httpUrl}/mcp/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({ fn, args }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Query failed: ${error}`);
    }

    const data = (await response.json()) as { value: T };
    return data.value;
  }

  // Call a Convex mutation function via HTTP Action proxy
  async mutation<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(`${this.httpUrl}/mcp/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({ fn, args }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mutation failed: ${error}`);
    }

    const data = (await response.json()) as { value: T };
    return data.value;
  }
}

export function createClient(convexUrl: string, apiKey: string): StickyRiceClient {
  return new StickyRiceClient({ url: convexUrl, apiKey });
}
