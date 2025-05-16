// Configuration from the original bot
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Define the response type for OpenRouter API
interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }>;
}

/**
 * Handles medical questions using the OpenRouter API
 * @param question The medical question to answer
 * @returns The AI's response
 */
export async function handleOpenRouterRequest(question: string) {
  try {
    // Prepare the system prompt with medical context
    const systemPrompt = `You are DocDot AI, a medical education assistant specialized in anatomy, physiology, and other medical subjects. 
    You provide accurate, detailed answers to medical questions based on established medical knowledge.
    
    - Use professional, academically appropriate language
    - Cite medical textbooks or journals when possible
    - Explain complex concepts clearly
    - When appropriate, organize information with bullet points or numbered lists
    - If you're unsure about something, admit it rather than providing inaccurate information
    - IMPORTANT: Always clarify that your information is for educational purposes only and not a substitute for professional medical advice`;

    // Format the user message
    const userMessage = `${question}`;

    // Make the API request
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://docdot.org",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus", // Use Claude for medical questions
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    // Check for errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
    }

    // Parse the response
    const result = await response.json() as OpenRouterResponse;
    const answer = result.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    return {
      answer,
      model: result.model
    };
  } catch (error) {
    console.error("Error in OpenRouter request:", error);
    return {
      answer: "I'm sorry, I couldn't generate a response at this time. Our AI service might be temporarily unavailable.",
      model: "error"
    };
  }
}
