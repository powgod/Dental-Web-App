// Get UID of current user
const uid = localStorage.getItem("uid");
if (!uid) {
  alert("User not logged in");
  window.location.href = "login.html"; // or redirect to login
}

// Reference only the logged-in user's patients
const db = firebase.database();
const patientRef = db.ref('patients/' + uid); // ✅ scoped to this user

const patientForm = document.getElementById("patientForm");
const patientName = document.getElementById("patientName");
const patientPhone = document.getElementById("patientPhone");
const patientWork = document.getElementById("patientWork");
const patientNote = document.getElementById("patientNote");
const firstVisit = document.getElementById("firstVisit");
const nextVisit = document.getElementById("nextVisit");
const patientStatus = document.getElementById("patientStatus");
const patientPrice = document.getElementById("patientPrice");
const patientAdvance = document.getElementById("patientAdvance");
const patientDate = document.getElementById("patientDate");
const patientTable = document.querySelector("#patientTable tbody");

let patients = {}; // will hold patients from Firebase as an object
let editingKey = null;

function renderPatients() {
  patientTable.innerHTML = "";
  for (const key in patients) {
    const p = patients[key];
    const remaining = (p.price || 0) - (p.advance || 0);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>${p.work}</td>
      <td>${p.status}</td>
      <td>${p.note || ""}</td>
      <td>${p.firstVisit || ""}</td>
      <td>${p.nextVisit || ""}</td>
      <td>${p.price || 0}</td>
      <td>${p.advance || 0}</td>
      <td>${remaining}</td>
      <td>${p.date || ""}</td>
      <td>
        <button onclick="openEditModal('${key}')">✏️</button>
        <button onclick="deletePatient('${key}')">🗑️</button>
      </td>
    `;
    patientTable.appendChild(row);
  }
}

// Add new patient
patientForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const patient = {
    name: patientName.value,
    phone: patientPhone.value,
    work: patientWork.value,
    note: patientNote.value,
    firstVisit: firstVisit.value,
    nextVisit: nextVisit.value,
    status: patientStatus.value,
    price: parseFloat(patientPrice.value),
    advance: parseFloat(patientAdvance.value),
    date: patientDate.value,
    history: [{
      amount: parseFloat(patientAdvance.value),
      date: new Date().toLocaleDateString()
    }]
  };

  patientRef.push(patient)
    .then(() => {
      patientForm.reset();
    })
    .catch(error => {
      alert("Error adding patient: " + error.message);
    });
});

// Delete patient
window.deletePatient = function(key) {
  if (confirm("Are you sure you want to delete this patient?")) {
    patientRef.child(key).remove();
  }
};

// Edit patient
window.openEditModal = function(key) {
  editingKey = key;
  const p = patients[key];
  document.getElementById("editName").value = p.name;
  document.getElementById("editPhone").value = p.phone;
  document.getElementById("editStatus").value = p.status;
  document.getElementById("editAdvance").value = "";
  document.getElementById("editModal").style.display = "flex";

  renderHistory(p.history || []);
};

function renderHistory(history) {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No payment history</li>";
    return;
  }
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.amount} MAD`;
    historyList.appendChild(li);
  });
}

// Save edited patient data
window.saveEdit = function() {
  if (!editingKey) return;

  const p = patients[editingKey];
  const newAdvance = parseFloat(document.getElementById("editAdvance").value) || 0;

  if (newAdvance > 0) {
    p.advance = (p.advance || 0) + newAdvance;
    p.history = p.history || [];
    p.history.push({ date: new Date().toLocaleDateString(), amount: newAdvance });
  }

  p.name = document.getElementById("editName").value;
  p.phone = document.getElementById("editPhone").value;
  p.status = document.getElementById("editStatus").value;

  patientRef.child(editingKey).set(p)
    .then(() => {
      document.getElementById("editModal").style.display = "none";
    })
    .catch(error => {
      alert("Error saving changes: " + error.message);
    });
};

window.closeModal = function() {
  document.getElementById("editModal").style.display = "none";
};

// Firebase realtime listener
patientRef.on("value", snapshot => {
  patients = snapshot.val() || {};
  renderPatients();
});
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    localStorage.setItem("uid", uid); // optional
    const db = firebase.database();
    const patientRef = db.ref('patients/' + uid);

    // ⬇️ Put all your app logic here (form, events, listeners, etc.)

  } else {
    // Not logged in → redirect
    window.location.href = "login.html";
  }
});
