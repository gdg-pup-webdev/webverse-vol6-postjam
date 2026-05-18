# 🔑 ANSWER KEY — Social Wall PH
## Webverse Vol. 6 | FOR INSTRUCTOR USE ONLY

> [!WARNING]
> **⚠️ DO NOT SHARE WITH STUDENTS.** This document contains the full working solutions, complete file contents, and validation steps for the instructor's private reference.

---

## 🚀 Swapped Features Summary
This key provides the direct drop-in solutions to successfully implement the following **5 features**:
1. **Google Sign-In & Sign-Out** inside `src/components/Navbar.jsx`
2. **Real-Time Authentication State Observer** inside `src/App.jsx`
3. **User Profile Rendering with CSS Fallbacks** inside `src/components/Navbar.jsx`
4. **Save a Post to Firestore** inside `src/components/PostInput.jsx`
5. **Real-Time Feed & Document Deletion** inside `src/App.jsx`, `src/components/PostList.jsx`, and `src/components/PostCard.jsx`

---

## 🛠️ Complete Solutions

### 1. File: `src/firebase.js`
#### What changed and why
We configure and initialize the Google Firebase SDK. Using Vite's environment import wrapper `import.meta.env`, we ingest secrets from the ignored `.env` file and export initialized services (`app`, `auth`, `db`, and `googleProvider`) for easy import inside any React component.

#### Complete Code:
```javascript
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
// GoogleAuthProvider instance to be passed to signInWithPopup
const googleProvider = new GoogleAuthProvider();

if (hasValidConfig) {
  try {
    // Initialize the standard Firebase application instance
    app = initializeApp(firebaseConfig);
    
    // Initialize authentication and Firestore services bound to the initialized app
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

// Export the services so other React components can access the database, authentication, and Google provider instance
export { app, auth, db, googleProvider };
```

---

### 2. File: `src/App.jsx`
#### What changed and why
We implement two separate `useEffect` hooks in the main component. The first hook sets up the `onAuthStateChanged` listener to keep React state synchronized with the Firebase Auth session, and the second creates an `onSnapshot` observer querying the Firestore database to feed the microblog wall in real-time, sorting posts by newest first.

#### Complete Code:
```javascript
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostInput from './components/PostInput';
import PostList from './components/PostList';
import sparkyMascot from './assets/Sparky.png';
import gdgLogo from './assets/gdg-logo.png';
import './App.css'; // Link the customized Google Developers stylesheet
import { auth, db } from './firebase'; // Imported for student use
// 🌟 Firebase Auth & Firestore helper imports for students to use:
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function App() {
  // 1. Authentication State
  // Tracks the currently logged-in user object (null when signed out)
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Posts State (Empty by default, will stream real-time data from Firestore)
  const [posts, setPosts] = useState([]);

  // 3. Authentication state listener
  useEffect(() => {
    // If Firebase Auth service is active, register the persistent observer
    if (!auth) {
      console.warn("Firebase Authentication is in offline demo mode.");
      return;
    }

    // onAuthStateChanged triggers whenever the user logs in, logs out, or token refreshes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, populate state
        setCurrentUser(user);
      } else {
        // User is signed out, clear auth state
        setCurrentUser(null);
      }
    });

    // Cleanup: Unsubscribe when the component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, []);

  // 4. Firestore Live Real-Time Listener
  useEffect(() => {
    // If Firestore Database service is active, build the dynamic stream
    if (!db) {
      console.warn("Cloud Firestore is in offline demo mode.");
      return;
    }

    // 1. Define query targeting the "posts" collection, sorted by newest posts first
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // 2. Attach live onSnapshot listener to the query
    const unsubscribe = onSnapshot(postsQuery, 
      (snapshot) => {
        // Map snapshot documents into a clean React array
        const postsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsList);
      },
      (error) => {
        console.error("🔥 [GDG on Campus PUP] Firestore listener failed:", error);
      }
    );

    // Cleanup: Unsubscribe the real-time observer when App unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <Navbar currentUser={currentUser} />
      
      <header className="app-hero">
        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-eyebrow">WEBVERSE VOL. 6 · POST-JAM ACTIVITY</span>
            <h1 className="hero-title">Forum</h1>
            <p className="hero-subtitle">
              Connect with the GDG community. Share your thoughts, ideas, and learnings.
            </p>
            <div className="hero-dots-row">
              <span className="hero-dot dot-blue"></span>
              <span className="hero-dot dot-red"></span>
              <span className="hero-dot dot-yellow"></span>
              <span className="hero-dot dot-green"></span>
            </div>
          </div>
          <div className="hero-right">
            <img src={sparkyMascot} alt="Sparky Mascot" className="hero-sparky-img" />
          </div>
        </div>
        
        {/* Glow circles behind black hero */}
        <div className="hero-glow-circles">
          <div className="hero-circle circle-blue"></div>
          <div className="hero-circle circle-red"></div>
          <div className="hero-circle circle-yellow"></div>
          <div className="hero-circle circle-green"></div>
        </div>
      </header>

      <main className="main-content">
        <PostInput currentUser={currentUser} />
        
        <div className="feed-section">
          <div className="feed-header">
            <span className="feed-title">Recent Posts</span>
            <span className="feed-badge">{posts.length} posts</span>
          </div>
          <PostList posts={posts} currentUser={currentUser} />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-top-row">
          <div className="footer-left">
            <img src={gdgLogo} alt="GDG Logo" className="footer-logo-img" />
            <span className="footer-brand-text">GDG on Campus PUP</span>
          </div>
          <div className="footer-links">
            <a href="https://developer.android.com" target="_blank" rel="noopener noreferrer">Android</a>
            <a href="https://developer.chrome.com" target="_blank" rel="noopener noreferrer">Chrome</a>
            <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase</a>
            <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud</a>
            <a href="https://ai.google" target="_blank" rel="noopener noreferrer">Google AI</a>
            <a href="https://developers.google.com/products" target="_blank" rel="noopener noreferrer">All products</a>
          </div>
        </div>
        
        <div className="footer-bottom-row">
          <p>© 2026 Google Developer Groups on Campus PUP · Built with React + Firebase</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
```

---

### 3. File: `src/components/Navbar.jsx`
#### What changed and why
We complete the Google Authentication trigger methods. `signInWithPopup` invokes standard browser Google OAuth flow, while `signOut` flushes credentials to trigger the user state observers. The profile photo uses a custom `.avatar-wrapper` wrapping div with an `.avatar-fallback` containing the capitalized first character of the display name, and an `onError` trigger to hide broken avatar links.

#### Complete Code:
```javascript
import React from 'react';
import gdgLogo from '../assets/gdg-logo.png';
// 🌟 Firebase Auth Imports for Students:
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Navbar({ currentUser }) {
  const handleSignIn = async () => {
    try {
      console.log('Sign in button clicked! Attempting Google Sign-In...');
      // Safe guard for offline demo mode
      if (!auth) {
        console.warn('✨ [GDG on Campus PUP] Authentication is in offline demo mode. Firebase is not configured.');
        alert('✨ Sign-In Attempted!\n\nThis app is running in offline Demo Mode. To connect to your live Firebase project, please configure your .env file with your web app credentials.');
        return;
      }
      
      // Triggers the standard Google OAuth login pop-up window
      await signInWithPopup(auth, googleProvider);
      console.log('✨ [GDG on Campus PUP] Google Sign-in successful!');
    } catch (error) {
      console.error('🔥 [GDG on Campus PUP] Sign in failed:', error);
      alert(`❌ Sign-in failed: ${error.message || error}`);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Sign out button clicked! Attempting Firebase Sign-Out...');
      // Safe guard for offline demo mode
      if (!auth) {
        console.warn('✨ [GDG on Campus PUP] Authentication is in offline demo mode.');
        return;
      }
      
      // Logs out the currently authenticated user
      await signOut(auth);
      console.log('✨ [GDG on Campus PUP] User signed out successfully!');
    } catch (error) {
      console.error('🔥 [GDG on Campus PUP] Sign out failed:', error);
      alert(`❌ Sign-out failed: ${error.message || error}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">
          <img src={gdgLogo} alt="GDG Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">GDG on Campus PUP</span>
        </span>
      </div>
      <div className="navbar-right">
        {!currentUser ? (
          // Render Sign In button if no user is logged in
          <button className="btn-signin" onClick={handleSignIn}>
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#EA4335"
                d="M12 5.04c1.7 0 3.2.59 4.4 1.76l3.28-3.28C17.72 1.64 15.04 1 12 1 7.37 1 3.42 3.66 1.48 7.56l3.87 3C6.27 7.74 8.91 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z"
              />
              <path
                fill="#FBBC05"
                d="M5.35 14.72c-.25-.76-.39-1.57-.39-2.41s.14-1.65.39-2.41l-3.87-3C.68 8.49 0 10.17 0 12s.68 3.51 1.48 5.12l3.87-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.11.75-2.53 1.2-4.2 1.2-3.09 0-5.73-2.7-6.66-5.52l-3.87 3C3.42 20.34 7.37 23 12 23z"
              />
            </svg>
            Sign in with Google
          </button>
        ) : (
          // Render Profile image, name, and Sign Out button if user is authenticated
          <div className="user-profile">
            <div className="user-info">
              <div className="avatar-wrapper">
                <div className="avatar-fallback">
                  {currentUser.displayName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="user-avatar"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <span className="user-name">{currentUser.displayName || 'Developer'}</span>
            </div>
            <button className="btn-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
```

---

### 4. File: `src/components/PostInput.jsx`
#### What changed and why
We complete the input submission handler. The method validates that the text is not empty and is authored by a signed-in user, and calls `addDoc` targeting our Firestore collection database. It structures records using the Google auth properties (`displayName`, `photoURL`, and `uid`) and clears the text field after successful writes.

#### Complete Code:
```javascript
import React, { useState } from 'react';
// 🌟 Firebase Firestore helper imports for students:
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PostInput({ currentUser }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Guard Clauses: Ensure there is valid text and a logged-in user
    if (!text.trim()) return;
    if (!currentUser) {
      alert("❌ You must be signed in to create a post.");
      return;
    }

    try {
      console.log('Post submitted:', text);
      
      // Safe guard for offline demo mode
      if (!db) {
        console.warn('✨ [GDG on Campus PUP] Firestore is not configured. Running offline simulation.');
        alert('✨ Post Submitted (Offline Simulation)!\n\nTo persist posts in Firestore, please provide your credentials in the .env file.');
        setText('');
        return;
      }

      // 2. Perform Firestore Write using addDoc to automatically generate a unique document ID
      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        createdAt: serverTimestamp(), // Generates precise Timestamp based on Google's cloud server clocks
        authorName: currentUser.displayName || 'Anonymous Developer',
        authorPhoto: currentUser.photoURL || '',
        authorId: currentUser.uid // Storing UID is critical to authorize future deletions!
      });

      console.log('✨ [GDG on Campus PUP] Post successfully saved to Firestore!');
      
      // 3. Clear text input after successful database insertion
      setText('');
    } catch (error) {
      console.error('🔥 [GDG on Campus PUP] Failed to save post:', error);
      alert(`❌ Failed to publish post: ${error.message || error}`);
    }
  };

  // Render the locked state promotion container if the user is anonymous
  if (!currentUser) {
    return (
      <div className="post-input-container signed-out-promo">
        <div className="promo-content">
          <div className="promo-icon-wrapper">
            <span className="material-symbols-outlined promo-icon">lock</span>
          </div>
          <div className="promo-text">
            <h3>Join the GDG on Campus PUP Forum</h3>
            <p>Please sign in using the Google button in the top-right corner to post updates, share ideas, and connect with other campus developers.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render text area input form if the user is authenticated
  return (
    <div className="post-input-container">
      <form onSubmit={handleSubmit} className="post-input-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts, ideas, or what you are learning today..."
          className="post-textarea"
          maxLength="280"
        />
        <div className="post-input-footer">
          <span className="char-counter">
            {`${text.length}/280`}
          </span>
          <button type="submit" disabled={!text.trim()} className="btn-post">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

### 5. Files: `src/components/PostList.jsx` & `src/components/PostCard.jsx`
#### What changed and why
We complete the database document deletion handler. `PostList.jsx` houses the main async delete function, validating document existence and calling Firestore's `deleteDoc` targeting the document ID. It maps items without the unused `index` loop variable. `PostCard.jsx` renders individual posts, formats Firestore seconds into human-readable locale formats, and displays the "Delete" button **ONLY** when a user's logged-in UID matches the card's `authorId`. The profile photo uses a custom `.avatar-wrapper` wrapping div with an `.avatar-fallback` containing the capitalized first character of the author's name, and an `onError` trigger to hide broken avatar links.

#### Complete Code for `src/components/PostList.jsx`:
```javascript
import React from 'react';
import PostCard from './PostCard';
// 🌟 Firebase Firestore helper imports for students:
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function PostList({ posts, currentUser }) {
  // Fully implemented delete function passed down to child cards
  const handleDeletePost = async (postId) => {
    // Double confirmation dialog before deleting database records
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      console.log('Delete requested for post ID:', postId);

      // Safe guard for offline demo mode
      if (!db) {
        console.warn('✨ [GDG on Campus PUP] Firestore is not configured. Simulating delete.');
        alert('✨ Post Deleted (Offline Simulation)!');
        return;
      }

      // Perform Firestore Document Deletion targeting the document ref: db → collection name → document ID
      await deleteDoc(doc(db, "posts", postId));
      console.log('✨ [GDG on Campus PUP] Post successfully deleted from Firestore!');
    } catch (error) {
      console.error('🔥 [GDG on Campus PUP] Failed to delete post:', error);
      alert(`❌ Failed to delete post: ${error.message || error}`);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-emoji">🔥</span>
        <h3 className="empty-title">No posts yet.</h3>
        <p className="empty-subtitle">Be the first to share something with the GDG community.</p>
        <div className="empty-dots-row">
          <span className="empty-dot dot-blue"></span>
          <span className="empty-dot dot-red"></span>
          <span className="empty-dot dot-yellow"></span>
          <span className="empty-dot dot-green"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          deletePost={handleDeletePost}
        />
      ))}
    </div>
  );
}
```

#### Complete Code for `src/components/PostCard.jsx`:
```javascript
import React from 'react';

export default function PostCard({ post, currentUser, deletePost }) {
  const handleDelete = () => {
    // Invokes the deletePost handler passed down from PostList
    console.log('Requesting deletion of post:', post.id);
    deletePost(post.id);
  };

  // Safe formatting for date - supports both Firestore Timestamps and dummy string/date data
  const formatTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    if (createdAt.seconds) {
      // It's a Firestore Timestamp
      return new Date(createdAt.seconds * 1000).toLocaleString();
    }
    if (createdAt instanceof Date) {
      return createdAt.toLocaleString();
    }
    return String(createdAt);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-author-info">
          <div className="avatar-wrapper">
            <div className="avatar-fallback">
              {post.authorName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <img
              src={post.authorPhoto}
              alt={post.authorName || 'Anonymous'}
              className="post-author-avatar"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="post-meta">
            <div className="post-meta-row">
              <span className="post-author-name">{post.authorName || 'Anonymous Developer'}</span>
              <span className="post-time">{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {/* Render the delete button ONLY if a user is logged in AND their unique auth UID matches the post's author ID */}
        {currentUser && currentUser.uid === post.authorId && (
          <button className="delete-btn" onClick={handleDelete} title="Delete post">
            Delete
          </button>
        )}
      </div>
      <div className="post-card-body">
        <p className="post-text">{post.text}</p>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Checklist for Instructor

Use this checklist to thoroughly verify that the five target features are working perfectly prior to distributing the starter code:

### 1. How to Test Sign In
- Launch the application locally and check that the signed-out promo box appears correctly in the main content area.
- Click **"Sign in with Google"** in the top right.
- Ensure that the standard Google Accounts OAuth popup windows launch perfectly, letting you input credentials.
- Verify that your user profile name, dynamic avatar thumbnail (or letter fallback if image is blocked), and a "Sign Out" button populate the navbar upon successful completion.

### 2. How to Test Posting
- Verify that the signed-out lock promo has swapped with the fully active textarea text field box.
- Input a test post under 280 characters and verify that the character counter dynamically ticks upward.
- Click **"Post"** and verify that the input text area is instantly cleared.

### 3. How to Test Real-Time Syncing
- Open **two separate browser windows** side-by-side (e.g., standard browser and an Incognito window).
- Log into different Google accounts in each, or keep one logged in and one as an anonymous viewer.
- Create a post in window A.
- Verify that the post instantly streams and appears on the feed in window B **within a fraction of a second, without reloading the page**.

### 4. How to Test Deletion & Security
- Confirm that the small **"Delete"** button appears **ONLY** on post cards authored by your currently authenticated user.
- Verify that you cannot view or click any delete button on posts authored by other developers.
- Click **"Delete"**, accept the browser's confirm warning popup dialog, and verify that the post card is instantly wiped out from all connected client feeds.

### 5. How to Test Sign Out
- Click the **"Sign Out"** link button inside the top-right navbar profile section.
- Ensure your avatar picture and name are immediately cleared from the header, the "Sign in with Google" button renders back, and the feed text input area reverts to the locked promotional state box.

### 6. How to Verify Firestore Data
- Open the [Firebase Console](https://console.firebase.google.com/).
- Navigate to your project → **Build** → **Firestore Database** → **Data** tab.
- Select the `posts` collection and confirm:
  - Document IDs are auto-generated.
  - The document `createdAt` field maps to a valid Firebase server Timestamp.
  - All author information (`authorName`, `authorPhoto`, `authorId`) matches the Google user credentials exactly.
