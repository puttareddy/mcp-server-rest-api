// worker-configuration.d.ts (generated stub for local TS typing)
import type { DurableObjectNamespace } from '@cloudflare/workers-types';

export {};

declare global {
  interface Env {
    /** Durable Object namespace used by the MCP server */
    MCP_OBJECT: DurableObjectNamespace;
  }
}
