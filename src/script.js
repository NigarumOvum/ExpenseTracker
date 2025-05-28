const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Track if editing
let editingId = null;

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    if (editingId !== null) {
      // Update existing transaction
      const idx = transactions.findIndex(t => t.id === editingId);
      if (idx !== -1) {
        transactions[idx] = {
          id: editingId,
          text: text.value,
          amount: +amount.value
        };
      }
      editingId = null;
    } else {
      // Add new transaction
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value
      };
      transactions.push(transaction);
    }

    updateLocalStorage();
    init();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text}
    <span>${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
    <button class="edit-btn" data-id="${transaction.id}">✎</button>
    <button class="delete-btn" data-id="${transaction.id}">x</button>
  `;

  list.appendChild(item);
}

// Event delegation for edit and delete buttons
list.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    removeTransaction(id);
  }
  if (e.target.classList.contains('edit-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    editTransaction(id);
  }
});

// Edit transaction
function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;
  // Prefill form
  text.value = tx.text;
  amount.value = tx.amount;
  editingId = id;
  text.focus();
}

// Currency functionality
const currencySelect = document.getElementById('currency');
let currentCurrency = currencySelect ? currencySelect.value : 'CRC';

const currencyFormats = {
  CRC: { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 },
  USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  EUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
  MXN: { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 },
  BRL: { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', currencyFormats[currentCurrency]).format(amount);
}

if (currencySelect) {
  currencySelect.addEventListener('change', function () {
    currentCurrency = this.value;
    updateValues();
    updateHistoryCurrency();
  });
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

  balance.innerText = formatCurrency(total);
  money_plus.innerText = formatCurrency(income);
  money_minus.innerText = formatCurrency(expense);
}

// Update currency in history list
function updateHistoryCurrency() {
  Array.from(list.children).forEach((li, idx) => {
    const tx = transactions[idx];
    if (!tx) return;
    const sign = tx.amount < 0 ? '-' : '+';
    const span = li.querySelector('span');
    if (span) span.textContent = sign + formatCurrency(Math.abs(tx.amount));
  });
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  if (editingId === id) editingId = null; // Cancel edit if deleted
  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);

// Export transactions to CSV
function exportToCSV() {
  const csvRows = [
    ['id', 'text', 'amount'],
    ...transactions.map(tx => [tx.id, `"${tx.text.replace(/"/g, '""')}"`, tx.amount])
  ];
  const csvContent = csvRows.map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import transactions from CSV
function importFromCSV(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\n').filter(Boolean);
    const [header, ...rows] = lines;
    const imported = rows.map(row => {
      const [id, text, amount] = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(s => s.replace(/^"|"$/g, ''));
      return { id: Number(id), text, amount: Number(amount) };
    });
    transactions = imported;
    updateLocalStorage();
    init();
  };
  reader.readAsText(file);
}

// Event listeners for CSV buttons
document.getElementById('export-csv').addEventListener('click', exportToCSV);

document.getElementById('import-csv-btn').addEventListener('click', () => {
  document.getElementById('import-csv').click();
});
document.getElementById('import-csv').addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    importFromCSV(e.target.files[0]);
  }
});

document.getElementById('clear-history').addEventListener('click', function() {
  if (confirm('Are you sure you want to clear all history?')) {
    transactions = [];
    editingId = null;
    updateLocalStorage();
    init();
  }
});
