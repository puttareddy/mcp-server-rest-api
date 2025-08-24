// worker-configuration.manual.d.ts (optional, kept separate from Wrangler-generated file)
import type { DurableObjectNamespace } from '@cloudflare/workers-types';

export {};

declare global {
  declare class JsonPlaceholderMCP {} // for typed binding if desired
  interface Env {
    MCP_OBJECT: DurableObjectNamespace<JsonPlaceholderMCP>;
  }
}
