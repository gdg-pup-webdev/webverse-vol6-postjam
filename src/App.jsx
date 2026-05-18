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
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  // 1. Authentication State
  // TIP: Set to a mock user object to test logged-in UI:
  // { uid: 'gdg-student-uid', displayName: 'Juan dela Cruz', photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c' }
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Posts State (Hardcoded with 2 sample posts so the UI is immediately visible)
  const [posts, setPosts] = useState([
    {
      id: 'sample-1',
      text: "Welcome to the GDG on Campus PUP Forum! 🇵🇭 Build your own real-time microblogging feed using React + Firebase Firestore in today's GDG Study Jam. Happy coding! 💻🔥",
      createdAt: '5/19/2026, 10:00:00 AM',
      authorName: 'GDG Lead Organizer',
      authorPhoto: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      authorId: 'admin-uid'
    },
    {
      id: 'sample-2',
      text: "Super excited to learn Firestore real-time updates and Google Authentication today! This Google-inspired Material design looks incredibly premium. 🚀✨",
      createdAt: '5/19/2026, 10:15:00 AM',
      authorName: 'GDG Jammer',
      authorPhoto: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      authorId: 'jammer-uid'
    }
  ]);

  // 3. Authentication state listener placeholder
  useEffect(() => {
    // TODO: Write onAuthStateChanged listener to track sign-in/out status
    // Example:
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setCurrentUser(user);
    // });
    // return () => unsubscribe();
    
    console.log('Firebase Auth state listener mounted! Stub active.');
  }, []);

  // 4. Firestore Listener logic placeholder
  useEffect(() => {
    // TODO: Write onSnapshot listener inside today's activity
    // example query: query(collection(db, "posts"), orderBy("createdAt", "desc"))
    
    console.log('Firestore posts real-time listener mounted! Stub active.');
    
    // Return unsubscribe cleanup function when implemented
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
        
        {/* Glow circles behind black hero (Image 4 request) */}
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
