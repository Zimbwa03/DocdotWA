import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  User,
  UserCredential
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF3XYL7pybwBROu-SHEnQk964blET3Xfw",
  authDomain: "docdotwp.firebaseapp.com",
  projectId: "docdotwp",
  storageBucket: "docdotwp.appspot.com",
  messagingSenderId: "617421258968",
  appId: "1:617421258968:web:b1a53c9d98bae9efc897ad",
  measurementId: "G-XF003FJTQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// User authentication functions
export const registerUser = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name
    await updateProfile(userCredential.user, { displayName });
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      displayName,
      createdAt: new Date(),
      totalAttempts: 0,
      correctAnswers: 0,
      streak: 0,
      maxStreak: 0,
      lastQuizDate: null,
      categoryStats: {}
    });
    
    return userCredential;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: new Date(),
        totalAttempts: 0,
        correctAnswers: 0,
        streak: 0,
        maxStreak: 0,
        lastQuizDate: null,
        categoryStats: {}
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithFacebook = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: new Date(),
        totalAttempts: 0,
        correctAnswers: 0,
        streak: 0,
        maxStreak: 0,
        lastQuizDate: null,
        categoryStats: {}
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const verifyEmail = async (user: User): Promise<void> => {
  try {
    return await sendEmailVerification(user);
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// User data functions
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUserStats = async (userId: string, quizData: {
  correct: boolean;
  category: string;
  subcategory?: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }
    
    const userData = userDoc.data();
    const { correct, category, subcategory } = quizData;
    
    // Update overall stats
    const totalAttempts = (userData.totalAttempts || 0) + 1;
    const correctAnswers = (userData.correctAnswers || 0) + (correct ? 1 : 0);
    const streak = correct ? (userData.streak || 0) + 1 : 0;
    const maxStreak = Math.max(streak, userData.maxStreak || 0);
    const lastQuizDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Update category stats
    const categoryStats = userData.categoryStats || {};
    const categoryKey = subcategory ? `${category}/${subcategory}` : category;
    
    if (!categoryStats[categoryKey]) {
      categoryStats[categoryKey] = { attempts: 0, correct: 0 };
    }
    
    categoryStats[categoryKey].attempts += 1;
    if (correct) {
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
    
    return {
      totalAttempts,
      correctAnswers,
      streak,
      maxStreak,
      lastQuizDate,
      categoryStats
    };
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export default app;
