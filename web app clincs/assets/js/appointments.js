// appointments.js

const db = firebase.database();
const appointmentsRef = db.ref("appointments");
const patientsRef = db.ref("patients"); // optional, if you want to fetch live patients

const patientNameInput = document.getElementById("patientName");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");
const viewDateInput = document.getElementById("viewDate");

let appointments = {};
let patients = {}; // Will hold patients if fetched from Firebase
let editingIndex = null; // will be the Firebase key of the appointment being edited

// Optionally, fetch patients from Firebase to keep patient list updated
// Or you can keep your localStorage fallback here as well
patientsRef.on("value", (snapshot) => {
  patients = snapshot.val() || {};
  // If you have a dropdown for patients, you can populate it here
  // populatePatientDropdown();
});

// Save appointment: create or update based on editingIndex
function saveAppointmentData(appointmentData) {
  if (editingIndex !== null) {
    // update
    return appointmentsRef.child(editingIndex).set(appointmentData);
  } else {
    // add new
    return appointmentsRef.push(appointmentData);
  }
}

function renderAppointments(filterDate = null) {
  appointmentsTableBody.innerHTML = "";

  // Convert appointments object to array for filtering and sorting
  const appsArray = Object.entries(appointments).map(([key, val]) => ({ key, ...val }));

  let filtered = appsArray;
  if (filterDate) {
    filtered = appsArray.filter(app => app.date === filterDate);
  }

  if (filtered.length === 0) {
    appointmentsTableBody.innerHTML = `<tr><td colspan="7">No appointments found.</td></tr>`;
    return;
  }

  filtered.forEach((app) => {
    appointmentsTableBody.innerHTML += `
      <tr>
        <td>${app.patientName}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
        <td>${app.duration} min</td>
        <td>${app.status}</td>
        <td>${app.notes || ""}</td>
        <td>
          <button onclick="editAppointment('${app.key}')">✏️</button>
          <button onclick="deleteAppointment('${app.key}')">🗑️</button>
        </td>
      </tr>
    `;
  });
}

// Check appointment conflict (excluding the appointment being edited)
function hasConflict(newDate, newTime, newDuration, skipKey = null) {
  const newStart = new Date(`${newDate}T${newTime}`);
  const newEnd = new Date(newStart.getTime() + newDuration * 60000);

  return Object.entries(appointments).some(([key, app]) => {
    if (key === skipKey) return false;
    if (app.date !== newDate) return false;

    const appStart = new Date(`${app.date}T${app.time}`);
    const appEnd = new Date(appStart.getTime() + app.duration * 60000);

    return (newStart < appEnd) && (newEnd > appStart);
  });
}

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const enteredName = patientNameInput.value.trim();
  if (!enteredName) return alert("Enter the patient's name.");

  // Optionally check patients list for exact match
  // const patient = Object.values(patients).find(p => p.name.toLowerCase() === enteredName.toLowerCase());

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
    // patientId: patient ? patient.phone : null,  // optional if you want to add it later
    date,
    time,
    duration,
    status,
    notes
  };

  saveAppointmentData(appointmentData)
    .then(() => {
      alert(editingIndex ? "Appointment updated." : "Appointment added.");
      appointmentForm.reset();
      editingIndex = null;
      appointmentForm.querySelector("button").textContent = "Add Appointment";
    })
    .catch(err => {
      alert("Error saving appointment: " + err.message);
    });
});

// Edit appointment: fill form with data
window.editAppointment = function(key) {
  editingIndex = key;
  const app = appointments[key];
  if (!app) return alert("Appointment data not found.");

  patientNameInput.value = app.patientName;
  document.getElementById("appointmentDate").value = app.date;
  document.getElementById("appointmentTime").value = app.time;
  document.getElementById("appointmentDuration").value = app.duration;
  document.getElementById("appointmentStatus").value = app.status;
  document.getElementById("appointmentNotes").value = app.notes || "";
  appointmentForm.querySelector("button").textContent = "Update Appointment";
};

// Delete appointment by key
window.deleteAppointment = function(key) {
  if (confirm("Delete this appointment?")) {
    appointmentsRef.child(key).remove();
  }
};

// Listen for realtime changes
appointmentsRef.on("value", (snapshot) => {
  appointments = snapshot.val() || {};
  renderAppointments(viewDateInput.value || null);
});

// Filter appointments by date
viewDateInput.addEventListener("change", () => {
  renderAppointments(viewDateInput.value);
});

// Initialize viewDate to today
viewDateInput.value = new Date().toISOString().slice(0, 10);
renderAppointments();
