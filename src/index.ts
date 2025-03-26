import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { AzureOpenAI } from "openai";
import { console } from "inspector";
import { ImageService } from "./services/ImageService.js";

// Azure OpenAI Configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
const apiVersion = process.env.OPENAI_API_VERSION || "2024-02-15-preview";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "dalle3";

if (!endpoint || !apiKey) {
    throw new Error('Missing Azure OpenAI configuration');
}

const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion
});

// Create service instances
const imageService = new ImageService(client, deploymentName);

const GenerateImageSchema = z.object({
    prompt: z.string(),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
    quality: z.enum(['standard', 'hd']).default('hd'),
    style: z.enum(['vivid', 'natural']).default('natural'),
});

const DownloadImageSchema = z.object({
    imageUrl: z.string().url(),
    localPath: z.string(),
    fileName: z.string(),
});

// Create server instance
const server = new Server(
    {
        name: "dalle-mcp",
        version: "1.0.0"
    },
    {
        capabilities: {
            tools: {
                execution: true
            }
        }
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "generate_image",
                description: "Generate an image using DALL-E 3",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "The prompt to generate image from",
                        },
                        size: {
                            type: "string",
                            enum: ["1024x1024", "1792x1024", "1024x1792"],
                            description: "The size of the generated image",
                        },
                        quality: {
                            type: "string",
                            enum: ["standard", "hd"],
                            description: "The quality of the generated image",
                        },
                        style: {
                            type: "string",
                            enum: ["vivid", "natural"],
                            description: "The style of the generated image",
                        },
                    },
                    required: ["prompt"],
                },
            },
            {
                name: "download_image",
                description: "Download an image from a URL to a local path",
                inputSchema: {
                    type: "object",
                    properties: {
                        imageUrl: {
                            type: "string",
                            description: "URL of the image to download",
                        },
                        localPath: {
                            type: "string",
                            description: "Local directory path to save the image",
                        },
                        fileName: {
                            type: "string",
                            description: "Name for the downloaded file",
                        },
                    },
                    required: ["imageUrl", "localPath", "fileName"],
                },
            },
        ],
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        if (name === "generate_image") {
            const { prompt, size, quality, style } = GenerateImageSchema.parse(args);
            
            try {
                const imageUrl = await imageService.generateImage(prompt, size, quality, style);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: `Success, image url: ${imageUrl}`
                        }
                    ],
                };
            } catch (error: any) {
                throw new Error(`DALL-E API error: ${error?.message || 'Unknown error'}`);
            }
        } else if (name === "download_image") {
            const { imageUrl, localPath, fileName } = DownloadImageSchema.parse(args);
            
            console.error(`Downloading image from: ${imageUrl} to ${localPath}/${fileName}`);
            
            try {
                const fullPath = await imageService.downloadImage(fileName, localPath, imageUrl);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: `Image downloaded successfully to: ${fullPath}, file name: ${fileName}`
                        }
                    ],
                };
            } catch (error: any) {
                throw new Error(`Image download error: ${error?.message || 'Unknown error'}`);
            }
        } else {
            throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Invalid arguments: ${error.errors
                    .map((e) => `${e.path.join(".")}: ${e.message}`)
                    .join(", ")}`
            );
        }
        throw error;
    }
});

// Start the server
async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("MCP Server running on stdio");
    } catch (error) {
        console.error("Error during startup:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});