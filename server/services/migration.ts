import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { storage } from '../storage';
import { InsertQuestion, InsertImageQuestion } from '@shared/schema';

// Default SQLite database path (from the original bot)
const DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'questions.db');

/**
 * Migrates data from SQLite to our storage system
 */
export async function migrateSqliteData() {
  // Check if SQLite database exists
  if (!fs.existsSync(DB_PATH)) {
    console.log('SQLite database not found, skipping migration');
    await createSampleData();
    return;
  }

  try {
    console.log(`Migrating data from SQLite database: ${DB_PATH}`);
    
    // Open the SQLite database
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Check if questions table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='questions'"
    );

    if (!tableExists) {
      console.log('Questions table not found in SQLite database, skipping migration');
      await db.close();
      await createSampleData();
      return;
    }

    // Get all questions from SQLite
    const questions = await db.all('SELECT * FROM questions');
    console.log(`Found ${questions.length} questions in SQLite database`);

    // Migrate questions to our storage
    for (const question of questions) {
      const insertData: InsertQuestion = {
        question: question.question,
        answer: Boolean(question.answer),
        explanation: question.explanation || null,
        aiExplanation: question.ai_explanation || null,
        references: question.reference_data ? JSON.parse(question.reference_data) : {},
        category: question.category,
        subcategory: null // SQLite schema doesn't have subcategory
      };

      // Add subcategory based on category
      if (insertData.category === 'Anatomy' || insertData.category === 'Physiology') {
        // Try to extract subcategory from question text or references
        const subcategories = insertData.category === 'Anatomy' 
          ? ["Head and Neck", "Upper Limb", "Thorax", "Lower Limb", "Pelvis and Perineum", "Neuroanatomy", "Abdomen"]
          : ["Cell", "Nerve and Muscle", "Blood", "Endocrine", "Reproductive", "Gastrointestinal Tract", "Renal", "Cardiovascular System", "Respiration", "Medical Genetics", "Neurophysiology"];
        
        for (const sub of subcategories) {
          if (
            insertData.question.includes(sub) || 
            (insertData.explanation && insertData.explanation.includes(sub))
          ) {
            insertData.subcategory = sub;
            break;
          }
        }
      }

      await storage.createQuestion(insertData);
    }

    // Check if there's image_data.json file for image quiz data
    const imageDataPath = path.join(process.cwd(), 'image_data.json');
    if (fs.existsSync(imageDataPath)) {
      console.log('Migrating image quiz data from image_data.json');
      try {
        const imageData = JSON.parse(fs.readFileSync(imageDataPath, 'utf8'));
        
        // Process image quiz data
        for (const category in imageData) {
          for (const subcategory in imageData[category]) {
            const images = imageData[category][subcategory];
            
            // Each entry might be structured differently - this is just a guess
            for (const image of images) {
              if (image.url && image.question) {
                const insertData: InsertImageQuestion = {
                  imageUrl: image.url,
                  question: image.question,
                  options: image.options || ['Option A', 'Option B', 'Option C', 'Option D'],
                  correctAnswer: image.correctAnswer || image.options?.[0] || 'Option A',
                  explanation: image.explanation || 'No explanation provided',
                  category,
                  subcategory
                };
                
                await storage.createImageQuestion(insertData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing image data:', error);
      }
    }

    await db.close();
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    await createSampleData();
  }
}

/**
 * Creates sample data if no data was migrated
 */
async function createSampleData() {
  console.log('Creating sample quiz data...');
  
  // Create some sample questions
  const sampleQuestions: InsertQuestion[] = [
    {
      question: "The pericardium is contiguous with the central tendon of the diaphragm.",
      answer: true,
      explanation: "The fibrous pericardium is firmly attached to the central tendon of the diaphragm inferiorly. This anatomical relationship is important as it helps anchor the heart in position within the thoracic cavity.",
      aiExplanation: null,
      references: {
        "Gray's Anatomy": "41st Edition, p.959",
        "Clinically Oriented Anatomy": "Moore, 7th Edition"
      },
      category: "Anatomy",
      subcategory: "Thorax"
    },
    {
      question: "The median nerve innervates the thenar muscles of the hand.",
      answer: true,
      explanation: "The median nerve provides motor innervation to the thenar muscles including the abductor pollicis brevis, the flexor pollicis brevis, and the opponens pollicis. It also supplies sensory innervation to the palmar aspect of the thumb, index, middle, and half of the ring finger.",
      aiExplanation: null,
      references: {
        "Gray's Anatomy": "41st Edition, p.896",
        "Netter's Atlas of Human Anatomy": "7th Edition, Plate 462"
      },
      category: "Anatomy",
      subcategory: "Upper Limb"
    },
    {
      question: "The pancreas secretes both endocrine and exocrine products.",
      answer: true,
      explanation: "The pancreas is a mixed gland with both endocrine and exocrine functions. The islets of Langerhans produce hormones (insulin, glucagon) that are released directly into the bloodstream (endocrine function). The acinar cells produce digestive enzymes that are released into the small intestine via the pancreatic duct (exocrine function).",
      aiExplanation: null,
      references: {
        "Guyton and Hall Textbook of Medical Physiology": "14th Edition, Chapter 65",
        "Principles of Anatomy and Physiology": "Tortora & Derrickson, 14th Edition"
      },
      category: "Physiology",
      subcategory: "Gastrointestinal Tract"
    },
    {
      question: "Erythropoietin is primarily produced by the liver.",
      answer: false,
      explanation: "Erythropoietin (EPO) is primarily produced by the kidneys, not the liver. Specifically, it is produced by interstitial fibroblasts in the renal cortex. Only about 10% of EPO is produced by the liver. EPO stimulates the production of red blood cells in response to hypoxia.",
      aiExplanation: null,
      references: {
        "Guyton and Hall Textbook of Medical Physiology": "14th Edition, Chapter 33",
        "Harrison's Principles of Internal Medicine": "20th Edition"
      },
      category: "Physiology",
      subcategory: "Blood"
    }
  ];

  for (const question of sampleQuestions) {
    await storage.createQuestion(question);
  }

  // Create sample image questions
  const sampleImageQuestions: InsertImageQuestion[] = [
    {
      imageUrl: "https://mhealthca.ca/wp-content/uploads/2023/10/histology1-1024x697.jpg",
      question: "What type of tissue is shown in this histological image?",
      options: ["Simple squamous epithelium", "Simple cuboidal epithelium", "Stratified squamous epithelium", "Pseudostratified columnar epithelium"],
      correctAnswer: "Simple squamous epithelium",
      explanation: "This image shows simple squamous epithelium, characterized by a single layer of flat, scale-like cells with centrally located nuclei. This type of epithelium is found lining blood vessels (as endothelium), lymphatic vessels, and the alveoli of the lungs.",
      category: "Histology",
      subcategory: "Epithelial Tissue"
    },
    {
      imageUrl: "https://mhealthca.ca/wp-content/uploads/2023/10/heartcadaver-1024x683.jpg",
      question: "Which cardiac chamber is indicated by the probe in this cadaver image?",
      options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
      correctAnswer: "Left ventricle",
      explanation: "The probe is indicating the left ventricle of the heart. This chamber has the thickest myocardium (heart muscle) of all cardiac chambers because it pumps blood against the high pressure of the systemic circulation. Its walls are typically 3-4 times thicker than those of the right ventricle.",
      category: "Anatomy",
      subcategory: "Thorax"
    }
  ];

  for (const question of sampleImageQuestions) {
    await storage.createImageQuestion(question);
  }

  console.log('Sample data created successfully');
}
