import { apiRequest } from "./queryClient";

export const askMedicalQuestion = async (question: string) => {
  const response = await apiRequest("POST", "/api/ai/ask", { question });
  
  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }
  
  return response.json();
};
