// reception.js

const db = firebase.database();
const waitingRef = db.ref("waitingList");

const nameInput = document.getElementById("patientwaitingName");
const phoneInput = document.getElementById("patientwaitingPhone");
const workInput = document.getElementById("patientwaitingwork");
const waitingTable = document.getElementById("waitingTable");

let waitingPatients = {};
let editingKey = null;

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById("currentTime").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Render patients from Firebase data snapshot
function renderWaitingList() {
  waitingTable.innerHTML = `
    <tr>
      <th>Name</th><th>Phone</th><th>Work</th><th>Actions</th>
    </tr>`;

  Object.entries(waitingPatients).forEach(([key, patient]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${patient.name}</td>
      <td>${patient.phone}</td>
      <td>${patient.work}</td>
      <td>
        <button onclick="removePatient('${key}')" class="delete-btn">🗑️</button>
      </td>
    `;
    waitingTable.appendChild(tr);
  });
}

// Remove patient from Firebase
window.removePatient = async function(key) {
  if (confirm("Are you sure you want to remove this patient?")) {
    await waitingRef.child(key).remove();
  }
};

// Add patient to Firebase
function addPatient() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const work = workInput.value.trim();
  if (!name || !phone || !work) return;

  const newPatient = { name, phone, work };
  waitingRef.push(newPatient).then(() => {
    nameInput.value = "";
    phoneInput.value = "";
    workInput.value = "";
  });
}

// Add event listener for "Enter" on last input
workInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addPatient();
});

// Listen to Firebase waitingList changes in realtime
waitingRef.on("value", snapshot => {
  waitingPatients = snapshot.val() || {};
  renderWaitingList();
});

