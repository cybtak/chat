// chat.js

// Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2TH9qGyal9QJShAuXq_9qB4VU9OoRb6k",
  authDomain: "chat-ba118.firebaseapp.com",
  projectId: "chat-ba118",
  storageBucket: "chat-ba118.appspot.com",
  messagingSenderId: "86144645058",
  appId: "1:86144645058:web:78c178cfa22951bb3f085b",
  measurementId: "G-JGYN2424Y7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const usernameInput = document.getElementById('usernameInput');
  
  const message = messageInput.value;
  const username = usernameInput.value;

  if (username.trim() !== '' && message.trim() !== '') {
    set(ref(database, 'messages/' + Date.now()), {
      username: username, // Store username in the database
      text: message,
      timestamp: new Date().toISOString()
    }).then(() => {
      console.log('Message sent successfully!');
      messageInput.value = ''; // Clear input field after sending
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  }
}

// Function to send an emoji
function sendEmoji(emoji) {
  const messageInput = document.getElementById('messageInput');
  messageInput.value += emoji; // Append the selected emoji to the input field
}

// Attach event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('emojiButton').addEventListener('click', () => {
  // You can implement your own emoji picker functionality here
  // For simplicity, let's just send a 😄 emoji for now
  sendEmoji('😄');
});

// Function to display messages
function displayMessages(data) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear existing messages
    const messages = data.val();
    for (const key in messages) {
      if (Object.hasOwnProperty.call(messages, key)) {
        const message = messages[key];
        const messageContainer = document.createElement('div');
        const messageTextElement = document.createElement('span');
        const messageTimeElement = document.createElement('span');
        const messageUserElement = document.createElement('span'); // New element for displaying username

        messageContainer.classList.add('message-container'); // Add a class for styling
        messageTextElement.innerText = message.text;
        
        // Styling for message text
        messageTextElement.style.fontSize = '1em';
  
        // Styling for message timestamp
        messageTimeElement.innerText = new Date(message.timestamp).toLocaleString();
        messageTimeElement.style.fontSize = '0.8em'; // Decrease font size
        messageTimeElement.style.color = '#777'; // Change font color

        // Display username
        messageUserElement.innerText = message.username + ': ';
        messageUserElement.style.fontWeight = 'bold';
        
        messageContainer.appendChild(messageUserElement); // Append username
        messageContainer.appendChild(messageTextElement);
        messageContainer.appendChild(document.createElement('br')); // Line break
        messageContainer.appendChild(messageTimeElement);
  
        messagesDiv.appendChild(messageContainer);
      }
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom after new messages are added
  }

// Listen for changes in the 'messages' node
const messagesRef = ref(database, 'messages');
onValue(messagesRef, displayMessages);
