import { storage } from "../storage";
import { Question, ImageQuestion } from "@shared/schema";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import admin from "firebase-admin";

// Define categories (from the original bot code)
const CATEGORIES = {
  "Anatomy": [
    "Head and Neck",
    "Upper Limb",
    "Thorax",
    "Lower Limb",
    "Pelvis and Perineum",
    "Neuroanatomy",
    "Abdomen"
  ],
  "Physiology": [
    "Cell",
    "Nerve and Muscle",
    "Blood",
    "Endocrine",
    "Reproductive",
    "Gastrointestinal Tract",
    "Renal",
    "Cardiovascular System",
    "Respiration",
    "Medical Genetics",
    "Neurophysiology"
  ]
};

// Image quiz categories
const IMAGE_CATEGORIES = {
  "Anatomy": [
    "Head and Neck",
    "Upper Limb",
    "Thorax",
    "Lower Limb",
    "Abdomen",
    "Pelvis"
  ],
  "Histology": [
    "Epithelial Tissue",
    "Connective Tissue",
    "Muscle Tissue",
    "Nervous Tissue",
    "Cardiovascular System",
    "Respiratory System",
    "Digestive System",
    "Urinary System",
    "Reproductive System"
  ]
};

/**
 * Get quiz categories
 * @returns The quiz categories and subcategories
 */
export async function getQuizCategories() {
  return CATEGORIES;
}

/**
 * Get image quiz categories
 * @returns The image quiz categories and subcategories
 */
export async function getImageQuizCategories() {
  return IMAGE_CATEGORIES;
}

/**
 * Get quiz questions for a specific category
 * @param category The category to get questions for
 * @param subcategory Optional subcategory
 * @returns Array of questions
 */
export async function getQuizQuestions(category: string, subcategory?: string): Promise<Question[]> {
  return await storage.getQuestionsByCategory(category, subcategory);
}

/**
 * Get a random quiz question
 * @param category Optional category filter
 * @param subcategory Optional subcategory filter
 * @returns A random question or undefined if none found
 */
export async function getRandomQuestion(category?: string, subcategory?: string): Promise<Question | undefined> {
  return await storage.getRandomQuestion(category, subcategory);
}

/**
 * Get a random image quiz question
 * @param category Optional category filter
 * @param subcategory Optional subcategory filter
 * @returns A random image question or undefined if none found
 */
export async function getRandomImageQuestion(category?: string, subcategory?: string): Promise<ImageQuestion | undefined> {
  return await storage.getRandomImageQuestion(category, subcategory);
}

/**
 * Record a quiz answer in the database and update user stats
 * @param data Answer data with questionId, isCorrect, userId, category, and optional subcategory
 * @returns Updated user stats
 */
export async function recordAnswer(data: {
  questionId: number;
  isCorrect: boolean;
  userId: string;
  category: string;
  subcategory?: string;
}) {
  try {
    // Get Firestore reference
    const db = getFirestore();
    const userRef = doc(db, "users", data.userId);
    
    // Get current user data
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    
    // Update overall stats
    const totalAttempts = (userData.totalAttempts || 0) + 1;
    const correctAnswers = (userData.correctAnswers || 0) + (data.isCorrect ? 1 : 0);
    const streak = data.isCorrect ? (userData.streak || 0) + 1 : 0;
    const maxStreak = Math.max(streak, userData.maxStreak || 0);
    const lastQuizDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Update category stats
    const categoryStats = userData.categoryStats || {};
    const categoryKey = data.subcategory ? `${data.category}/${data.subcategory}` : data.category;
    
    if (!categoryStats[categoryKey]) {
      categoryStats[categoryKey] = { attempts: 0, correct: 0 };
    }
    
    categoryStats[categoryKey].attempts += 1;
    if (data.isCorrect) {
      categoryStats[categoryKey].correct += 1;
    }
    
    // Update user document
    await updateDoc(userRef, {
      totalAttempts,
      correctAnswers,
      streak,
      maxStreak,
      lastQuizDate,
      categoryStats
    });
    
    // Record the quiz attempt in storage if we have a local user
    try {
      const user = await storage.getUserByFirebaseId(data.userId);
      if (user) {
        await storage.recordQuizAttempt({
          userId: user.id,
          questionId: data.questionId,
          imageQuestionId: null,
          userAnswer: data.isCorrect.toString(),
          isCorrect: data.isCorrect,
          category: data.category,
          subcategory: data.subcategory
        });
      }
    } catch (err) {
      console.warn("Failed to record quiz attempt in local storage:", err);
    }
    
    return {
      totalAttempts,
      correctAnswers,
      streak,
      maxStreak,
      lastQuizDate,
      categoryStats
    };
  } catch (error) {
    console.error("Error recording answer:", error);
    throw error;
  }
}

/**
 * Record an image quiz answer in the database and update user stats
 * @param data Answer data with questionId, isCorrect, userId, category, and subcategory
 * @returns Updated user stats
 */
export async function recordImageAnswer(data: {
  questionId: string;
  isCorrect: boolean;
  userId: string;
  category: string;
  subcategory: string;
}) {
  try {
    // This follows a similar pattern to recordAnswer
    const db = getFirestore();
    const userRef = doc(db, "users", data.userId);
    
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    
    // Update overall stats
    const totalAttempts = (userData.totalAttempts || 0) + 1;
    const correctAnswers = (userData.correctAnswers || 0) + (data.isCorrect ? 1 : 0);
    const streak = data.isCorrect ? (userData.streak || 0) + 1 : 0;
    const maxStreak = Math.max(streak, userData.maxStreak || 0);
    const lastQuizDate = new Date().toISOString().split('T')[0];
    
    // Update category stats
    const categoryStats = userData.categoryStats || {};
    const categoryKey = `${data.category}/${data.subcategory}`;
    
    if (!categoryStats[categoryKey]) {
      categoryStats[categoryKey] = { attempts: 0, correct: 0 };
    }
    
    categoryStats[categoryKey].attempts += 1;
    if (data.isCorrect) {
      categoryStats[categoryKey].correct += 1;
    }
    
    // Update user document
    await updateDoc(userRef, {
      totalAttempts,
      correctAnswers,
      streak,
      maxStreak,
      lastQuizDate,
      categoryStats
    });
    
    // Record the quiz attempt in local storage if we have a local user
    try {
      const user = await storage.getUserByFirebaseId(data.userId);
      if (user) {
        await storage.recordQuizAttempt({
          userId: user.id,
          questionId: null,
          imageQuestionId: parseInt(data.questionId),
          userAnswer: data.isCorrect.toString(),
          isCorrect: data.isCorrect,
          category: data.category,
          subcategory: data.subcategory
        });
      }
    } catch (err) {
      console.warn("Failed to record image quiz attempt in local storage:", err);
    }
    
    return {
      totalAttempts,
      correctAnswers,
      streak,
      maxStreak,
      lastQuizDate,
      categoryStats
    };
  } catch (error) {
    console.error("Error recording image answer:", error);
    throw error;
  }
}

/**
 * Get user statistics
 * @param userId Firebase user ID
 * @returns User statistics
 */
export async function getUserStats(userId: string) {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    
    return {
      totalAttempts: userData.totalAttempts || 0,
      correctAnswers: userData.correctAnswers || 0,
      streak: userData.streak || 0,
      maxStreak: userData.maxStreak || 0,
      lastQuizDate: userData.lastQuizDate || null,
      categoryStats: userData.categoryStats || {}
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
}

/**
 * Get the leaderboard for a specific category or overall
 * @param category Optional category filter
 * @param subcategory Optional subcategory filter
 * @returns Array of leaderboard entries
 */
export async function getLeaderboard(category?: string, subcategory?: string) {
  try {
    const db = getFirestore();
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      return [];
    }
    
    const leaderboard = snapshot.docs.map(doc => {
      const userData = doc.data();
      const userId = doc.id;
      const displayName = userData.displayName || "Anonymous";
      
      // Handle category filtering
      if (category && subcategory) {
        const categoryKey = `${category}/${subcategory}`;
        const categoryStats = userData.categoryStats?.[categoryKey];
        
        if (!categoryStats || categoryStats.attempts === 0) {
          return null;
        }
        
        return {
          userId,
          displayName,
          accuracy: (categoryStats.correct / categoryStats.attempts) * 100,
          attempts: categoryStats.attempts,
          correct: categoryStats.correct,
          streak: userData.streak
        };
      } 
      else if (category) {
        // Filter for specific category (includes all subcategories)
        let totalAttempts = 0;
        let totalCorrect = 0;
        
        Object.entries(userData.categoryStats || {}).forEach(([key, stats]) => {
          if (key === category || key.startsWith(`${category}/`)) {
            totalAttempts += stats.attempts;
            totalCorrect += stats.correct;
          }
        });
        
        if (totalAttempts === 0) {
          return null;
        }
        
        return {
          userId,
          displayName,
          accuracy: (totalCorrect / totalAttempts) * 100,
          attempts: totalAttempts,
          correct: totalCorrect,
          streak: userData.streak
        };
      } 
      else {
        // Overall leaderboard
        const totalAttempts = userData.totalAttempts || 0;
        const correctAnswers = userData.correctAnswers || 0;
        
        if (totalAttempts === 0) {
          return null;
        }
        
        return {
          userId,
          displayName,
          accuracy: (correctAnswers / totalAttempts) * 100,
          attempts: totalAttempts,
          correct: correctAnswers,
          streak: userData.streak
        };
      }
    }).filter(entry => entry !== null);
    
    // Sort by accuracy (highest first)
    leaderboard.sort((a, b) => b.accuracy - a.accuracy);
    
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
}
