# AOAI Dalle3 MCP Server

An Azure OpenAI DALL-E integration server implementing the Model Context Protocol (MCP). This server provides a bridge between Azure OpenAI's DALL-E 3 image generation capabilities and MCP-compatible clients.

## Available Tools

### `generate_image`
Generates images using DALL-E 3 with the following parameters:
- `prompt` (required): Text description of the image to generate
- - `size` (optional): Image dimensions (default: 1024x1024). Available options:
  - `1024x1024`
  - `1792x1024`
  - `1024x1792`
- `quality` (optional): Image quality (default: hd). Available options:
  - `standard`
  - `hd`
- `style` (optional): Image style (default: natural). Available options:
  - `vivid`
  - `natural`

### `download_image`
Downloads generated images to local storage:
- `imageUrl` (required): URL of the image to download
- `localPath` (required): Local directory path for saving
- `fileName` (required): Name for the downloaded file

## Environment Variables

The following environment variables must be set to configure the server:

- `AZURE_OPENAI_ENDPOINT`: The endpoint URL for your Azure OpenAI resource. You can find this in the Azure portal under your OpenAI resource's "Keys and Endpoint" section.
- `AZURE_OPENAI_API_KEY`: The API key for your Azure OpenAI resource. This is also available in the "Keys and Endpoint" section.
- `AZURE_OPENAI_DEPLOYMENT_NAME` (optional, default: "dalle3"): The name of the DALL-E 3 deployment in your Azure OpenAI resource.
- `OPENAI_API_VERSION` (optional, default: "2024-02-15-preview"): The API version to use. Ensure this matches the version supported by your Azure OpenAI resource.

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
                    "./build/index.js"
                ],
                "env": {
                    "AZURE_OPENAI_ENDPOINT": "<endpoint>",
                    "AZURE_OPENAI_API_KEY": "<key>",
                    "AZURE_OPENAI_DEPLOYMENT_NAME": "<deployment>"
                }
            }
}
```

