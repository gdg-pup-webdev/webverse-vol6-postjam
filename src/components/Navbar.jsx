import React from 'react';
import gdgLogo from '../assets/gdg-logo.png';
// 🌟 Firebase Auth Imports for Students:
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Navbar({ currentUser }) {
  const handleSignIn = async () => {
    try {
      // TODO: Use signInWithPopup(auth, googleProvider) to sign in
      // Example: await signInWithPopup(auth, googleProvider);
      console.log('Sign in button clicked! Attempting Google Sign-In...');
      if (!auth) {
        console.warn('✨ [GDG on Campus PUP] Authentication is in offline demo mode. Firebase is not configured.');
        alert('✨ Sign-In Attempted!\n\nThis app is running in offline Demo Mode. To connect to your live Firebase project, please configure your .env file with your web app credentials.');
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('🔥 [GDG on Campus PUP] Sign in failed:', error);
      alert(`❌ Sign-in failed: ${error.message || error}`);
    }
  };

  const handleSignOut = async () => {
    try {
      // TODO: Use signOut(auth) to sign out
      // Example: await signOut(auth);
      console.log('Sign out button clicked! Attempting Firebase Sign-Out...');
      if (!auth) {
        console.warn('✨ [GDG on Campus PUP] Authentication is in offline demo mode.');
        return;
      }
      await signOut(auth);
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
