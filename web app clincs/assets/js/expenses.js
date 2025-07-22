// expenses.js

const db = firebase.database();
const expensesRef = db.ref("fixedExpenses");

const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expensesTableBody = document.querySelector("#expensesTable tbody");

let expenses = {};

// Render expenses table from Firebase data
function renderExpenses() {
  expensesTableBody.innerHTML = `
    <tr>
      <th>Expense</th>
      <th>Amount (MAD)</th>
      <th>Action</th>
    </tr>
  `;

  Object.entries(expenses).forEach(([key, expense]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td><button class="delete-btn" onclick="deleteExpense('${key}')">🗑️</button></td>
    `;
    expensesTableBody.appendChild(tr);
  });
}

// Delete expense from Firebase
window.deleteExpense = async function(key) {
  if (confirm("Delete this expense?")) {
    await expensesRef.child(key).remove();
  }
};

// Add new expense to Firebase
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (!name || isNaN(amount) || amount < 0) {
    alert("Please enter a valid name and amount.");
    return;
  }

  expensesRef.push({ name, amount }).then(() => {
    expenseForm.reset();
  });
});

// Listen for realtime updates from Firebase
expensesRef.on("value", (snapshot) => {
  expenses = snapshot.val() || {};
  renderExpenses();
});
