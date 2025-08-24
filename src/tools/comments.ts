import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, asTextContent } from "./util";

export function registerCommentsTools(server: McpServer) {
  server.tool(
    "comments_list",
    {
      postId: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(100).optional()
    },
    async ({ postId, limit }) => {
      const data = await fetchJson("/comments", { postId, _limit: limit });
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "comments_get",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/comments/${id}`);
      return { content: asTextContent(data) };
    }
  );
}
