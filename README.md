# JSONPlaceholder MCP Server (Cloudflare Workers)

A remote MCP server exposing tools for the JSONPlaceholder API. Runs with `wrangler dev` and deploys to Cloudflare Workers. Uses the Cloudflare **Agents** runtime + a SQLite-enabled Durable Object.

## Prereqs
- Node.js 18+
- `npm i -g wrangler`
- (Optional) `npm i -g mcp-remote`

## Install
```bash
npm install
```

## Local dev
> If you previously ran dev and changed migrations, clear local state:
```bash
rm -rf .wrangler/state
```

Start:
```bash
npm run dev
# http://127.0.0.1:8789
# Endpoints: /mcp (stream HTTP), /sse (SSE), /debug-do
```

Sanity check the binding:
```bash
curl http://127.0.0.1:8789/debug-do
# MCP_OBJECT present: true
```

## Test with MCP Inspector
This helps you connect with MCP Server and do quick validations
```bash
npx @modelcontextprotocol/inspector@latest
# Open http://localhost:5173, then connect to:
#   http://localhost:8789/sse       (legacy)
# or http://localhost:8789/mcp      (newer transport)
```

## Claude Desktop
Add this to Claude Desktop config (Settings → Developer → Edit Config) and restart Claude:
```json
{
  "mcpServers": {
    "jsonplaceholder": {
      "command": "npx",
      "args": ["mcp-remote", "http://127.0.0.1:8789/sse"]
    }
  }
}
```
Deployed code as follows. You can just connect this worker make it work
```json
{
  "mcpServers": {
    "jsonplaceholder": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-jsonplaceholder.finance-6b9.workers.dev/sse"]
    }
  }
}
```

Inside Claude:
```
/mcp call jsonplaceholder posts_list { "limit": 2 }
/mcp call jsonplaceholder users_get { "id": 1 }
```

## Deploy
```bash
npm run deploy
# Then point Claude's mcp-remote to your /sse URL
```

## Tools
- posts_list, posts_get, posts_comments
- comments_list, comments_get
- albums_list, albums_get, albums_photos
- users_list, users_get, users_posts, users_albums, users_todos
- todos_list, todos_get
```)
