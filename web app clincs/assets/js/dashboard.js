// Get UID of current user
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // Not logged in
    alert("Please log in first");
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;

const db = firebase.database();

const patientsRef = db.ref('patients/' + uid);
const receptionRef = db.ref('waitingList/' + uid);
const expensesRef = db.ref('fixedExpenses/' + uid);
const suppliesRef = db.ref('medicalSupplies/' + uid);
const labosRef = db.ref('labos/' + uid);


function updateDashboard(patientsData, receptionData) {
  const patients = patientsData ? Object.values(patientsData) : [];
  const reception = receptionData ? Object.values(receptionData) : [];

  const totalPatients = patients.length;
  const waitingPatients = reception.length;

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

function updateTotalAdvance(patientsData) {
  const patients = patientsData ? Object.values(patientsData) : [];
  const totalAdvance = patients.reduce((sum, p) => sum + (Number(p.advance) || 0), 0);

  let advanceElement = document.getElementById("totalAdvance");
  if (advanceElement) {
    advanceElement.textContent = `${totalAdvance.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Total Advance</h3>
      <p id="totalAdvance">${totalAdvance.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}

function updateTotalPrice(patientsData) {
  const patients = patientsData ? Object.values(patientsData) : [];
  const totalPrice = patients.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  let priceElement = document.getElementById("totalPrice");
  if (priceElement) {
    priceElement.textContent = `${totalPrice.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Total Price</h3>
      <p id="totalPrice">${totalPrice.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}

// Similarly for other dashboard items...
function updateMonthlyExpense(expensesData) {
  const expenses = expensesData ? Object.values(expensesData) : [];
  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  let expenseElement = document.getElementById("monthlyExpense");
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

function updateMedicalInventoryCost(suppliesData) {
  const supplies = suppliesData ? Object.values(suppliesData) : [];
  const totalCost = supplies.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  let element = document.getElementById("medicalInventoryCost");
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

function updateMonthlyLaboExpense(labosData) {
  const labos = labosData ? Object.values(labosData) : [];
  const total = labos.reduce((sum, l) => sum + (Number(l.price) || 0), 0);

  let laboElement = document.getElementById("monthlyLaboExpense");
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

function updateLaboWorkLeft(labosData) {
  const labos = labosData ? Object.values(labosData) : [];
  const pendingLabos = labos.filter(l => l.status.toLowerCase() !== "completed").length;

  let laboWorkElement = document.getElementById("laboWorkLeft");
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

function updateFinancialSummary(patientsData, suppliesData, expensesData, labosData) {
  const patients = patientsData ? Object.values(patientsData) : [];
  const supplies = suppliesData ? Object.values(suppliesData) : [];
  const expenses = expensesData ? Object.values(expensesData) : [];
  const labos = labosData ? Object.values(labosData) : [];

  const totalPrice = patients.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalAdvance = patients.reduce((sum, p) => sum + (Number(p.advance) || 0), 0);
  const totalMedicalCost = supplies.reduce((sum, s) => sum + (s.quantity * s.unitPrice), 0);
  const totalMonthlyExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalLaboExpense = labos.reduce((sum, l) => sum + (Number(l.price) || 0), 0);

  const netProfit = totalPrice - totalMedicalCost - totalMonthlyExpense - totalLaboExpense;
  const cashInHand = totalAdvance - totalMedicalCost - totalMonthlyExpense - totalLaboExpense;

  let netProfitElement = document.getElementById("netProfit");
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

  let cashElement = document.getElementById("caseAmount");
  if (cashElement) {
    cashElement.textContent = `${cashInHand.toFixed(2)} MAD`;
  } else {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>Cash In Hand</h3>
      <p id="caseAmount">${cashInHand.toFixed(2)} MAD</p>
    `;
    document.getElementById("dashboard").appendChild(card);
  }
}

// Setup realtime listeners for all relevant data nodes
patientsRef.on("value", patientsSnap => {
  const patientsData = patientsSnap.val();
  receptionRef.once("value", receptionSnap => {
    const receptionData = receptionSnap.val();

    updateDashboard(patientsData, receptionData);
    updateTotalAdvance(patientsData);
    updateTotalPrice(patientsData);
  });

  expensesRef.once("value", expensesSnap => {
    const expensesData = expensesSnap.val();
    updateMonthlyExpense(expensesData);
  });

  suppliesRef.once("value", suppliesSnap => {
    const suppliesData = suppliesSnap.val();
    updateMedicalInventoryCost(suppliesData);
  });

  labosRef.once("value", labosSnap => {
    const labosData = labosSnap.val();
    updateMonthlyLaboExpense(labosData);
    updateLaboWorkLeft(labosData);
    updateFinancialSummary(patientsData, suppliesData, expensesData, labosData);
  });
});
// At the very end of your code, add these two lines:
});