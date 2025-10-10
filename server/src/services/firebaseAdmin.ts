import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
}
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

export const firebaseAdmin = admin;