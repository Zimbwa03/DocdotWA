import admin from 'firebase-admin';
import { getApps, getApp } from 'firebase-admin/app';

// Fix for Firebase admin initialization
const apps = getApps();
const firebaseApp = apps.length === 0 
  ? admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "docdotwp",
        clientEmail: "firebase-adminsdk-fbsvc@docdotwp.iam.gserviceaccount.com",
        // Private key from service account (truncated for security)
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDa2SmAodjyBnuh\nzh608dec9ZyC6ocjjk2LCNLRZcSaWQq2geS1WL4/R2XYnZEuIBQfXgoFleHvV7yM\nr2b62TEQxODCbqoniu5UTA/ix+HVNrjASbd3y9oxsKkcsJLZaoBUOiyu2OI8ibLn\nab4FP1X+8nDddUNC2lrP2bPPDdF57R0MiX+TXg055X3H7mcy37ZrM979tlxNfo3T\nVUDpOABvELFyDPbhWD2pP9f904uzlps3p/etuk1nPPapqXJQeuw2qYwNFfU39Ll0\nenn8TQfZtVLMyVqDX1pWylqiUuk1txtUjuVjLNEAxaPig7MiiyXzA5XtJNl/Eu+d\n7NR8LYezAgMBAAECggEAAnbjksE/0inkhoPtsJfwl6\n-----END PRIVATE KEY-----\n",
      }),
      databaseURL: 'https://docdotwp.firebaseio.com',
    }) 
  : getApp();

// Export Firestore and Auth instances
export const firestore = admin.firestore(firebaseApp);
export const auth = admin.auth(firebaseApp);

export default admin;