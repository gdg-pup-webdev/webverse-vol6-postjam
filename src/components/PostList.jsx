import React from 'react';
import PostCard from './PostCard';
// 🌟 Firebase Firestore helper imports for students:
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function PostList({ posts, currentUser }) {
  // Stubbed delete function to pass down to children cards
  const handleDeletePost = async (postId) => {
    // TODO: Use deleteDoc(doc(db, "posts", postId)) to delete the post from Firestore
    console.log('Delete requested for post ID:', postId);
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
