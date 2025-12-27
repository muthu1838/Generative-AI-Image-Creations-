import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { generateImage } from "../services/imageGen.js";
import { generateCopy } from "../services/textGen.js";

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", async (req, res) => {
  try {
    const { prompt, tone } = req.body;

  
    const imageBuffer = await generateImage(prompt);

   
    const filename = `${uuidv4()}.png`;
    const outputPath = path.join(__dirname, "../output", filename);
    fs.writeFileSync(outputPath, imageBuffer);

    
    let copy;
    try {
      copy = await generateCopy(prompt, tone);
    } catch (err) {
    
      copy = {
        caption: `${prompt}`,
        hashtags: "#AIAds #AdVantageGen #CreativeMarketing"
      };
    }

    
    res.json({
      caption: copy.caption,
      hashtags: copy.hashtags,
      imageUrl: `http://localhost:5000/output/${filename}`
    });

  } catch (err) {
    console.error("Generate API error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;