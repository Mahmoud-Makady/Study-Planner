import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZ3mlhW8BBhU_cN5ZPM1GkxWG4v55qqzY",
  authDomain: "study-planner-6e461.firebaseapp.com",
  projectId: "study-planner-6e461",
  storageBucket: "study-planner-6e461.appspot.com",
  messagingSenderId: "364632064265",
  appId: "1:364632064265:web:471e3f8481384ce6f193d8",
  measurementId: "G-Z9XSQTDPC3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("signUpForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    // alert("Account created and data stored successfully!");
    swal({
      title: "Good job!",
      text: "Account created and data stored successfully!",
      icon: "success",
    });
    console.log("User:", user);
    window.location.href = "index.html";
  } catch (error) {
    // alert("Error: " + error.message);
    swal({
      title: "Oops!",
      text: "Error: " + error.message,
      icon: "error",
    });
    console.error("Error:", error);
  }
});
