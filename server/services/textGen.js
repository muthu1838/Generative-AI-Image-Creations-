import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateCopy(prompt, tone) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const fullPrompt = `
You are a professional ad copywriter.

Ad idea: "${prompt}"
Tone: ${tone}

Generate:
1. A short marketing caption (1–2 lines)
2. 5 relevant social media hashtags

Respond strictly in this format:
Caption: <text>
Hashtags: <#tag1 #tag2 #tag3 #tag4 #tag5>
`;

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();

  const captionMatch = text.match(/Caption:\s*(.*)/i);
  const hashtagMatch = text.match(/Hashtags:\s*(.*)/i);

  return {
    caption: captionMatch?.[1] || "Creative ad for modern brands",
    hashtags: hashtagMatch?.[1] || "#AIAds #AdVantageGen #Marketing"
  };
}