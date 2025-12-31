import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { StickyRiceClient } from "../convex-client.js";

export const calendarTools: Tool[] = [
  {
    name: "get_daily_notes",
    description: "Get notes and reminders for a specific date",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "The date in ISO format (e.g., '2025-01-15')",
        },
        workspaceId: {
          type: "string",
          description: "Filter by workspace ID, 'personal' for personal notes, or 'all' for all workspaces",
        },
      },
      required: ["date"],
    },
  },
  {
    name: "get_weekly_notes",
    description: "Get notes and reminders for a 7-day week, grouped by date",
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "The start date of the week in ISO format (e.g., '2025-01-12')",
        },
        workspaceId: {
          type: "string",
          description: "Filter by workspace ID, 'personal' for personal notes, or 'all' for all workspaces",
        },
      },
      required: ["startDate"],
    },
  },
  {
    name: "get_monthly_reminders",
    description: "Get all notes and item reminders for a specific month",
    inputSchema: {
      type: "object",
      properties: {
        year: {
          type: "number",
          description: "The year (e.g., 2025)",
        },
        month: {
          type: "number",
          description: "The month (1-12)",
        },
        workspaceId: {
          type: "string",
          description: "Filter by workspace ID, 'personal' for personal notes, or 'all' for all workspaces",
        },
      },
      required: ["year", "month"],
    },
  },
];

export async function handleCalendarTool(
  client: StickyRiceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_daily_notes": {
      const date = args.date as string;
      if (!date) throw new Error("date is required");
      const workspaceId = args.workspaceId as string | undefined;
      return client.query("mcp:getNotesForDate", { date, workspaceId });
    }

    case "get_weekly_notes": {
      const startDate = args.startDate as string;
      if (!startDate) throw new Error("startDate is required");
      const workspaceId = args.workspaceId as string | undefined;
      return client.query("mcp:getNotesForWeek", { startDate, workspaceId });
    }

    case "get_monthly_reminders": {
      const year = args.year as number;
      const month = args.month as number;
      if (!year || !month) throw new Error("year and month are required");
      const workspaceId = args.workspaceId as string | undefined;
      return client.query("mcp:getRemindersForMonth", { year, month, workspaceId });
    }

    default:
      throw new Error(`Unknown calendar tool: ${name}`);
  }
}
