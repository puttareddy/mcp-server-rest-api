import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, asTextContent } from "./util";

export function registerUsersTools(server: McpServer) {
  server.tool(
    "users_list",
    { limit: z.number().int().positive().max(100).optional() },
    async ({ limit }) => {
      const data = await fetchJson("/users", { _limit: limit });
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "users_get",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/users/${id}`);
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "users_posts",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/users/${id}/posts`);
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "users_albums",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/users/${id}/albums`);
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "users_todos",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/users/${id}/todos`);
      return { content: asTextContent(data) };
    }
  );
}
