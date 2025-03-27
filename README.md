# AOAI Dalle3 MCP Server

An Azure OpenAI DALL-E integration server implementing the Model Context Protocol (MCP). This server provides a bridge between Azure OpenAI's DALL-E 3 image generation capabilities and MCP-compatible clients.

## Available Tools

### `generate_image`
Generates images using DALL-E 3 with the following parameters:
- `prompt` (required): Text description of the image to generate
- `size` (optional): Image dimensions (default: 1024x1024)
- `quality` (optional): Image quality (default: hd)
- `style` (optional): Image style (default: natural)

### `download_image`
Downloads generated images to local storage:
- `imageUrl` (required): URL of the image to download
- `localPath` (required): Local directory path for saving
- `fileName` (required): Name for the downloaded file

## Environment Variables
  - AZURE_OPENAI_ENDPOINT
  - AZURE_OPENAI_API_KEY
  - AZURE_OPENAI_DEPLOYMENT_NAME (defaults to "dalle3")
  - OPENAI_API_VERSION (defaults to "2024-02-15-preview")

## Build

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

## MCP Client Configuration

```json
{
  "dalle3": {
                "command": "node",
                "args": [
                    ".\build\index.js"
                ],
                "env": {
                    "AZURE_OPENAI_ENDPOINT": "<endpoint>",
                    "AZURE_OPENAI_API_KEY": "<key>",
                    "AZURE_OPENAI_DEPLOYMENT_NAME": "<deployment>"
                }
            }
}
```

