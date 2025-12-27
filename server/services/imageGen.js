
import fetch from "node-fetch";
import fs from "fs";

export async function generateImage(prompt) {

  const encodedPrompt = encodeURIComponent(prompt);

  
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=42`;

  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Pollinations image generation failed");
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }

  fs.writeFileSync("output/raw.png", buffer);

  return buffer;
}
