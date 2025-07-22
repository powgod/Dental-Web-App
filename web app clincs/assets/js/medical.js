// medical.js

const db = firebase.database();
const suppliesRef = db.ref("medicalSupplies");

const supplyForm = document.getElementById("supplyForm");
const supplyNameInput = document.getElementById("supplyName");
const supplyQuantityInput = document.getElementById("supplyQuantity");
const supplyPriceInput = document.getElementById("supplyPrice");
const supplyTableBody = document.querySelector("#supplyTable tbody");

let supplies = {};

// Render supplies from Firebase data
function renderSupplies() {
  supplyTableBody.innerHTML = `
    <tr>
      <th>Supply</th>
      <th>Quantity</th>
      <th>Unit Price</th>
      <th>Total</th>
      <th>Action</th>
    </tr>
  `;

  Object.entries(supplies).forEach(([key, item]) => {
    const total = (item.quantity || 0) * (item.unitPrice || 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice.toFixed(2)} MAD</td>
      <td>${total.toFixed(2)} MAD</td>
      <td><button class="delete-btn" onclick="deleteSupply('${key}')">🗑️</button></td>
    `;
    supplyTableBody.appendChild(tr);
  });
}

// Delete supply from Firebase
window.deleteSupply = async function(key) {
  if (confirm("Delete this supply item?")) {
    await suppliesRef.child(key).remove();
  }
};

// Add new supply to Firebase
supplyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = supplyNameInput.value.trim();
  const quantity = parseInt(supplyQuantityInput.value);
  const unitPrice = parseFloat(supplyPriceInput.value);

  if (!name || isNaN(quantity) || quantity < 1 || isNaN(unitPrice) || unitPrice < 0) {
    alert("Please enter valid supply data.");
    return;
  }

  suppliesRef.push({ name, quantity, unitPrice }).then(() => {
    supplyForm.reset();
  });
});

// Listen for realtime Firebase updates
suppliesRef.on("value", (snapshot) => {
  supplies = snapshot.val() || {};
  renderSupplies();
});
