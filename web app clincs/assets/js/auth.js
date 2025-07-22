// assets/js/auth.js
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html"; // redirect after login
    })
    .catch((error) => {
      errorMsg.textContent = "❌ " + error.message;
    });
});
