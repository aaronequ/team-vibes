import { NextResponse } from "next/server";
import { getGemini, DEFAULT_MODEL } from "@/lib/gemini";

// Helper function to retry Gemini API calls with exponential backoff on transient errors (like 503 UNAVAILABLE)
async function generateWithRetry(client: any, model: string, options: any, maxRetries = 3, initialDelay = 1500) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await client.models.generateContent(options);
    } catch (error: any) {
      attempt++;
      console.warn(`[Gemini Retry] Attempt ${attempt}/${maxRetries} failed:`, error?.message || error);

      if (attempt >= maxRetries) {
        throw error;
      }

      // Check if this error is rate-limiting, demand spike (503), or network drop
      const errorMessage = String(error?.message || "");
      const isTransient =
        error?.status === 503 ||
        error?.status === 429 ||
        errorMessage.includes("503") ||
        errorMessage.includes("429") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("demand");

      if (!isTransient) {
        // Fail fast if it's a structural or bad request error (400, etc.)
        throw error;
      }

      // Calculate exponential backoff delay (e.g. 1.5s, 3.75s)
      const delay = initialDelay * Math.pow(2.5, attempt - 1);
      console.warn(`[Gemini Retry] Transient issue. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const ingredientNames = ingredients.map((i: any) => i.name).join(", ");

    const prompt = `
      You are an expert chef. The user has the following ingredients available: ${ingredientNames}.
      Generate 4 creative and delicious recipe suggestions based on these ingredients.
      It's okay if they don't have every single thing needed for a perfect recipe, but they should have at least 80% of the core ingredients.
      
      Return ONLY a JSON array of objects, with no markdown formatting or backticks.
      Each object must have:
      - "id": string (a unique identifier, like "recipe-1")
      - "name": string (Recipe name)
      - "description": string (A short, appetizing description)
      - "prepTime": number (minutes)
      - "cookTime": number (minutes)
      - "difficulty": string ("Easy", "Medium", or "Hard")
      - "cuisine": string (e.g., "Mexican", "Italian", "American")
      - "servings": number
      - "ingredientsUsed": string[] (List of ingredients from the user's list used in this recipe)
      - "ingredientsMissing": string[] (List of essential ingredients they might need to buy)
      - "steps": string[] (Array of step-by-step instructions)
      
      Ensure the output is valid JSON.
    `;

    const client = getGemini();
    const response = await generateWithRetry(client, DEFAULT_MODEL, {
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text || "";
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const recipes = JSON.parse(cleanedText);
      return NextResponse.json({ recipes });
    } catch (parseError) {
      console.error("Failed to parse recipes as JSON:", cleanedText);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("Recipes API Error:", error);
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 });
  }
}
