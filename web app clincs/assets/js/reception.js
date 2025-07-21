function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("currentTime").textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

const nameInput = document.getElementById("patientwaitingName");
const phoneInput = document.getElementById("patientwaitingPhone");
const workInput = document.getElementById("patientwaitingwork");
const waitingTable = document.getElementById("waitingTable");

// Load patients or initialize empty array
let waitingPatients = JSON.parse(localStorage.getItem("waitingList")) || [];

function saveToStorage() {
  localStorage.setItem("waitingList", JSON.stringify(waitingPatients));
}

function renderWaitingList() {
  waitingTable.innerHTML = `
    <tr><th>Name</th><th>Phone</th><th>Work</th><th>Actions</th></tr>
    ${waitingPatients.map((p, i) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.phone}</td>
        <td>${p.work}</td>
        <td>
          <button onclick="removePatient(${i})" class="delete-btn">🗑️</button>
        </td>
      </tr>
    `).join("")}
  `;
}

function removePatient(index) {
  waitingPatients.splice(index, 1);
  saveToStorage();
  renderWaitingList();
}

function addPatient() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const work = workInput.value.trim();
  if (!name || !phone || !work) return;

  const newPatient = { name, phone, work };
  waitingPatients.push(newPatient);
  saveToStorage();
  renderWaitingList();

  // Clear inputs
  nameInput.value = "";
  phoneInput.value = "";
  workInput.value = "";
}

// Add event listener to "Enter" on last input
workInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addPatient();
});

renderWaitingList();
