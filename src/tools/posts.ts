import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, asTextContent } from "./util";

export function registerPostsTools(server: McpServer) {
  server.tool(
    "posts_list",
    {
      userId: z.number().int().positive().optional().describe("Filter by userId"),
      limit: z.number().int().positive().max(100).optional().describe("Max items to return"),
    },
    async ({ userId, limit }) => {
      const data = await fetchJson("/posts", { userId, _limit: limit });
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "posts_get",
    { id: z.number().int().positive().describe("Post id") },
    async ({ id }) => {
      const data = await fetchJson(`/posts/${id}`);
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "posts_comments",
    { id: z.number().int().positive().describe("Post id") },
    async ({ id }) => {
      const data = await fetchJson(`/posts/${id}/comments`);
      return { content: asTextContent(data) };
    }
  );
}
