import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ3mlhW8BBhU_cN5ZPM1GkxWG4v55qqzY",
  authDomain: "study-planner-6e461.firebaseapp.com",
  projectId: "study-planner-6e461",
  storageBucket: "study-planner-6e461.appspot.com",
  messagingSenderId: "364632064265",
  appId: "1:364632064265:web:471e3f8481384ce6f193d8",
  measurementId: "G-Z9XSQTDPC3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is already logged in:", user.email);
    window.location.href = "home.html";
  }
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "Please fill in both email and password.";
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    swal({
      title: "Good job!",
      text: "Login successful!!",
      icon: "success",
    });
    console.log("User:", userCredential.user);
    window.location.href = "home.html";
  } catch (error) {
    errorMessage.style.display = "block";
    errorMessage.textContent = error.message;
    console.error("Error:", error);
  }
});
