import { AzureOpenAI } from "openai";
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export class ImageService {
  private client: AzureOpenAI;
  private deploymentName: string;

  constructor(client: AzureOpenAI, deploymentName: string) {
    this.client = client;
    this.deploymentName = deploymentName;
  }

  async generateImage(prompt: string, size: string, quality: string, style: string): Promise<string> {
    try {
      const response = await this.client.images.generate({
        model: this.deploymentName,
        prompt,
        n: 1,
        quality: quality as any,
        size: size as any,
        style: style as any
      });
      
      const generatedImage = response.data[0];
      if (!generatedImage || !generatedImage.url) {
        throw new Error("No image URL returned.");
      }
      
      return generatedImage.url || "";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error generating image: ${errorMessage}`);
    }
  }

  // refer to the download implementation in https://github.com/GLips/Figma-Context-MCP/tree/main
  async downloadImage(fileName: string, localPath: string, imageUrl: string): Promise<string> {
    try {
      // Ensure local path exists
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }

      // Build the complete file path
      const fullPath = path.join(localPath, fileName);

      // Use fetch to download the image
      const response = await fetch(imageUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      // Create write stream
      const writer = fs.createWriteStream(fullPath);

      // Get the response as a readable stream and pipe it to the file
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to get response body");
      }

      return new Promise((resolve, reject) => {
        // Process stream
        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                writer.end();
                break;
              }
              writer.write(value);
            }
            resolve(fullPath);
          } catch (err) {
            writer.end();
            fs.unlink(fullPath, () => {});
            reject(err);
          }
        };

        writer.on("error", (err) => {
          reader.cancel();
          fs.unlink(fullPath, () => {});
          reject(new Error(`Failed to write image: ${err.message}`));
        });

        processStream();
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error downloading image: ${errorMessage}`);
    }
  }
}
