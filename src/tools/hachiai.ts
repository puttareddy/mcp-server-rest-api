import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { asTextContent } from "./util";

async function fetchHachiaiJson(
  path: string,
  apiKey: string
) {
  const url = `https://docx.hachiai.com/slm/v1${path}`;
  const res = await fetch(url, { 
    method: "GET",
    headers: {
      "apiKey": apiKey,
      "Accept": "application/json",
      "User-Agent": "MCP-Server/1.0"
    }
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Hachiai API ${url} responded ${res.status}: ${res.statusText}. Details: ${errorText}`);
  }
  
  return res.json();
}

async function postHachiaiQnA(
  apiKey: string,
  fileContent: string,
  fileName: string,
  query: string
) {
  const url = `https://docx.hachiai.com/slm/v1/llm/qna/async`;
  
  // Create FormData for multipart/form-data
  const formData = new FormData();
  
  // Add the file
  const fileBlob = new Blob([fileContent], { type: 'application/pdf' });
  formData.append('files', fileBlob, fileName);
  
  // Add the query
  formData.append('query', query);
  
  const res = await fetch(url, { 
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json, text/plain, */*",
      "User-Agent": "MCP-Server/1.0"
    },
    body: formData
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Hachiai QnA API ${url} responded ${res.status}: ${res.statusText}. Details: ${errorText}`);
  }
  
  return res.json();
}

export function registerHachiaiTools(server: McpServer) {
  server.tool(
    "hachiai_trace_get",
    {
      trace_id: z.string().describe("Trace ID to retrieve from Hachiai API"),
      api_key: z.string().describe("API key for Hachiai authentication")
    },
    async ({ trace_id, api_key }) => {
      try {
        const data = await fetchHachiaiJson(`/trace_id/${trace_id}`, api_key);
        return { content: asTextContent(data) };
      } catch (error) {
        return { 
          content: [{ 
            type: "text", 
            text: `Error retrieving trace ID ${trace_id}: ${error instanceof Error ? error.message : String(error)}` 
          }] 
        };
      }
    }
  );

  server.tool(
    "hachiai_document_qna",
    {
      api_key: z.string().describe("Bearer token for Hachiai authentication"),
      file_content: z.string().describe("Base64 encoded file content or raw file content"),
      file_name: z.string().describe("Name of the file (e.g., 'document.pdf')"),
      query: z.string().describe("JSON query string for document analysis (e.g., '{\"Queries\":[{\"Text\":\"Extract passenger name\",\"Alias\":\"passenger_name\",\"Key\":\"passenger_name\",\"IsRequired\":true,\"Type\":\"string\"}]}')")
    },
    async ({ api_key, file_content, file_name, query }) => {
      try {
        const data = await postHachiaiQnA(api_key, file_content, file_name, query);
        
        // The Hachiai API response should already contain the trace_id
        // Just return the response as-is, the agent will extract the trace_id from it
        return { content: asTextContent(data) };
      } catch (error) {
        return { 
          content: [{ 
            type: "text", 
            text: `Error processing document QnA: ${error instanceof Error ? error.message : String(error)}` 
          }] 
        };
      }
    }
  );
} 