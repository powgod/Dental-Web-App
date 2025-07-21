document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // For now: hardcoded credentials (replace with backend call later)
  if (username === "admin" && password === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html"; // redirect to your dashboard
  } else {
    errorMsg.textContent = "Invalid username or password.";
  }
});
