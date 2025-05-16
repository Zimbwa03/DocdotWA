import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { handleOpenRouterRequest } from "./services/openrouter";
import { getQuizCategories, getRandomQuestion, getQuizQuestions, recordAnswer } from "./services/quiz";
import { getRandomImageQuestion, getImageQuizCategories, recordImageAnswer } from "./services/quiz";
import { getUserStats, getLeaderboard } from "./services/quiz";
import { migrateSqliteData } from "./services/migration";
import { getUserAnalytics, getCategories } from "./services/analytics";
import { insertQuestionSchema, insertImageQuestionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database and migrate data if needed
  await migrateSqliteData();

  // Categories API
  app.get("/api/quiz/categories", async (req, res) => {
    try {
      const categories = await getQuizCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/image-quiz/categories", async (req, res) => {
    try {
      const categories = await getImageQuizCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Questions API
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const category = req.query.category as string;
      const subcategory = req.query.subcategory as string | undefined;
      
      const questions = await getQuizQuestions(category, subcategory);
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/quiz/random", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const subcategory = req.query.subcategory as string | undefined;
      
      const question = await getRandomQuestion(category, subcategory);
      
      if (!question) {
        return res.status(404).json({ message: "No questions found for the specified criteria" });
      }
      
      res.json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/image-quiz/random", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const subcategory = req.query.subcategory as string | undefined;
      
      const question = await getRandomImageQuestion(category, subcategory);
      
      if (!question) {
        return res.status(404).json({ message: "No image questions found for the specified criteria" });
      }
      
      res.json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Record quiz answers
  app.post("/api/quiz/record-answer", async (req, res) => {
    try {
      const schema = z.object({
        questionId: z.number(),
        isCorrect: z.boolean(),
        userId: z.string(),
        category: z.string(),
        subcategory: z.string().optional()
      });
      
      const data = schema.parse(req.body);
      const result = await recordAnswer(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/image-quiz/record-answer", async (req, res) => {
    try {
      const schema = z.object({
        questionId: z.string(),
        isCorrect: z.boolean(),
        userId: z.string(),
        category: z.string(),
        subcategory: z.string()
      });
      
      const data = schema.parse(req.body);
      const result = await recordImageAnswer(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stats and leaderboard
  app.get("/api/stats/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const stats = await getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stats/leaderboard", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const subcategory = req.query.subcategory as string | undefined;
      
      const leaderboard = await getLeaderboard(category, subcategory);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI tutor
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }
      
      const response = await handleOpenRouterRequest(question);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin API for adding questions (would require auth middleware in production)
  app.post("/api/admin/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const newQuestion = await storage.createQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/image-questions", async (req, res) => {
    try {
      const questionData = insertImageQuestionSchema.parse(req.body);
      const newQuestion = await storage.createImageQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics API
  app.get("/api/analytics/user", async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      const timeRange = req.query.timeRange as string || '30days';
      const category = req.query.category as string || 'all';
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const analyticsData = await getUserAnalytics(userId, timeRange, category);
      res.json(analyticsData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
