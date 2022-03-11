import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
    <h2>Expense Tracker</h2>

    <div class="container">
      <h4>Your Credit</h4>
      <h1 id="balance">$0.00</h1>

      <div class="inc-exp-container">
        <div>
          <h4>Ingress</h4>
          <p id="money-plus" class="money plus">+$0.00</p>
        </div>
        <div>
          <h4>Gasto</h4>
          <p id="money-minus" class="money minus">-$0.00</p>
        </div>
      </div>

      <h3>History</h3>
      <ul id="list" class="list">
        <!-- <li class="minus">
          Cash <span>-$400</span><button class="delete-btn">x</button>
        </li> -->
      </ul>

      <h3>Add transaction</h3>
      <form id="form">
        <div class="form-control">
          <label for="text">Text</label>
          <input type="text" id="text" placeholder="Nombre.." />
        </div>
        <div class="form-control">
          <label for="amount"
            >Amount <br />
            (negative - expense, positive - income)</label
          >
          <input type="number" id="amount" placeholder="Monto..." />
        </div>
        <button class="btn">Add</button>
      </form>
    </div>
`
