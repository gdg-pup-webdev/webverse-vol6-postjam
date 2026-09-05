# Webverse Vol. 6: Supercharging Your Apps with Google Firebase

[![Status: Archive](https://img.shields.io/badge/Status-Archive-lightgrey)](docs/state.md)
[![Stack: Firebase](https://img.shields.io/badge/Stack-Firebase-black)](#about)
[![FMD philosophy: 1.31.0](https://img.shields.io/badge/FMD%20philosophy-1.31.0-blue)](AGENTS.md)


## Post-Jam Study Jam Activity: GDGCoC PUP Forum 🇵🇭
### Google Developer Groups on Campus - PUP

Welcome, Cadets! 🚀 You've just learned the fundamentals of **Google Firebase** in today's Webverse Study Jam. Now, it's time to put that knowledge into action! 💻🔥

In this post-jam activity, your task is to turn this beautiful, fully styled mock React interface into a real-time, functioning social microblogging wall. The UI is completely ready, styled to match the official **Google for Developers** light theme, and all Firebase logic is stubbed out with `TODO` comments. Your mission is to connect it to your own Firebase project and implement the database and authentication features!

## Table of Contents

- [About](#about)
- [Start here](#start-here)
- [Your Mission](#your-mission)
- [Quick start](#quick-start)
- [File Structure](#file-structure)
- [Features to Implement](#features-to-implement)
- [Firestore Data Structure](#firestore-data-structure)
- [Key Concepts Recap](#key-concepts-recap)
- [Practical Coding Tips](#practical-coding-tips)
- [Success Criteria](#success-criteria)
- [Official Resources](#official-resources)
- [Documentation](#documentation)
- [Contributors](#contributors)

## About

Post-jam Firebase activity for Webverse Vol. 6 at GDG on Campus PUP. Learners wire Google Sign-In and Cloud Firestore into a pre-styled React forum so posts stream in real time. Aimed at cadets who finished the study jam and want hands-on practice.

## Start here

- **Humans:** this README, then [docs/state.md](docs/state.md)
- **Agents:** [AGENTS.md](AGENTS.md) (state → index → FLAGS)
- **Contributors:** table below

## Your Mission

You are building the **GDGCoC PUP Forum**, a real-time student discussion board. By completing today's mission, you will build:

1. **Google Sign-In Authentication** so developers can log in with their secure Google accounts.
2. **Firestore Real-Time Queries** to stream and show new discussion posts instantly as they are written.
3. **Firestore Writes** to allow signed-in users to share posts up to 280 characters.
4. **Interactive Deletion** to allow authors to delete their own cards seamlessly.

Let's get code supercharged! ⚡

## Quick start

> [!NOTE]
> You will need your own **Google Account** and a new **Firebase Project** to complete this activity.

### Step 1: Clone the Repository

Clone this starter code to your local machine:

```bash
git clone https://github.com/gdg-pup-webdev/webverse-vol6-postjam.git
cd webverse-vol6-postjam
```

### Step 2: Install Dependencies

Install all the npm packages needed:

```bash
npm install
```

### Step 3: Copy & Setup your Environment

Copy the example environment template to an active environment file based on your operating system:

* **For macOS / Linux / Windows (PowerShell):**
  ```bash
  cp .env.example .env
  ```
* **For Windows (Command Prompt / CMD):**
  ```cmd
  copy .env.example .env
  ```

Open your newly created `.env` file and replace the placeholders with your Firebase Web App credentials. Keep secrets local; see [FLAGS.md](FLAGS.md) for known gaps.

### Step 4: Get your Firebase Configuration

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `social-wall-ph`.
3. In your project dashboard, click the **Web icon (`</>`)** to register a new Web App.
4. Copy the keys and fields from the `firebaseConfig` object and paste them into your `.env` file.

### Step 5: Enable Firebase Services

Make sure these two services are enabled in your Firebase console:

1. **Firebase Authentication:**
   * Go to **Build** → **Authentication** → **Get Started**.
   * Under the **Sign-in method** tab, click **Add new provider** and select **Google**.
   * Enable it, select your project support email, and save!
2. **Cloud Firestore:**
   * Go to **Build** → **Firestore Database** → **Create Database**.
   * Choose your location, select **Start in Test Mode** (to allow reads and writes during development), and click **Create**.

### Step 6: Start your Development Server

Run the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to see your application!

## File Structure

This is the codebase you will be working with. You only need to touch the files with the `TODO` stubs:

```text
src/
├── App.jsx            <-- EDIT HERE: Implement onAuthStateChanged & onSnapshot
├── main.jsx
├── App.css
├── firebase.js        <-- Auto-configures and reads keys from .env
└── components/
    ├── Navbar.jsx     <-- EDIT HERE: Implement Google Sign-In & Sign-Out
    ├── PostInput.jsx  <-- EDIT HERE: Implement Firestore addDoc
    ├── PostList.jsx   <-- EDIT HERE: Implement Firestore deleteDoc
    └── PostCard.jsx   <-- Renders each post and handles delete triggers
```

## Features to Implement

Here are the 5 features you need to complete. Open each file, locate the `TODO` comments, and implement the logic using the hints below!

### Feature 1: Google Sign-In & Sign-Out

* **What it does:** Allows users to log in with their Google accounts using a popup window, and safely log out when they are done.
* **What you'll practice:** `signInWithPopup`, `signOut`, and `GoogleAuthProvider`.
* **File to edit:** `src/components/Navbar.jsx`
* **Hint:**

```javascript
// Use the pre-imported auth and googleProvider to trigger a popup:
await signInWithPopup(auth, googleProvider);

// Use signOut to log out:
await signOut(auth);
```

### Feature 2: Real-Time Authentication State

* **What it does:** Listens to authentication state changes to keep the app synchronized when a user logs in or logs out.
* **What you'll practice:** `onAuthStateChanged` hook listener.
* **File to edit:** `src/App.jsx`
* **Hint:**

```javascript
// Inside your useEffect hook, subscribe to auth state updates:
const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) {
    setCurrentUser(user);
  } else {
    setCurrentUser(null);
  }
});
return () => unsubscribe(); // Always return the unsubscribe function for cleanup!
```

### Feature 3: User Profile in Navbar

* **What it does:** Dynamically renders the logged-in developer's name, profile avatar, and sign-out buttons in the navbar.
* **What you'll practice:** Reading user profile attributes from the Firebase `User` object.
* **File to edit:** `src/components/Navbar.jsx`
* **Hint:**

```javascript
// The currentUser object has attributes like:
const name = currentUser.displayName;
const photo = currentUser.photoURL;
const uid = currentUser.uid;
```

### Feature 4: Save a Post to Firestore

* **What it does:** Saves a new post to the database under the `posts` collection when a logged-in user clicks "Post".
* **What you'll practice:** `collection`, `addDoc`, and `serverTimestamp`.
* **File to edit:** `src/components/PostInput.jsx`
* **Hint:**

```javascript
// Save the document to your "posts" collection with author information:
await addDoc(collection(db, "posts"), {
  text: text,
  createdAt: serverTimestamp(), // Best practice: use server-time timestamps!
  authorName: currentUser.displayName,
  authorPhoto: currentUser.photoURL,
  authorId: currentUser.uid
});
```

### Feature 5: Real-Time Posts Feed & Deletion

* **What it does:** Feeds the microblog posts in real-time sorted by newest first, and allows users to delete their own posts.
* **What you'll practice:** `onSnapshot`, `query`, `orderBy`, `doc`, and `deleteDoc`.
* **Files to edit:**
  * `src/App.jsx` (for real-time listener)
  * `src/components/PostList.jsx` (for post deletion)
* **Hints:**

```javascript
// 1. In src/App.jsx (real-time stream):
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  const postsList = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setPosts(postsList);
});

// 2. In src/components/PostList.jsx (deletion):
await deleteDoc(doc(db, "posts", postId));
```

## Firestore Data Structure

Here is how your Cloud Firestore schema will look in the database console. When saving posts, make sure the field names match this tree exactly:

```text
posts/ (Collection)
 └── {postId}/ (Document with unique ID)
      ├── text: "Welcome to the GDG Study Jam!" (String)
      ├── createdAt: serverTimestamp() (Timestamp)
      ├── authorName: "Juan dela Cruz" (String)
      ├── authorPhoto: "https://lh3.googleusercontent.com/..." (String)
      └── authorId: "abc123userUid" (String)
```

## Key Concepts Recap

| Firebase function | What it does | Package |
| :--- | :--- | :--- |
| `signInWithPopup` | Launches a Google OAuth sign-in flow inside a popup window | `firebase/auth` |
| `signOut` | Signs out the current user and clears session tokens | `firebase/auth` |
| `onAuthStateChanged` | Listens to sign-in and sign-out changes in real time | `firebase/auth` |
| `addDoc` | Adds a new document to a collection with an auto-generated ID | `firebase/firestore` |
| `deleteDoc` | Deletes a specific document from a collection | `firebase/firestore` |
| `onSnapshot` | Listens to real-time additions, updates, and deletes in a query | `firebase/firestore` |
| `serverTimestamp` | Generates a clean timestamp based on Google's cloud servers | `firebase/firestore` |

## Practical Coding Tips

1. **Clean up Listeners:** Always return the `unsubscribe()` function inside your `useEffect` hooks. This stops active Firestore connections when components unmount, avoiding data leaks.
2. **Secure UI rendering:** Check if `currentUser` is present before letting users post. In `PostCard.jsx`, use `{currentUser && currentUser.uid === post.authorId && ...}` to display the delete button ONLY on posts created by the logged-in user!
3. **Handle Null Values:** When rendering user photos, use standard fallbacks like `src={currentUser.photoURL || 'https://via.placeholder.com/150'}` in case a profile picture fails to fetch.
4. **Use Test Mode Wisely:** Setting Firestore to test mode allows easy local testing, but make sure to change rules to restrict write access to authenticated users before sharing!
5. **Inspect Console Logs:** Use your browser's Developer Tools (`F12`) → **Console** to track helpful debugging logs we set up.

## Success Criteria

Complete these checkpoints to confirm your GDGCoC PUP Forum is fully functioning:

- [ ] App launches locally without compiler warnings or console errors.
- [ ] Clicking **"Sign in with Google"** opens the Google auth window and displays your user avatar in the navbar upon success.
- [ ] The post input text area is hidden for anonymous guests and displays a beautiful "Sign in to post" promo.
- [ ] Signed-in users can write a post, click **"Post"**, and see it instantly appear on the feed without page reloads.
- [ ] Post feed is sorted with the newest post appearing at the very top.
- [ ] Signed-in users see a "Delete" button **ONLY** on their own posts, and clicking it deletes the post in real-time.
- [ ] Clicking **"Sign Out"** logs the user out and updates the layout immediately.

## Official Resources

* [Google Firebase Documentation](https://firebase.google.com/docs)
* [Get Started with Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
* [Get Started with Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
* [React + Firebase Crash Course Reference](https://developers.google.com)

### Happy Coding, PUP Cadets!

Let's build something awesome, supercharge our skills, and grow together with the GDG community! 🚀🌟
#GDGonCampusPUP #Webverse2026 #FirebaseStudyJam

## Documentation

| Doc | Purpose |
|-----|---------|
| [State](docs/state.md) | Teaching position / handover |
| [Index](docs/index.md) | Doc inventory |
| [FLAGS](FLAGS.md) | Improvement register |
| [AGENTS](AGENTS.md) | Agent load order |

## Contributors

This project is made possible by the GDG PUP community.

| Name | Role | GitHub |
| --- | --- | --- |
| [Carlos Jerico Dela Torre](https://www.linkedin.com/in/delatorrecj) | Chief Technology Officer (2025-2026) | [@delatorrecj](https://github.com/delatorrecj) |
| hanji-exe | Development |  |

