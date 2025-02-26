// Firebase SDKs ko import karna
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxMx6Z2mw3dUilPF9QW7oPjXtCRLEHxGg",
    authDomain: "chatbot55.firebaseapp.com",
    databaseURL: "https://chatbot55-default-rtdb.firebaseio.com",
    projectId: "chatbot55",
    storageBucket: "chatbot55.firebasestorage.app",
    messagingSenderId: "98205443506",
    appId: "1:98205443506:web:3b2c3cab647621f43670ab",
    measurementId: "G-Q914QY8EW2"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up function
document.getElementById('signup-button').addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => alert('Signup successful!'))
        .catch(error => alert('Signup error: ' + error.message));
});

// Sign in function
document.getElementById('signin-button').addEventListener('click', () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = 'chat.html')
        .catch(error => alert('Signin error: ' + error.message));
});

// Logout function ✅ Fix applied
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {  // Check if button exists
        logoutBtn.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    console.log("User Logged Out Successfully");
                    window.location.href = "index.html"; // Redirect to login page
                })
                .catch(error => {
                    console.error("Logout Error:", error.message);
                    alert("Logout Failed: " + error.message);  // Show error to user
                });
        });
    }
});

// Authentication state listener
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = 'index.html';
    }
});
