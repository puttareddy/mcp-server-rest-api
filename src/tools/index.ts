import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerPostsTools } from "./posts";
import { registerCommentsTools } from "./comments";
import { registerAlbumsTools } from "./albums";
import { registerUsersTools } from "./users";
import { registerTodosTools } from "./todos";
import { registerHachiaiTools } from "./hachiai";

export function registerAllTools(server: McpServer) {
  registerPostsTools(server);
  registerCommentsTools(server);
  registerAlbumsTools(server);
  registerUsersTools(server);
  registerTodosTools(server);
  registerHachiaiTools(server);
}
