import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAllTools } from "./tools/index";

// Durable Object class used by the Agents runtime
export class JsonPlaceholderMCP extends McpAgent {
  server = new McpServer({
    name: "JSONPlaceholder Tools",
    version: "1.0.2",
  });

  async init() {
    // Register REST tools for JSONPlaceholder
    registerAllTools(this.server);
    // NOTE: Some SDK versions do not expose setRequestHandler.
    // If you want to advertise empty resources/prompts, implement via server.request(...) in a future update.
  }
}

// Normalize paths to avoid trailing-slash 404s
function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

// Worker fetch handler exposing both transports
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const path = normalizePath(url.pathname);

    // SSE transport (commonly used with `mcp-remote`)
    if (path === "/sse" || path === "/sse/message") {
      return JsonPlaceholderMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    // Streamable HTTP transport
    if (path === "/mcp") {
      return JsonPlaceholderMCP.serve("/mcp").fetch(request, env, ctx);
    }

    if (path === "/debug-do") {
      // @ts-ignore env type augments at runtime
      const hasBinding = !!env.MCP_OBJECT;
      return new Response(`MCP_OBJECT present: ${hasBinding}`, { status: 200 });
    }

    if (path === "/") {
      return new Response(
        "JSONPlaceholder MCP server. Endpoints: /mcp (stream HTTP), /sse (SSE).",
        { status: 200 },
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
