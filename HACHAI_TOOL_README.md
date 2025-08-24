# Hachiai API Tools

This MCP server now includes tools for interacting with the Hachiai API, including trace retrieval and document QnA processing.

## Tool 1: `hachiai_trace_get`

### Description
Retrieves trace information from the Hachiai API using a trace ID.

### Parameters
- `trace_id` (string, required): The trace ID to retrieve
- `api_key` (string, required): Your Hachiai API key for authentication

### Usage Example
```typescript
// Example tool call
{
  "name": "hachiai_trace_get",
  "arguments": {
    "trace_id": "your-trace-id-here",
    "api_key": "your-api-key-here"
  }
}
```

### API Endpoint
The tool makes a GET request to:
```
https://docx.hachiai.com/slm/v1/trace_id/{trace_id}
```

### Headers
- `apiKey`: Your provided API key
- `Accept`: application/json
- `User-Agent`: MCP-Server/1.0

## Tool 2: `hachiai_document_qna`

### Description
Processes documents through Hachiai's QnA API to extract specific information using natural language queries.

### Parameters
- `api_key` (string, required): Bearer token for Hachiai authentication
- `file_content` (string, required): File content (can be base64 encoded or raw content)
- `file_name` (string, required): Name of the file (e.g., 'document.pdf')
- `query` (string, required): JSON query string for document analysis

### Usage Example
```typescript
// Example tool call
{
  "name": "hachiai_document_qna",
  "arguments": {
    "api_key": "20EbiWCqM8R8Cf8ioCwCjF89MmBrQVBJ5kYjR6ACMeSm",
    "file_content": "base64-encoded-pdf-content-or-raw-content",
    "file_name": "Frontier Airlines tickets.pdf",
    "query": "{\"Queries\":[{\"Text\":\"Extract the passenger name from the document.\",\"Alias\":\"passenger_name\",\"Key\":\"passenger_name\",\"IsRequired\":true,\"Type\":\"string\"}]}"
  }
}
```

### API Endpoint
The tool makes a POST request to:
```
https://docx.hachiai.com/slm/v1/llm/qna/async
```

### Headers
- `Authorization`: Bearer {your-api-key}
- `Accept`: application/json, text/plain, */*
- `User-Agent`: MCP-Server/1.0
- `Content-Type`: multipart/form-data (automatically set)

### Request Body
- `files`: The document file (PDF, etc.)
- `query`: JSON string defining the extraction queries

### Query Format
The query parameter should be a JSON string with the following structure:
```json
{
  "Queries": [
    {
      "Text": "Extract the passenger name from the document.",
      "Alias": "passenger_name",
      "Key": "passenger_name",
      "IsRequired": true,
      "Type": "string"
    }
  ]
}
```

## Error Handling
Both tools include comprehensive error handling:
- Network errors
- API authentication errors
- Invalid responses
- Detailed error messages for debugging

## Security Notes
- API keys are passed as parameters and should be handled securely
- Consider using environment variables in production deployments
- Both tools validate input parameters using Zod schema validation
- The document QnA tool handles file uploads securely

## Integration
Both tools are automatically registered when the MCP server starts and are available alongside all existing JSONPlaceholder tools.

## Testing
You can test the tools using any MCP client (like Claude Desktop):

**For trace retrieval:**
```
hachiai_trace_get(trace_id="test-123", api_key="your-key")
```

**For document QnA:**
```
hachiai_document_qna(api_key="your-bearer-token", file_content="file-content", file_name="document.pdf", query="{\"Queries\":[{\"Text\":\"Extract passenger name\",\"Alias\":\"passenger_name\",\"Key\":\"passenger_name\",\"IsRequired\":true,\"Type\":\"string\"}]}")
``` 