import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─────────────────────────────────────────────
// REPLACE these values with your own Firebase project config.
// Go to: https://console.firebase.google.com
// → Your Project → Project Settings → Your Apps → Web App → Config
// ─────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyD2RFaPj-J2p5_WZAuasE3qzZSlqwjllJU",
    authDomain: "stocksense-860a5.firebaseapp.com",
    databaseURL: "https://stocksense-860a5-default-rtdb.firebaseio.com",
    projectId: "stocksense-860a5",
    storageBucket: "stocksense-860a5.firebasestorage.app",
    messagingSenderId: "994981922192",
    appId: "1:994981922192:web:ec5e09e765d5fcaaf49f15",
    measurementId: "G-HZQQG8QECL"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
