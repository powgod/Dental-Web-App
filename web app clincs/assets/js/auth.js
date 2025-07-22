// auth.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  // Convert username to email
  const email = `${username}@gmail.com`; // assuming you created user like 'admin@clinic.com' in Firebase

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Success
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      window.location.href = "index.html";
    })
    .catch((error) => {
      errorMsg.textContent = "⚠️ " + error.message;
    });
});
