
import sharp from "sharp";
import fs from "fs";

export async function compositeImage(imageBuffer) {
  if (!fs.existsSync("output")) fs.mkdirSync("output");


  await sharp(imageBuffer)
    .png()
    .toFile("output/final.png");
}
