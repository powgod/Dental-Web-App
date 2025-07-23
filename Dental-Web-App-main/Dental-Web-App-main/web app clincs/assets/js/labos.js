
const uid = localStorage.getItem("uid");
if (!uid) {
  alert("User not logged in");
  window.location.href = "login.html"; // or redirect to login
}

const db = firebase.database();
const labosRef = db.ref('labos/' + uid);

const laboForm = document.getElementById("laboForm");
const laboTableBody = document.querySelector("#laboTable tbody");

let labos = {};
let editingLaboKey = null;

// Validate function stays the same
function validateLaboData(data) {
  if (!data.name.trim()) {
    alert("Please enter the labo name.");
    return false;
  }
  if (isNaN(data.price) || data.price < 0) {
    alert("Please enter a valid positive labo price.");
    return false;
  }
  if (!data.date) {
    alert("Please select the labo date.");
    return false;
  }
  if (!data.status) {
    alert("Please select labo status.");
    return false;
  }
  if (!data.sendDate) {
    alert("Please select the labo send date.");
    return false;
  }
  return true;
}

function renderLabos() {
  laboTableBody.innerHTML = "";
  Object.entries(labos).forEach(([key, l]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.name}</td>
      <td>${Number(l.price).toFixed(2)}</td>
      <td>${l.date}</td>
      <td>${l.status}</td>
      <td>${l.sendDate}</td>
      <td>${l.note || ""}</td>
      <td>
        <button class="edit-btn" onclick="editLabo('${key}')">✏️</button>
        <button class="delete-btn" onclick="deleteLabo('${key}')">🗑️</button>
      </td>`;
    laboTableBody.appendChild(tr);
  });
}

// Edit a labo entry
window.editLabo = function(key) {
  const l = labos[key];
  editingLaboKey = key;
  laboForm.laboName.value = l.name;
  laboForm.laboPrice.value = l.price;
  laboForm.laboDate.value = l.date;
  laboForm.laboStatus.value = l.status;
  laboForm.laboSendDate.value = l.sendDate;
  laboForm.laboNote.value = l.note || "";

  laboForm.querySelector("button[type='submit']").textContent = "Update Labo";
};

// Delete a labo entry
window.deleteLabo = function(key) {
  if (confirm("Are you sure you want to delete this labo entry?")) {
    labosRef.child(key).remove()
      .then(() => alert("Labo entry deleted successfully."))
      .catch(err => alert("Error deleting labo: " + err.message));
  }
};

function resetLaboForm() {
  laboForm.reset();
  editingLaboKey = null;
  laboForm.querySelector("button[type='submit']").textContent = "Add Labo";
}

laboForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newLabo = {
    name: laboForm.laboName.value.trim(),
    price: parseFloat(laboForm.laboPrice.value),
    date: laboForm.laboDate.value,
    status: laboForm.laboStatus.value,
    sendDate: laboForm.laboSendDate.value,
    note: laboForm.laboNote.value.trim()
  };

  if (!validateLaboData(newLabo)) return;

  if (editingLaboKey) {
    // Update existing labo in Firebase
    labosRef.child(editingLaboKey).set(newLabo)
      .then(() => {
        alert("Labo entry updated successfully.");
        resetLaboForm();
      })
      .catch(err => alert("Error updating labo: " + err.message));
  } else {
    // Add new labo to Firebase
    labosRef.push(newLabo)
      .then(() => {
        alert("Labo entry added successfully.");
        resetLaboForm();
      })
      .catch(err => alert("Error adding labo: " + err.message));
  }
});

// Listen for realtime updates to labos
labosRef.on('value', (snapshot) => {
  labos = snapshot.val() || {};
  renderLabos();
  updateDashboard(); // update dashboard when labos change
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    localStorage.setItem("uid", uid); // optional
    const db = firebase.database();
    const labosRef = db.ref('labos/' + uid);

    // ⬇️ Put all your app logic here (form, events, listeners, etc.)

  } else {
    // Not logged in → redirect
    window.location.href = "login.html";
  }
});

