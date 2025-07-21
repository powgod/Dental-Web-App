const supplyForm = document.getElementById("supplyForm");
const supplyNameInput = document.getElementById("supplyName");
const supplyQuantityInput = document.getElementById("supplyQuantity");
const supplyPriceInput = document.getElementById("supplyPrice");
const supplyTableBody = document.querySelector("#supplyTable tbody");

let supplies = JSON.parse(localStorage.getItem("medicalSupplies") || "[]");

function saveSupplies() {
  localStorage.setItem("medicalSupplies", JSON.stringify(supplies));
}

function renderSupplies() {
  supplyTableBody.innerHTML = "";
  supplies.forEach((item, index) => {
    const total = item.quantity * item.unitPrice;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice.toFixed(2)} MAD</td>
      <td>${total.toFixed(2)} MAD</td>
      <td><button onclick="deleteSupply(${index})" class="delete-btn">🗑️</button></td>
    `;
    supplyTableBody.appendChild(tr);
  });
}

function deleteSupply(index) {
  if (confirm("Delete this supply item?")) {
    supplies.splice(index, 1);
    saveSupplies();
    renderSupplies();
  }
}

supplyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = supplyNameInput.value.trim();
  const quantity = parseInt(supplyQuantityInput.value);
  const unitPrice = parseFloat(supplyPriceInput.value);

  if (!name || isNaN(quantity) || isNaN(unitPrice)) {
    alert("Please enter valid supply data.");
    return;
  }

  supplies.push({ name, quantity, unitPrice });
  saveSupplies();
  renderSupplies();
  supplyForm.reset();
});

renderSupplies();
window.deleteSupply = deleteSupply;
