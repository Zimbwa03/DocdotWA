import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  totalAttempts: integer("total_attempts").default(0),
  correctAnswers: integer("correct_answers").default(0),
  streak: integer("streak").default(0),
  maxStreak: integer("max_streak").default(0),
  lastQuizDate: text("last_quiz_date"),
  categoryStats: json("category_stats").$type<Record<string, { attempts: number; correct: number }>>(),
  firebaseId: text("firebase_id").unique()
});

// Questions table for True/False quizzes
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: boolean("answer").notNull(),
  explanation: text("explanation"),
  aiExplanation: text("ai_explanation"),
  references: json("references").$type<Record<string, string>>(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  createdAt: timestamp("created_at").defaultNow()
});

// Image Questions table for image-based quizzes
export const imageQuestions = pgTable("image_questions", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Quiz Attempts to track user progress
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id"),
  imageQuestionId: integer("image_question_id"),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  attemptedAt: timestamp("attempted_at").defaultNow()
});

// AI Tutor conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // book, pdf, video, link, etc.
  url: text("url").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  createdAt: timestamp("created_at").defaultNow()
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requirementType: text("requirement_type").notNull(), // totalQuizzes, streak, accuracy, category
  requirementValue: integer("requirement_value").notNull(),
  category: text("category"),
  icon: text("icon").notNull()
});

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  totalAttempts: true,
  correctAnswers: true,
  streak: true,
  maxStreak: true,
  lastQuizDate: true,
  categoryStats: true
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true
});

export const insertImageQuestionSchema = createInsertSchema(imageQuestions).omit({
  id: true,
  createdAt: true
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  attemptedAt: true
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  createdAt: true
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type ImageQuestion = typeof imageQuestions.$inferSelect;
export type InsertImageQuestion = z.infer<typeof insertImageQuestionSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
