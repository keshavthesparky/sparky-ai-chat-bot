import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Firebase Auth Initialization
const auth = getAuth();

// Logout Button Event Listener
document.getElementById("logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User Logged Out");
            window.location.href = "index.html";  // Redirect after logout
        })
        .catch(error => console.error("Logout Error:", error.message));
});
