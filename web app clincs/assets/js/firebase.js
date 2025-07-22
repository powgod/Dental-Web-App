  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAGOe-Ug2Qqbzmz1ahgR_EYSaboJZL4q4k",
    authDomain: "tmdental-e1f29.firebaseapp.com",
    projectId: "tmdental-e1f29",
    storageBucket: "tmdental-e1f29.firebasestorage.app",
    messagingSenderId: "1052208338704",
    appId: "1:1052208338704:web:02078ac9f0bf3b188c3795",
    measurementId: "G-L5BXJR7GFZ"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
