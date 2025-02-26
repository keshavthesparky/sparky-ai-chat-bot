import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ Firebase Configuration
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

// ✅ Firebase Initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ History List Element
const historyList = document.getElementById("history-list");

// ✅ Function to Load Chat History
async function loadChatHistory(user) {
    if (!user) {
        console.log("No user logged in");
        return;
    }

    try {
        // 🔥 Firestore Query (Check if "userId" field exists in Firestore)
        const q = query(collection(db, "chats"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        // ✅ Debugging: Check if any chats are fetched
        console.log("Fetched Chats:", querySnapshot.size);

        // ✅ Clear previous history
        historyList.innerHTML = "";

        if (querySnapshot.empty) {
            historyList.innerHTML = "<li>No chat history found.</li>";
            return;
        }

        // ✅ Loop through fetched history and display
        querySnapshot.forEach(doc => {
            console.log("Chat Data:", doc.data()); // ✅ Debugging Step
            const chatData = doc.data();
            const li = document.createElement("li");
            li.textContent = chatData.userMessage || "No message";
            li.addEventListener("click", () => {
                window.location.href = "chat.html?chatId=" + doc.id;
            });
            historyList.appendChild(li);
        });

    } catch (error) {
        console.error("❌ Error Fetching Chat History:", error);
    }
}

// ✅ Check if user is authenticated
onAuthStateChanged(auth, user => {
    if (user) {
        loadChatHistory(user);
    } else {
        window.location.href = "index.html"; // 🔥 Redirect to login page if not logged in
    }
});
