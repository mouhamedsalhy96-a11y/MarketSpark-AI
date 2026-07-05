import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { productName, audience, description } = body;

    const prompt = `
      You are an expert marketing copywriter. Write promotional copy.
      Product Name: ${productName}
      Target Audience: ${audience}
      Key Features: ${description}
      
      Return ONLY a raw JSON object with this exact structure. Do not include markdown, backticks, or any HTML.
      {
        "linkedin": "A professional LinkedIn post with hashtags and emojis.",
        "twitter": "A short, catchy Twitter thread.",
        "email": "An engaging email newsletter draft."
      }
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      { error: "Failed to generate copy. Error: " + error.message },
      { status: 500 },
    );
  }
}
