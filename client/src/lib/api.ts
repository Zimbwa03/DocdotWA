import { apiRequest } from "./queryClient";

export interface Question {
  id: number;
  question: string;
  answer: boolean;
  explanation: string;
  ai_explanation: string | null;
  category: string;
  subcategory?: string;
  references?: Record<string, string>;
}

export interface ImageQuestion {
  id: string;
  imageUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  subcategory: string;
}

export interface UserStats {
  totalAttempts: number;
  correctAnswers: number;
  streak: number;
  maxStreak: number;
  lastQuizDate: string | null;
  categoryStats: Record<string, { attempts: number; correct: number }>;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  accuracy: number;
  attempts: number;
  correct: number;
  streak?: number;
}

// Quiz API functions
export const getQuizCategories = async () => {
  const res = await apiRequest("GET", "/api/quiz/categories", undefined);
  return await res.json();
};

export const getQuizQuestions = async (category: string, subcategory?: string) => {
  const url = subcategory 
    ? `/api/quiz/questions?category=${category}&subcategory=${subcategory}` 
    : `/api/quiz/questions?category=${category}`;
  const res = await apiRequest("GET", url, undefined);
  return await res.json();
};

export const getRandomQuestion = async (category?: string, subcategory?: string) => {
  let url = "/api/quiz/random";
  if (category) {
    url += `?category=${category}`;
    if (subcategory) {
      url += `&subcategory=${subcategory}`;
    }
  }
  const res = await apiRequest("GET", url, undefined);
  return await res.json();
};

export const recordQuizAnswer = async (data: {
  questionId: number;
  isCorrect: boolean;
  userId: string;
  category: string;
  subcategory?: string;
}) => {
  const res = await apiRequest("POST", "/api/quiz/record-answer", data);
  return await res.json();
};

// Image Quiz API functions
export const getImageQuizCategories = async () => {
  const res = await apiRequest("GET", "/api/image-quiz/categories", undefined);
  return await res.json();
};

export const getRandomImageQuestion = async (category?: string, subcategory?: string) => {
  let url = "/api/image-quiz/random";
  if (category) {
    url += `?category=${category}`;
    if (subcategory) {
      url += `&subcategory=${subcategory}`;
    }
  }
  const res = await apiRequest("GET", url, undefined);
  return await res.json();
};

export const recordImageQuizAnswer = async (data: {
  questionId: string;
  isCorrect: boolean;
  userId: string;
  category: string;
  subcategory: string;
}) => {
  const res = await apiRequest("POST", "/api/image-quiz/record-answer", data);
  return await res.json();
};

// Stats and Leaderboard API functions
export const getUserStats = async (userId: string) => {
  const res = await apiRequest("GET", `/api/stats/user/${userId}`, undefined);
  return await res.json();
};

export const getLeaderboard = async (category?: string, subcategory?: string) => {
  let url = "/api/stats/leaderboard";
  if (category) {
    url += `?category=${category}`;
    if (subcategory) {
      url += `&subcategory=${subcategory}`;
    }
  }
  const res = await apiRequest("GET", url, undefined);
  return await res.json();
};

// AI Tutor API function
export const askAiTutor = async (question: string) => {
  const res = await apiRequest("POST", "/api/ai/ask", { question });
  return await res.json();
};
