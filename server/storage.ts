import { 
  users, User, InsertUser,
  questions, Question, InsertQuestion,
  imageQuestions, ImageQuestion, InsertImageQuestion,
  quizAttempts, QuizAttempt, InsertQuizAttempt,
  aiConversations, AiConversation, InsertAiConversation,
  resources, Resource, InsertResource,
  achievements, Achievement, InsertAchievement,
  userAchievements, UserAchievement, InsertUserAchievement
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, stats: {
    totalAttempts?: number;
    correctAnswers?: number;
    streak?: number;
    maxStreak?: number;
    lastQuizDate?: string;
    categoryStats?: Record<string, { attempts: number; correct: number }>;
  }): Promise<User>;

  // Question management
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByCategory(category: string, subcategory?: string): Promise<Question[]>;
  getRandomQuestion(category?: string, subcategory?: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Image questions
  getImageQuestion(id: number): Promise<ImageQuestion | undefined>;
  getImageQuestionsByCategory(category: string, subcategory?: string): Promise<ImageQuestion[]>;
  getRandomImageQuestion(category?: string, subcategory?: string): Promise<ImageQuestion | undefined>;
  createImageQuestion(question: InsertImageQuestion): Promise<ImageQuestion>;

  // Quiz attempts
  recordQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: number): Promise<QuizAttempt[]>;

  // AI conversations
  saveAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getUserAiConversations(userId: number): Promise<AiConversation[]>;

  // Resources
  getResources(category?: string, type?: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(Achievement & { earnedAt: Date })[]>;
  awardAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private questionsData: Map<number, Question>;
  private imageQuestionsData: Map<number, ImageQuestion>;
  private quizAttemptsData: Map<number, QuizAttempt>;
  private aiConversationsData: Map<number, AiConversation>;
  private resourcesData: Map<number, Resource>;
  private achievementsData: Map<number, Achievement>;
  private userAchievementsData: Map<number, UserAchievement>;
  private currentId: {
    users: number;
    questions: number;
    imageQuestions: number;
    quizAttempts: number;
    aiConversations: number;
    resources: number;
    achievements: number;
    userAchievements: number;
  };

  constructor() {
    this.usersData = new Map();
    this.questionsData = new Map();
    this.imageQuestionsData = new Map();
    this.quizAttemptsData = new Map();
    this.aiConversationsData = new Map();
    this.resourcesData = new Map();
    this.achievementsData = new Map();
    this.userAchievementsData = new Map();
    this.currentId = {
      users: 1,
      questions: 1,
      imageQuestions: 1,
      quizAttempts: 1,
      aiConversations: 1,
      resources: 1,
      achievements: 1,
      userAchievements: 1
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.firebaseId === firebaseId
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user: User = { 
      ...userData, 
      id, 
      createdAt: now,
      totalAttempts: 0,
      correctAnswers: 0,
      streak: 0,
      maxStreak: 0,
      lastQuizDate: null,
      categoryStats: {},
    };
    
    this.usersData.set(id, user);
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
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      totalAttempts: stats.totalAttempts !== undefined ? stats.totalAttempts : user.totalAttempts,
      correctAnswers: stats.correctAnswers !== undefined ? stats.correctAnswers : user.correctAnswers,
      streak: stats.streak !== undefined ? stats.streak : user.streak,
      maxStreak: stats.maxStreak !== undefined ? stats.maxStreak : user.maxStreak,
      lastQuizDate: stats.lastQuizDate !== undefined ? stats.lastQuizDate : user.lastQuizDate,
      categoryStats: stats.categoryStats !== undefined ? stats.categoryStats : user.categoryStats
    };

    this.usersData.set(userId, updatedUser);
    return updatedUser;
  }

  // Question methods
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questionsData.get(id);
  }

  async getQuestionsByCategory(category: string, subcategory?: string): Promise<Question[]> {
    return Array.from(this.questionsData.values()).filter(
      (q) => q.category === category && (!subcategory || q.subcategory === subcategory)
    );
  }

  async getRandomQuestion(category?: string, subcategory?: string): Promise<Question | undefined> {
    const questions = Array.from(this.questionsData.values()).filter(
      (q) => (!category || q.category === category) && (!subcategory || q.subcategory === subcategory)
    );

    if (questions.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  async createQuestion(questionData: InsertQuestion): Promise<Question> {
    const id = this.currentId.questions++;
    const now = new Date();
    const question: Question = { ...questionData, id, createdAt: now };
    
    this.questionsData.set(id, question);
    return question;
  }

  // Image question methods
  async getImageQuestion(id: number): Promise<ImageQuestion | undefined> {
    return this.imageQuestionsData.get(id);
  }

  async getImageQuestionsByCategory(category: string, subcategory?: string): Promise<ImageQuestion[]> {
    return Array.from(this.imageQuestionsData.values()).filter(
      (q) => q.category === category && (!subcategory || q.subcategory === subcategory)
    );
  }

  async getRandomImageQuestion(category?: string, subcategory?: string): Promise<ImageQuestion | undefined> {
    const questions = Array.from(this.imageQuestionsData.values()).filter(
      (q) => (!category || q.category === category) && (!subcategory || q.subcategory === subcategory)
    );

    if (questions.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  async createImageQuestion(questionData: InsertImageQuestion): Promise<ImageQuestion> {
    const id = this.currentId.imageQuestions++;
    const now = new Date();
    const question: ImageQuestion = { ...questionData, id, createdAt: now };
    
    this.imageQuestionsData.set(id, question);
    return question;
  }

  // Quiz attempts methods
  async recordQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentId.quizAttempts++;
    const now = new Date();
    const attempt: QuizAttempt = { ...attemptData, id, attemptedAt: now };
    
    this.quizAttemptsData.set(id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttemptsData.values()).filter(
      (attempt) => attempt.userId === userId
    );
  }

  // AI conversation methods
  async saveAiConversation(conversationData: InsertAiConversation): Promise<AiConversation> {
    const id = this.currentId.aiConversations++;
    const now = new Date();
    const conversation: AiConversation = { ...conversationData, id, createdAt: now };
    
    this.aiConversationsData.set(id, conversation);
    return conversation;
  }

  async getUserAiConversations(userId: number): Promise<AiConversation[]> {
    return Array.from(this.aiConversationsData.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }

  // Resource methods
  async getResources(category?: string, type?: string): Promise<Resource[]> {
    return Array.from(this.resourcesData.values()).filter(
      (resource) => 
        (!category || resource.category === category) && 
        (!type || resource.type === type)
    );
  }

  async createResource(resourceData: InsertResource): Promise<Resource> {
    const id = this.currentId.resources++;
    const now = new Date();
    const resource: Resource = { ...resourceData, id, createdAt: now };
    
    this.resourcesData.set(id, resource);
    return resource;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievementsData.values());
  }

  async getUserAchievements(userId: number): Promise<(Achievement & { earnedAt: Date })[]> {
    const userAchievements = Array.from(this.userAchievementsData.values()).filter(
      (ua) => ua.userId === userId
    );

    return userAchievements.map((ua) => {
      const achievement = this.achievementsData.get(ua.achievementId);
      if (!achievement) {
        throw new Error(`Achievement with id ${ua.achievementId} not found`);
      }
      return { ...achievement, earnedAt: ua.earnedAt };
    });
  }

  async awardAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existing = Array.from(this.userAchievementsData.values()).find(
      (ua) => ua.userId === userId && ua.achievementId === achievementId
    );

    if (existing) {
      return existing;
    }

    const id = this.currentId.userAchievements++;
    const now = new Date();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      earnedAt: now
    };
    
    this.userAchievementsData.set(id, userAchievement);
    return userAchievement;
  }
}

import { DatabaseStorage } from "./databaseStorage";

// Use the DatabaseStorage implementation that connects to PostgreSQL
export const storage = new DatabaseStorage();
