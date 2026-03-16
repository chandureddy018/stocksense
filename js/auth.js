import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db } from "./firebase.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Guard: redirect to login if not signed in ──
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      callback(user);
    }
  });
}

// ── Guard: redirect to dashboard if already signed in ──
export function redirectIfAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
  });
}

// ── Sign up ──
export async function signUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  // Create Firestore user document with starting balance
  await setDoc(doc(db, "users", cred.user.uid), {
    displayName,
    email,
    balance: 10000,
    watchlist: ["AAPL", "MSFT", "TSLA"],
    createdAt: serverTimestamp()
  });
  return cred.user;
}

// ── Sign in ──
export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Sign out ──
export async function logOut() {
  await signOut(auth);
  window.location.href = "index.html";
}

// ── Get current user data from Firestore ──
export async function getUserData(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ── Populate sidebar user info ──
export function populateSidebarUser(user) {
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const avatarEl = document.getElementById("user-avatar");
  if (nameEl) nameEl.textContent = user.displayName || "User";
  if (emailEl) emailEl.textContent = user.email;
  if (avatarEl) avatarEl.textContent = (user.displayName || user.email || "U")[0].toUpperCase();
}
