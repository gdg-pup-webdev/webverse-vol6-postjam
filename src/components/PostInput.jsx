import React, { useState } from 'react';
// 🌟 Firebase Firestore helper imports for students:
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PostInput({ currentUser }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // TODO: Use addDoc(collection(db, "posts"), { ... }) to save the post to Firestore
    // The document should include:
    // - text: text
    // - createdAt: new Date() (or serverTimestamp())
    // - authorName: currentUser.displayName
    // - authorPhoto: currentUser.photoURL
    // - authorId: currentUser.uid
    console.log('Post submitted:', text);

    // Clear input after submission
    setText('');
  };

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
