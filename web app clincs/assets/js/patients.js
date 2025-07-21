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

let patients = JSON.parse(localStorage.getItem("patients")) || [];
let editingIndex = null;

function savePatients() {
  localStorage.setItem("patients", JSON.stringify(patients));
}

function renderPatients() {
  patientTable.innerHTML = "";
  patients.forEach((p, index) => {
    const row = document.createElement("tr");
    const remaining = (p.price || 0) - (p.advance || 0);

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
        <button onclick="openEditModal(${index})">✏️</button>
        <button onclick="deletePatient(${index})">🗑️</button>
      </td>
    `;
    patientTable.appendChild(row);
  });
}

patientForm.addEventListener("submit", function (e) {
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

  patients.push(patient);
  savePatients();
  renderPatients();
  patientForm.reset();
});

function deletePatient(index) {
  if (confirm("Are you sure?")) {
    patients.splice(index, 1);
    savePatients();
    renderPatients();
  }
}

// ---------- Edit Modal Logic ----------

function openEditModal(index) {
  editingIndex = index;
  const p = patients[index];
  document.getElementById("editName").value = p.name;
  document.getElementById("editPhone").value = p.phone;
  document.getElementById("editStatus").value = p.status;
  document.getElementById("editAdvance").value = "";
  const modal = document.getElementById("editModal");
  modal.classList.add("show");
  modal.style.display = "flex";
  
  renderHistory(p.history || []);
}

function renderHistory(history) {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  if (!history || history.length === 0) {
    historyList.innerHTML = "<li>No payment history</li>";
    return;
  }

  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.amount} MAD`;
    historyList.appendChild(li);
  });
}

function saveEdit() {
  const p = patients[editingIndex];
  const newAdvance = parseFloat(document.getElementById("editAdvance").value) || 0;

  if (newAdvance > 0) {
    p.advance = (p.advance || 0) + newAdvance;
    p.history = p.history || [];
    p.history.push({ date: new Date().toLocaleDateString(), amount: newAdvance });
  }

  p.name = document.getElementById("editName").value;
  p.phone = document.getElementById("editPhone").value;
  p.status = document.getElementById("editStatus").value;

  savePatients();
  renderPatients();
  document.getElementById("editModal").style.display = "none";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Initialize
renderPatients();
