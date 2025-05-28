import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="container" role="main">
    <div class="split-layout">
      <aside class="history-panel">
        <section>
          <div class="history-header">
            <span class="history-icon" aria-hidden="true">📜</span>
            <div>
              <h2>History</h2>
              <p class="history-subtitle">Your recent transactions</p>
            </div>
          </div>
          <hr class="history-divider" />
          <button id="clear-history" class="btn clear-history-btn" type="button">
            <span aria-hidden="true" style="font-size:1.2em;">🗑️</span>
            <span>Clear History</span>
          </button>
          <div class="history-list-card">
            <ul id="list" class="list" aria-live="polite"></ul>
          </div>
        </section>
      </aside>
      <main class="main-panel">
        <header>
          <h1 class="app-title">Expense Tracker</h1>
          <p class="subtitle">Track your income and expenses easily</p>
          <div class="currency-select">
            <label for="currency">Currency:</label>
            <select id="currency">
              <option value="CRC" selected>🇨🇷 Costa Rica Colón (CRC)</option>
              <option value="USD">🇺🇸 US Dollar (USD)</option>
              <option value="EUR">🇪🇺 Euro (EUR)</option>
              <option value="MXN">🇲🇽 Mexican Peso (MXN)</option>
              <option value="BRL">🇧🇷 Brazilian Real (BRL)</option>
              <!-- Add more as needed -->
            </select>
          </div>
        </header>
        <section class="balance-section">
          <h2 class="sr-only">Current Balance</h2>
          <div class="balance-card">
            <span>Your Balance</span>
            <span id="balance" class="balance-amount">$0.00</span>
          </div>
          <div class="inc-exp-container">
            <div>
              <h3>Income</h3>
              <p id="money-plus" class="money plus">+$0.00</p>
            </div>
            <div>
              <h3>Expense</h3>
              <p id="money-minus" class="money minus">-$0.00</p>
            </div>
          </div>
        </section>
        <section>
          <h2>Add Transaction</h2>
          <form id="form" autocomplete="off">
            <div class="form-control">
              <label for="text">Description</label>
              <input type="text" id="text" placeholder="e.g. Groceries" required />
            </div>
            <div class="form-control">
              <label for="amount">
                Amount <span class="input-hint">(negative = expense, positive = income)</span>
              </label>
              <input type="number" id="amount" placeholder="e.g. -50 or 100" required />
            </div>
            <button class="btn primary-btn" type="submit">Add Transaction</button>
          </form>
        </section>
        <section class="csv-section">
          <button id="export-csv" class="btn secondary-btn">Export CSV</button>
          <input type="file" id="import-csv" accept=".csv" style="display:none" />
          <button id="import-csv-btn" class="btn secondary-btn">Import CSV</button>
        </section>
      </main>
    </div>
  </div>
  <footer class="app-footer">
    <p>
      Made with ❤️ by 
      <a href="https://yourwebsite.com" target="_blank" rel="noopener" class="footer-link">
        Brealy Padron
      </a>
    </p>
  </footer>
`
