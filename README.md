# Azure Dalle MCP Server

An Azure OpenAI DALL-E integration server implementing the Model Context Protocol (MCP). This server provides a bridge between Azure OpenAI's DALL-E 3 image generation capabilities and MCP-compatible clients.

## Available Tools

#### `generate_image`
Generates images using DALL-E 3 with the following parameters:
- `prompt` (required): Text description of the image to generate
- `size` (optional): Image dimensions (default: 1024x1024)
- `quality` (optional): Image quality (default: hd)
- `style` (optional): Image style (default: natural)

#### `download_image`
Downloads generated images to local storage:
- `imageUrl`: URL of the image to download
- `localPath`: Local directory path for saving
- `fileName`: Name for the downloaded file

## Setup

### Prerequisites
- Node.js
- Azure OpenAI subscription with DALL-E 3 access
- Environment variables:
  - AZURE_OPENAI_ENDPOINT
  - AZURE_OPENAI_API_KEY
  - AZURE_OPENAI_DEPLOYMENT_NAME (defaults to "dalle3")
  - OPENAI_API_VERSION (defaults to "2024-02-15-preview")

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

3. For development with auto-rebuild:
```bash
npm run watch
```

## Configuration

### MCP Client Configuration

To use with MCP-compatible clients, add the server configuration:

On MacOS:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

On Windows:
```bash
%APPDATA%/Claude/claude_desktop_config.json
```

Configuration content:
```json
{
  "mcpServers": {
    "Azure Dalle MCP Server": {
      "command": "/path/to/Azure Dalle MCP Server/build/index.js"
    }
  }
}
```

### Debugging

For debugging support, the MCP Inspector tool is included:

```bash
npm run inspector
```

This will provide a web interface for monitoring server communication and debugging tool executions.
