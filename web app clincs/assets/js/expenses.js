const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expensesTableBody = document.querySelector("#expensesTable tbody");

let expenses = JSON.parse(localStorage.getItem("fixedExpenses") || "[]");

function saveExpenses() {
  localStorage.setItem("fixedExpenses", JSON.stringify(expenses));
}

function renderExpenses() {
  expensesTableBody.innerHTML = "";
  expenses.forEach((expense, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td><button class="delete-btn" onclick="deleteExpense(${index})">🗑️</button></td>
    `;
    expensesTableBody.appendChild(tr);
  });
}

function deleteExpense(index) {
  if (confirm("Delete this expense?")) {
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
  }
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  if (!name || isNaN(amount) || amount < 0) {
    alert("Please enter a valid name and amount.");
    return;
  }
  expenses.push({ name, amount });
  saveExpenses();
  renderExpenses();
  expenseForm.reset();
});

// Initial render

renderExpenses();

// Make deleteExpense globally accessible for inline onclick
window.deleteExpense = deleteExpense;
