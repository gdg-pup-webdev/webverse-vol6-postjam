// Add your Firebase config in .env — see .env.example
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Check if a valid (non-placeholder) Firebase config exists
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here' && 
  !firebaseConfig.apiKey.startsWith('your_');

let app = null;
let auth = null;
let db = null;
const googleProvider = new GoogleAuthProvider();

if (hasValidConfig) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Services
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('🔥 [GDGCoC PUP Forum] Firebase initialized successfully!');
  } catch (error) {
    console.error("🔥 [GDGCoC PUP Forum] Firebase failed to initialize:", error);
  }
} else {
  // Graceful fallback to offline mode to prevent the page from crashing with a white screen
  console.warn(
    "✨ [GDGCoC PUP Forum] running in offline Demo Mode.\n" +
    "To connect to live Firebase services, copy the '.env.example' file to a new file named '.env' and replace the placeholder values with your Firebase Web App credentials."
  );
}

// Export Services
export { app, auth, db, googleProvider };
