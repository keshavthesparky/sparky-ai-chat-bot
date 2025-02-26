// 🔥 Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

// 🔥 **Firebase Config**
const firebaseConfig = {
    apiKey: "AIzaSyDxMx6Z2mw3dUilPF9QW7oPjXtCRLEHxGg",
    authDomain: "chatbot55.firebaseapp.com",
    databaseURL: "https://chatbot55-default-rtdb.firebaseio.com",
    projectId: "chatbot55",
    storageBucket: "chatbot55.appspot.com",
    messagingSenderId: "98205443506",
    appId: "1:98205443506:web:3b2c3cab647621f43670ab",
    measurementId: "G-Q914QY8EW2"
};

// 🔥 **Initialize Firebase**
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const analytics = getAnalytics(app);

// 🟢 **DOM Elements**
const chatContainer = document.querySelector(".chat-container");
const submitButton = document.getElementById("submit");
const promptInput = document.getElementById("prompt");
const imageButton = document.getElementById("image");
const imageInput = document.getElementById("image-input");
const microphoneButton = document.getElementById("microphone-button");

const apiKey = "AIzaSyAlg-et9LOZZm98HRxVproqXDqN0NCmvLQ";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

// ✅ **Submit Button Fixed**
document.addEventListener("DOMContentLoaded", () => {
    if (!submitButton || !promptInput) {
        console.error("❌ Submit button or input field not found!");
        return;
    }

    submitButton.addEventListener("click", () => {
        const userMessage = promptInput.value.trim();
        if (userMessage) {
            generateResponse(userMessage);
            saveChatToFirebase(userMessage);
            promptInput.value = "";
        }
    });

    // ✅ **Fix: Enter Key Submission**
    promptInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitButton.click();
        }
    });
});

// ✅ **Fix: Show "Typing..." Before AI Response**
async function generateResponse(userMessage) {
    chatContainer.innerHTML += `
        <div class="user-chat-box">
            <img src="image/user-286.png" alt="User" class="chat-avatar">
            <div class="user-chat-area">${userMessage}</div>
        </div>
    `;

    // **Show Typing Animation**
    let typingElement = document.createElement("div");
    typingElement.classList.add("ai-chat-box");
    typingElement.innerHTML = `
        <img src="image/cg.png" alt="AI" class="chat-avatar">
        <div class="ai-chat-area">Typing...</div>
    `;
    chatContainer.appendChild(typingElement);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            }),
        });

        const data = await response.json();
        if (!data || !data.candidates || data.candidates.length === 0) {
            throw new Error("No AI response received");
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // **Remove Typing Animation**
        typingElement.remove();

        // **Show AI Response**
        chatContainer.innerHTML += `
            <div class="ai-chat-box">
                <img src="image/cg.png" alt="AI" class="chat-avatar">
                <div class="ai-chat-area">${aiResponse}</div>
            </div>
        `;

        saveChatToFirebase(userMessage, aiResponse);
    } catch (error) {
        console.error("❌ API Error:", error);
        
        // **Remove Typing Animation**
        typingElement.remove();
        
        chatContainer.innerHTML += `<div class="ai-chat-box">❌ Error fetching response.</div>`;
    }
}

// ✅ **Fix: Save Chat to Firebase**
async function saveChatToFirebase(userMessage, aiResponse = "") {
    const chatId = localStorage.getItem("currentChatId") || Date.now().toString();
    localStorage.setItem("currentChatId", chatId);

    try {
        await setDoc(doc(db, "chats", chatId), {
            userMessage,
            aiResponse,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Firebase Save Error:", error);
    }
}


// ✅ **Fix: Image Upload**
imageButton.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        chatContainer.innerHTML += `
            <div class="user-chat-box">
                <img src="image/user-286.png" alt="User" class="chat-avatar">
                <div class="user-chat-area">
                    <img src="${e.target.result}" class="uploaded-image"/>
                </div>
            </div>
        `;

        saveChatToFirebase("[Image uploaded]");
        generateResponse("[Image uploaded]");
    };
    reader.readAsDataURL(file);
});

// ✅ **Fix: Microphone Speech Recognition**
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    microphoneButton.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        promptInput.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
} else {
    console.warn('Speech recognition not supported.');
}
