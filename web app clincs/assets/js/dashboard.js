function updateDashboard() {
  const patients = loadFromStorage("patients") || [];
  const reception = loadFromStorage("waitingList") || [];

  const totalPatients = patients.length;
  const waitingPatients = reception.length;
  const paidPatients = patients.filter(p => p.status === "Paid").length;

  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
    <div class="metric-card">
      <h3>Total Patients</h3>
      <p>${totalPatients}</p>
    </div>
    <div class="metric-card">
      <h3>Reception</h3>
      <p>${waitingPatients}</p>
    </div>
    `;
    
}
function updateTotalAdvance() {
  const patients = JSON.parse(localStorage.getItem("patients") || "[]");
  const totalAdvance = patients.reduce((sum, p) => sum + (Number(p.advance) || 0), 0);

  const advanceElement = document.getElementById("totalAdvance");
  if (advanceElement) {
    advanceElement.textContent = `${totalAdvance.toFixed(2)} MAD`;
  } else {
    // If the card doesn't exist in HTML, dynamically add it
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Total Advance</h3>
      <p id="totalAdvance">${totalAdvance.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}
function updateTotalPrice() {
  const patients = JSON.parse(localStorage.getItem("patients") || "[]");
  const totalPrice = patients.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const priceElement = document.getElementById("totalPrice");
  if (priceElement) {
    // Update existing card content
    priceElement.textContent = `${totalPrice.toFixed(2)} MAD`;
  } else {
    // Create and add card dynamically if it doesn't exist
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Total Price</h3>
      <p id="totalPrice">${totalPrice.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}
function updateMonthlyExpense() {
  const expenses = JSON.parse(localStorage.getItem("fixedExpenses") || "[]");
  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const expenseElement = document.getElementById("monthlyExpense");
  if (expenseElement) {
    expenseElement.textContent = `${totalExpense.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Monthly Expense</h3>
      <p id="monthlyExpense">${totalExpense.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}
function updateMedicalInventoryCost() {
  const supplies = JSON.parse(localStorage.getItem("medicalSupplies") || "[]");
  const totalCost = supplies.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const element = document.getElementById("medicalInventoryCost");
  if (element) {
    element.textContent = `${totalCost.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Medical Supplies Cost</h3>
      <p id="medicalInventoryCost">${totalCost.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}
function updateMonthlyLaboExpense() {
  const labos = JSON.parse(localStorage.getItem("labos") || "[]");
  const total = labos.reduce((sum, l) => sum + (Number(l.price) || 0), 0);

  const laboElement = document.getElementById("monthlyLaboExpense");
  if (laboElement) {
    laboElement.textContent = `${total.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Monthly Labo Expense</h3>
      <p id="monthlyLaboExpense">${total.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}
function updateLaboWorkLeft() {
  const labos = JSON.parse(localStorage.getItem("labos") || "[]");
  const pendingLabos = labos.filter(l => l.status.toLowerCase() !== "completed").length;

  const laboWorkElement = document.getElementById("laboWorkLeft");
  if (laboWorkElement) {
    laboWorkElement.textContent = `${pendingLabos} labos`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Labo Work Left</h3>
      <p id="laboWorkLeft">${pendingLabos} labos</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}

function updateFinancialSummary() {
  const patients = JSON.parse(localStorage.getItem("patients") || "[]");
  const supplies = JSON.parse(localStorage.getItem("medicalSupplies") || "[]");
  const expenses = JSON.parse(localStorage.getItem("fixedExpenses") || "[]");
  const labos = JSON.parse(localStorage.getItem("labos") || "[]");

  const totalPrice = patients.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalAdvance = patients.reduce((sum, p) => sum + (Number(p.advance) || 0), 0);
  const totalMedicalCost = supplies.reduce((sum, s) => sum + (s.quantity * s.unitPrice), 0);
  const totalMonthlyExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalLaboExpense = labos.reduce((sum, l) => sum + (Number(l.price) || 0), 0);

  const netProfit = totalPrice - totalMedicalCost - totalMonthlyExpense - totalLaboExpense;
  const caseAmount = totalAdvance - totalMedicalCost - totalMonthlyExpense - totalLaboExpense;

  // Net Profit Card
  const netProfitElement = document.getElementById("netProfit");
  if (netProfitElement) {
    netProfitElement.textContent = `${netProfit.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Net Profit</h3>
      <p id="netProfit">${netProfit.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }

  // Case Card
  const caseElement = document.getElementById("caseAmount");
  if (caseElement) {
    caseElement.textContent = `${caseAmount.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Cash In Hand</h3>
      <p id="caseAmount">${caseAmount.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}

updateDashboard();
updateTotalAdvance();
updateTotalPrice(); 
updateMonthlyExpense();
updateMedicalInventoryCost();
updateMonthlyLaboExpense();
updateLaboWorkLeft();  // ← Add this here
updateFinancialSummary();
renderdashboard();

