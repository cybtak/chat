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

// Function to delete a message for the current user only
function deleteMessageForCurrentUser(messageId) {
  const confirmDelete = confirm("Are you sure you want to delete this message?");
  if (confirmDelete) {
    // Remove the message from the database
    set(ref(database, 'messages/' + messageId), null)
      .then(() => console.log('Message deleted successfully!'))
      .catch((error) => console.error('Error deleting message:', error));
  }
}

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
      const messageUserElement = document.createElement('span');
      const deleteForMeButton = document.createElement('button');

      messageContainer.classList.add('message-container');
      messageTextElement.innerText = message.text;
      messageTextElement.style.fontSize = '1em';
      messageTimeElement.innerText = new Date(message.timestamp).toLocaleString();
      messageTimeElement.style.fontSize = '0.8em';
      messageTimeElement.style.color = '#777';
      messageUserElement.innerText = message.username + ': ';
      messageUserElement.style.fontWeight = 'bold';

      deleteForMeButton.innerText = 'Delete';
      deleteForMeButton.addEventListener('click', () => deleteMessageForCurrentUser(key));

      messageContainer.appendChild(messageUserElement);
      messageContainer.appendChild(messageTextElement);
      messageContainer.appendChild(document.createElement('br'));
      messageContainer.appendChild(messageTimeElement);
      messageContainer.appendChild(deleteForMeButton);

      messagesDiv.appendChild(messageContainer);
    }
  }
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Listen for changes in the 'messages' node
const messagesRef = ref(database, 'messages');
onValue(messagesRef, displayMessages);



