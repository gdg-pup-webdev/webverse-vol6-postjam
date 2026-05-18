import React from 'react';

export default function PostCard({ post, currentUser, deletePost }) {
  const handleDelete = () => {
    // TODO: Call the deletePost function (which will invoke deleteDoc in parent/App component)
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
