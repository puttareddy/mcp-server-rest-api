import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, asTextContent } from "./util";

export function registerTodosTools(server: McpServer) {
  server.tool(
    "todos_list",
    {
      userId: z.number().int().positive().optional(),
      completed: z.boolean().optional(),
      limit: z.number().int().positive().max(200).optional()
    },
    async ({ userId, completed, limit }) => {
      const data = await fetchJson("/todos", { userId, completed, _limit: limit });
      return { content: asTextContent(data) };
    }
  );

  server.tool(
    "todos_get",
    { id: z.number().int().positive() },
    async ({ id }) => {
      const data = await fetchJson(`/todos/${id}`);
      return { content: asTextContent(data) };
    }
  );
}
