import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, asTextContent } from "./util";

export function registerAlbumsTools(server: McpServer) {
  server.tool(
    "albums_list",
    {
      userId: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(100).optional()
    },
    async ({ userId, limit }) => {
      const data = await fetchJson("/albums", { userId, _limit: limit });
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "albums_get",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/albums/${id}`);
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "albums_photos",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/albums/${id}/photos`);
      return { content: asTextContent(data) };
    }
  );
}
