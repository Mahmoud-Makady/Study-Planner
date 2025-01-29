import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  onSnapshot,
  query,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZ3mlhW8BBhU_cN5ZPM1GkxWG4v55qqzY",
  authDomain: "study-planner-6e461.firebaseapp.com",
  projectId: "study-planner-6e461",
  storageBucket: "study-planner-6e461.firebasestorage.app",
  messagingSenderId: "364632064265",
  appId: "1:364632064265:web:471e3f8481384ce6f193d8",
  measurementId: "G-Z9XSQTDPC3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const todosCollection = collection(db, "todos");

const subject = document.getElementById("subject");
const titleError = document.getElementById("titleError");
const description = document.getElementById("description");
const descError = document.getElementById("descError");
const todoContainer = document.getElementById("todoContainer");
const addButton = document.getElementById("add");
let currentCard = null;
window.subjectValid = subjectValid;
function subjectValid() {
  const subjectRegEx = /^[A-Za-z ]{3,}$/;
  if (subjectRegEx.test(subject.value)) {
    titleError.classList.add("d-none");
    return true;
  } else {
    titleError.classList.remove("d-none");
    return false;
  }
}
window.descValid = descValid;
function descValid() {
  const descRegEx = /^.{15,}$/;
  if (descRegEx.test(description.value)) {
    descError.classList.add("d-none");
    return true;
  } else {
    descError.classList.remove("d-none");
    return false;
  }
}

function renderTodo(docId, subject, description, hours, date, completed) {
  const card = document.createElement("div");
  card.className = "todoCard py-4 px-3";

  const row = document.createElement("div");
  row.classList.add("row");

  const col9 = document.createElement("div");
  col9.className = "col-9";

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = subject;
  col9.appendChild(cardTitle);

  const hoursNeeded = document.createElement("p");
  hoursNeeded.textContent = `Needed hours: ${hours} hours`;
  col9.appendChild(hoursNeeded);

  const examDate = document.createElement("p");
  examDate.textContent = `Exam Date: ${date}`;
  col9.appendChild(examDate);

  const cardDescription = document.createElement("p");
  cardDescription.textContent = description;
  col9.appendChild(cardDescription);

  const taskStatus = document.createElement("p");
  taskStatus.textContent = completed
    ? "Status: Completed"
    : "Status: In progress";
  taskStatus.style.fontWeight = "bold";
  taskStatus.style.color = completed ? "green" : "red";
  col9.appendChild(taskStatus);

  const col3 = document.createElement("div");
  col3.className = "col-3 actions";

  const check = document.createElement("a");
  check.href = "#";
  const checkIcon = document.createElement("i");
  checkIcon.className = "fa-solid fa-check";
  check.appendChild(checkIcon);

  check.addEventListener("click", async () => {
    completed = !completed;
    await updateDoc(doc(todosCollection, docId), { completed });
    card.style.backgroundColor = completed ? "#4caf50" : "";
    cardTitle.style.textDecoration = completed ? "line-through" : "none";
    cardDescription.style.textDecoration = completed ? "line-through" : "none";
    taskStatus.textContent = completed
      ? "Status: Completed"
      : "Status: In Progress";
    taskStatus.style.color = completed ? "green" : "red";
  });

  const edit = document.createElement("a");
  edit.href = "#";
  const editIcon = document.createElement("i");
  editIcon.className = "fa-solid fa-pencil";
  edit.appendChild(editIcon);

  edit.addEventListener("click", () => {
    document.getElementById("subject").value = subject;
    document.getElementById("description").value = description;
    document.getElementById("hours").value = hours;
    document.getElementById("date").value = date;
    addButton.textContent = "Update";
    currentCard = { docId, cardTitle, cardDescription };
  });

  const deleteLink = document.createElement("a");
  deleteLink.href = "#";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash";
  deleteLink.appendChild(deleteIcon);

  // deleteLink.addEventListener("click", async () => {
  //   await deleteDoc(doc(todosCollection, docId));
  //   swal({
  //     title: "Deleted!",
  //     text: "Todo deleted successfully!",
  //     icon: "warning",
  //   })
    
  //   card.remove();
    
  // });
  deleteLink.addEventListener("click", async () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this todo!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteDoc(doc(todosCollection, docId));
        card.remove();
        swal("Deleted!", "Todo deleted successfully!", "success");
      }
    });
  });
  

  col3.appendChild(check);
  col3.appendChild(edit);
  col3.appendChild(deleteLink);

  row.appendChild(col9);
  row.appendChild(col3);

  card.appendChild(row);

  todoContainer.appendChild(card);
}
window.addTodo = addTodo;
async function addTodo(event) {
  event.preventDefault();
  const subjectValue = subject.value;
  const hoursValue = document.getElementById("hours").value;
  const dateValue = document.getElementById("date").value;
  const descriptionValue = description.value;

  if (!subjectValue || !hoursValue || !dateValue || !descriptionValue) {
    swal({
      title: "Hey You!",
      text: "Please fill in all the fields.",
      icon: "error",
    });
    return;
  }

  try {
    const userId = getAuth().currentUser.uid;
    if (currentCard) {
      await updateDoc(doc(todosCollection, currentCard.docId), {
        subject: subjectValue,
        hours: hoursValue,
        date: dateValue,
        description: descriptionValue,
      });
      currentCard.cardTitle.textContent = subjectValue;
      currentCard.cardDescription.textContent = descriptionValue;
      swal({
        title: "Good job!",
        text: "Todo updated successfully!",
        icon: "success",
      });
      addButton.textContent = "Add";
      currentCard = null;
    } else {
      // await addDoc(todosCollection, {
      //   subject: subjectValue,
      //   hours: hoursValue,
      //   date: dateValue,
      //   description: descriptionValue,
      //   completed: false,
      //   ownerId: userId,
      // });
      // swal({
      //   title: "Good job!",
      //   text: "Todo added successfully!",
      //   icon: "success",
      // });
      swal({
        title: "Confirm Addition",
        text: "Are you sure you want to add this todo?",
        icon: "info",
        buttons: true,
      }).then(async (willAdd) => {
        if (willAdd) {
          await addDoc(todosCollection, {
            subject: subjectValue,
            hours: hoursValue,
            date: dateValue,
            description: descriptionValue,
            completed: false,
            ownerId: userId,
          });
          swal("Success!", "Todo added successfully!", "success");
      
          // تفريغ الحقول بعد الإضافة
          subject.value = "";
          document.getElementById("hours").value = "";
          document.getElementById("date").value = "";
          description.value = "";
        }
      });
      
    }
    subject.value = "";
    document.getElementById("hours").value = "";
    document.getElementById("date").value = "";
    description.value = "";
  } catch (error) {
    console.error("Error adding or updating document: ", error);
    swal({
      title: "Oops!",
      text: "Failed to process the todo. Please try again.",
      icon: "error",
    });
  }
}

async function loadTodosRealtime() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found.");
    return;
  }

  const userId = user.uid;
  const q = query(todosCollection, where("ownerId", "==", userId));
  onSnapshot(q, (querySnapshot) => {
    todoContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      renderTodo(
        doc.id,
        data.subject,
        data.description,
        data.hours,
        data.date,
        data.completed
      );
    });
  });
}



const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadTodosRealtime();
  } else {
    window.location.href = "index.html";
  }
});

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      swal({
        title: "Good bye!",
        text: "Logged out successfully!",
        icon: "success",
      });
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  });
}
