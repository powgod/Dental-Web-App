const patientNameInput = document.getElementById("patientName");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");
const viewDateInput = document.getElementById("viewDate");


let patients = JSON.parse(localStorage.getItem("patients") || "[]");
let appointments = JSON.parse(localStorage.getItem("appointments") || "[]");

function populatePatientDropdown() {
  patientSelect.innerHTML = `<option value="">Select Patient</option>`;
  patients.forEach((p, i) => {
    patientSelect.innerHTML += `<option value="${p.phone}">${p.name}</option>`;
  });
}

function saveAppointments() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

function renderAppointments(filterDate = null) {
  let filtered = appointments;
  if (filterDate) {
    filtered = appointments.filter(app => app.date === filterDate);
  }

  if (filtered.length === 0) {
    appointmentsTableBody.innerHTML = `<tr><td colspan="7">No appointments found.</td></tr>`;
    return;
  }

  appointmentsTableBody.innerHTML = filtered.map((app, i) => `
    <tr>
      <td>${app.patientName}</td>
      <td>${app.date}</td>
      <td>${app.time}</td>
      <td>${app.duration} min</td>
      <td>${app.status}</td>
      <td>${app.notes || ""}</td>
      <td>
        <button onclick="editAppointment(${i})">✏️</button>
        <button onclick="deleteAppointment(${i})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// Check for overlapping appointments
function hasConflict(newDate, newTime, newDuration, skipIndex=null) {
  const newStart = new Date(`${newDate}T${newTime}`);
  const newEnd = new Date(newStart.getTime() + newDuration*60000);

  return appointments.some((app, idx) => {
    if (idx === skipIndex) return false;
    if (app.date !== newDate) return false;

    const appStart = new Date(`${app.date}T${app.time}`);
    const appEnd = new Date(appStart.getTime() + app.duration*60000);

    return (newStart < appEnd) && (newEnd > appStart); // overlap condition
  });
}

let editingIndex = null;

appointmentForm.addEventListener("submit", e => {
  e.preventDefault();

  const enteredName = patientNameInput.value.trim();
if (!enteredName) return alert("Enter the patient's name.");

// Optional: try to find patient by exact name match (case-insensitive)
const patient = patients.find(p => p.name.toLowerCase() === enteredName.toLowerCase());

if (!patient) {
  // You can either allow new name or alert here
  // For example, allow unknown patient names:
  // alert("Patient not found in records.");
  // return;
}

  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("appointmentTime").value;
  const duration = parseInt(document.getElementById("appointmentDuration").value);
  const status = document.getElementById("appointmentStatus").value;
  const notes = document.getElementById("appointmentNotes").value;

  if (hasConflict(date, time, duration, editingIndex)) {
    return alert("Appointment conflicts with an existing one.");
  }

  const appointmentData = {
    patientName: enteredName,
    patientId: patient ? patient.phone : null,  // optional, if you want to keep id
    date,
    time,
    duration,
    status,
    notes
  };
  

  if (editingIndex !== null) {
    appointments[editingIndex] = appointmentData;
    alert("Appointment updated.");
  } else {
    appointments.push(appointmentData);
    alert("Appointment added.");
  }

  saveAppointments();
  renderAppointments(viewDateInput.value || date);
  appointmentForm.reset();
  editingIndex = null;
  appointmentForm.querySelector("button").textContent = "Add Appointment";
});

window.editAppointment = function(index) {
  editingIndex = index;
  const app = appointments[index];
  patientNameInput.value = app.patientName;
  document.getElementById("appointmentDate").value = app.date;
  document.getElementById("appointmentTime").value = app.time;
  document.getElementById("appointmentDuration").value = app.duration;
  document.getElementById("appointmentStatus").value = app.status;
  document.getElementById("appointmentNotes").value = app.notes || "";
  appointmentForm.querySelector("button").textContent = "Update Appointment";
};

window.deleteAppointment = function(index) {
  if (confirm("Delete this appointment?")) {
    appointments.splice(index, 1);
    saveAppointments();
    renderAppointments();
  }
};

viewDateInput.addEventListener("change", () => {
  renderAppointments();
});

// Initialize
populatePatientDropdown();
viewDateInput.value = new Date().toISOString().slice(0,10);


renderAppointments();  // no date filter, shows all
