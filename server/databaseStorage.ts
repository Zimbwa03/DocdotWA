import { 
  users, 
  questions, 
  imageQuestions, 
  quizAttempts, 
  aiConversations,
  resources,
  achievements,
  userAchievements,
  type User, 
  type InsertUser,
  type Question,
  type InsertQuestion,
  type ImageQuestion,
  type InsertImageQuestion,
  type QuizAttempt,
  type InsertQuizAttempt,
  type AiConversation,
  type InsertAiConversation,
  type Resource,
  type InsertResource,
  type Achievement,
  type UserAchievement,
  type InsertUserAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, or } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUserStats(userId: number, stats: {
    totalAttempts?: number;
    correctAnswers?: number;
    streak?: number;
    maxStreak?: number;
    lastQuizDate?: string;
    categoryStats?: Record<string, { attempts: number; correct: number }>;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(stats)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Question management
  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async getQuestionsByCategory(category: string, subcategory?: string): Promise<Question[]> {
    if (subcategory) {
      return db.select()
        .from(questions)
        .where(
          and(
            eq(questions.category, category),
            eq(questions.subcategory, subcategory)
          )
        );
    } else {
      return db.select()
        .from(questions)
        .where(eq(questions.category, category));
    }
  }

  async getRandomQuestion(category?: string, subcategory?: string): Promise<Question | undefined> {
    let query = db.select().from(questions);
    
    if (category && subcategory) {
      query = query.where(
        and(
          eq(questions.category, category),
          eq(questions.subcategory, subcategory)
        )
      );
    } else if (category) {
      query = query.where(eq(questions.category, category));
    }
    
    const allQuestions = await query;
    
    if (allQuestions.length === 0) {
      return undefined;
    }
    
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  }

  async createQuestion(questionData: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(questionData)
      .returning();
    return question;
  }

  // Image questions
  async getImageQuestion(id: number): Promise<ImageQuestion | undefined> {
    const [question] = await db.select().from(imageQuestions).where(eq(imageQuestions.id, id));
    return question || undefined;
  }

  async getImageQuestionsByCategory(category: string, subcategory?: string): Promise<ImageQuestion[]> {
    if (subcategory) {
      return db.select()
        .from(imageQuestions)
        .where(
          and(
            eq(imageQuestions.category, category),
            eq(imageQuestions.subcategory, subcategory)
          )
        );
    } else {
      return db.select()
        .from(imageQuestions)
        .where(eq(imageQuestions.category, category));
    }
  }

  async getRandomImageQuestion(category?: string, subcategory?: string): Promise<ImageQuestion | undefined> {
    let query = db.select().from(imageQuestions);
    
    if (category && subcategory) {
      query = query.where(
        and(
          eq(imageQuestions.category, category),
          eq(imageQuestions.subcategory, subcategory)
        )
      );
    } else if (category) {
      query = query.where(eq(imageQuestions.category, category));
    }
    
    const allQuestions = await query;
    
    if (allQuestions.length === 0) {
      return undefined;
    }
    
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  }

  async createImageQuestion(questionData: InsertImageQuestion): Promise<ImageQuestion> {
    const [question] = await db
      .insert(imageQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  // Quiz attempts
  async recordQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(attemptData)
      .returning();
    return attempt;
  }

  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return db.select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.attemptedAt));
  }

  // AI conversations
  async saveAiConversation(conversationData: InsertAiConversation): Promise<AiConversation> {
    const [conversation] = await db
      .insert(aiConversations)
      .values(conversationData)
      .returning();
    return conversation;
  }

  async getUserAiConversations(userId: number): Promise<AiConversation[]> {
    return db.select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.createdAt));
  }

  // Resources
  async getResources(category?: string, type?: string): Promise<Resource[]> {
    let query = db.select().from(resources);
    
    if (category && type) {
      query = query.where(
        and(
          eq(resources.category, category),
          eq(resources.type, type)
        )
      );
    } else if (category) {
      query = query.where(eq(resources.category, category));
    } else if (type) {
      query = query.where(eq(resources.type, type));
    }
    
    return query;
  }

  async createResource(resourceData: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(resourceData)
      .returning();
    return resource;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getUserAchievements(userId: number): Promise<(Achievement & { earnedAt: Date })[]> {
    // Join achievements with userAchievements to get both achievement details and when they were earned
    const userAchievementsWithDetails = await db
      .select({
        id: achievements.id,
        name: achievements.name,
        description: achievements.description,
        requirementType: achievements.requirementType,
        requirementValue: achievements.requirementValue,
        category: achievements.category,
        icon: achievements.icon,
        earnedAt: userAchievements.earnedAt
      })
      .from(achievements)
      .innerJoin(
        userAchievements,
        and(
          eq(achievements.id, userAchievements.achievementId),
          eq(userAchievements.userId, userId)
        )
      );
    
    return userAchievementsWithDetails as (Achievement & { earnedAt: Date })[];
  }

  async awardAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    // Check if the user already has this achievement
    const existing = await db.select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    // Award the achievement
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        earnedAt: new Date()
      })
      .returning();
    
    return userAchievement;
  }
}