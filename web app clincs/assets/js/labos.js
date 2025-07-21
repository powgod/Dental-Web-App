const laboForm = document.getElementById("laboForm");
const laboName = document.getElementById("laboName");
const laboCost = document.getElementById("laboCost");
const labosTable = document.getElementById("labosTable");
const laboTableBody = document.querySelector("#laboTable tbody");
  let labos = JSON.parse(localStorage.getItem("labos") || "[]");

  let editingLaboIndex = null;

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
    labos.forEach((l, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.name}</td>
        <td>${l.price.toFixed(2)}</td>
        <td>${l.date}</td>
        <td>${l.status}</td>
        <td>${l.sendDate}</td>
        <td>${l.note || ""}</td>
        <td>
          <button class="edit-btn" onclick="editLabo(${i})">✏️</button>
          <button class="delete-btn" onclick="deleteLabo(${i})">🗑️</button>
        </td>`;
      laboTableBody.appendChild(tr);
    });
    saveLabos();
    ;
  }

  window.editLabo = function(index) {
    const l = labos[index];
    editingLaboIndex = index;
    laboForm.laboName.value = l.name;
    laboForm.laboPrice.value = l.price;
    laboForm.laboDate.value = l.date;
    laboForm.laboStatus.value = l.status;
    laboForm.laboSendDate.value = l.sendDate;
    laboForm.laboNote.value = l.note || "";

    laboForm.querySelector("button[type='submit']").textContent = "Update Labo";
  };

  window.deleteLabo = function(index) {
    if (confirm("Are you sure you want to delete this labo entry?")) {
      labos.splice(index, 1);
      
      renderLabos();
      alert("Labo entry deleted successfully.");
      if (editingLaboIndex === index) {
        resetLaboForm();
      }
    }
  };

  function resetLaboForm() {
    laboForm.reset();
    editingLaboIndex = null;
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

    if (editingLaboIndex !== null) {
      labos[editingLaboIndex] = newLabo;
      alert("Labo entry updated successfully.");
    } else {
      labos.push(newLabo);
      alert("Labo entry added successfully.");
    }
    renderLabos();
    saveLabos();
    resetLaboForm();
  });

  function saveLabos() {
    localStorage.setItem("labos", JSON.stringify(labos));
    updateDashboard();
  }
  renderLabos();