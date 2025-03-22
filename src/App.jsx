// Income Categories

const transactionsAll = [
  {
    id: 1,
    name: "Raiyan",
    amount: -10,
    category: "Food & Dining",
    type: "Expense",
    date: "2025-03-20",
  },
  {
    id: 2,
    name: "Mala",
    amount: 2000,
    category: "Job",
    type: "Income",
    date: "2025-03-01",
  },
  {
    id: 3,
    name: "Shahadat",
    amount: -5,
    category: "Transport",
    type: "Expense",
    date: "2025-03-18",
  },
];

import { useState } from "react";

// !  -------------- App --------------
export default function App() {
  const [transactions, setTransactions] = useState(transactionsAll);

  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Select One");

  const totalIncome = transactions
    .filter((cur) => cur.amount > 0)
    .map((cur) => cur.amount)
    .reduce((acc, cur) => acc + cur, 0);

  const totalExpanse = transactions
    .filter((cur) => cur.amount < 0)
    .map((cur) => cur.amount)
    .reduce((acc, cur) => acc + cur, 0);

  const totalBalance = transactions
    .map((cur) => cur.amount)
    .reduce((acc, cur) => acc + cur, 0);

  function handleAddTransaction(newTransaction) {
    setTransactions((transactions) => [...transactions, newTransaction]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newTransaction = {
      id: crypto.randomUUID(),
      name,
      type,
      amount,
      category,
      date: new Date(),
    };
    handleAddTransaction(newTransaction);

    setType("expense");
    setName("");
    setAmount("");
    setCategory("Select One");
  }

  function handleDeleteAllTransaction() {
    if (confirm("Are uou sure that you want to delete all transaction?")) {
      setTransactions([]);
    }
  }

  function handleDeleteTransactionItem(id) {
    setTransactions((transactions) =>
      transactions.filter((cur) => cur.id !== id)
    );
  }

  return (
    <div className="app">
      <Header />
      <div className="grid container section-padding">
        <OverView
          totalIncome={totalIncome}
          totalExpanse={totalExpanse}
          totalBalance={totalBalance}
        />
        <FormToAddExpenses
          type={type}
          setType={setType}
          name={name}
          setName={setName}
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          handleSubmit={handleSubmit}
        />
        {transactions.length > 0 && (
          <TransactionsList
            transactions={transactions}
            onHandleDelete={handleDeleteAllTransaction}
            onHandleDeleteItem={handleDeleteTransactionItem}
          />
        )}
      </div>
    </div>
  );
}

// !  -------------- HEADER --------------

export function Header() {
  return (
    <header className="main-header">
      <div className="logo-box">
        <img src="logo.svg" alt="Logo" className="logo" />
        <p>FinTrack</p>
      </div>
      <nav className="nav-bar">
        <a href="#" className="nav-link">
          Home
        </a>
        <a href="#" className="nav-link">
          Add Transaction
        </a>
        <a href="#" className="nav-link">
          Transaction List
        </a>
        <a href="#" className="nav-link">
          About
        </a>
      </nav>
    </header>
  );
}

// !  -------------- OverView --------------
function OverView({ totalIncome, totalExpanse, totalBalance }) {
  return (
    <div className="overview box">
      <h2 className="section--heading">Overview</h2>
      <p className="overview--text">
        <ion-icon name="cash-outline" className="overview-icon"></ion-icon>
        Total Income: $ {totalIncome}
      </p>
      <p className="overview--text">
        <ion-icon name="card-outline" className="overview-icon"></ion-icon>
        Total Expenses: $ {totalExpanse}
      </p>
      <p className="overview--text">
        <ion-icon name="wallet-outline" className="overview-icon"></ion-icon>
        Balance: $ {totalBalance}
      </p>
    </div>
  );
}

// !  -------------- form to add Expenses --------------

function FormToAddExpenses({
  type,
  setType,
  name,
  setName,
  amount,
  setAmount,
  category,
  setCategory,
  handleSubmit,
}) {
  return (
    <div className="box-form">
      <h2 className="section--heading">Add Expenses & Income </h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Type:</label>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : +e.target.value;
            setAmount(
              value === ""
                ? ""
                : type === "expense"
                ? -Math.abs(value)
                : Math.abs(value)
            );
          }}
        />

        <label>Category:</label>

        {type === "expense" ? (
          <ExpenseCategories category={category} setCategory={setCategory} />
        ) : (
          <IncomeCategories category={category} setCategory={setCategory} />
        )}
        <Button>Add</Button>
      </form>
    </div>
  );
}

// !  -------------- Expense Categories --------------
function ExpenseCategories({ category, setCategory }) {
  const expenseCategories = [
    "Select One",
    "Food & Dining",
    "Transport",
    "Housing",
    "Entertainment",
    "Shopping",
    "Health",
    "Education",
    "Travel",
    "Personal Care",
    "Other",
  ];

  return (
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      {expenseCategories.map((cur, i) => (
        <option value={cur} key={i}>
          {cur}
        </option>
      ))}
    </select>
  );
}

// !  -------------- Expense Categories --------------
function IncomeCategories({ category, setCategory }) {
  const incomeCategories = [
    "Select One",
    "Salary",
    "Freelance",
    "Investments",
    "Business",
    "Gifts",
    "Allowance",
    "Other",
  ];

  return (
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      {incomeCategories.map((cur, i) => (
        <option value={cur === "Select One" ? "" : cur} key={i}>
          {cur}
        </option>
      ))}
    </select>
  );
}

// !  -------------- Transaction List --------------

function TransactionsList({
  transactions,
  onHandleDelete,
  onHandleDeleteItem,
}) {
  const [sort, setSorted] = useState(false);

  function handleSorted() {
    setSorted((cur) => !cur);
  }

  let sortedTransactions = sort
    ? transactions.slice().sort((a, b) => a.amount - b.amount)
    : transactions;

  return (
    <div className="box-form transactions-padding">
      <h2 className="section--heading">Transaction List</h2>
      <ul className="transactions-list">
        {sortedTransactions.map((cur) => (
          <Transaction
            key={cur.id}
            transaction={cur}
            onHandleDeleteItem={onHandleDeleteItem}
          />
        ))}
      </ul>
      <div className="btn-box">
        <Button onClick={onHandleDelete}>Delete All</Button>
        <Button onClick={handleSorted}>Sort</Button>
      </div>
    </div>
  );
}
function Transaction({ transaction, onHandleDeleteItem }) {
  return (
    <li className="transactions-list-item">
      <span className="t-name">{transaction.name}</span>{" "}
      <span className="t-amount">$ {transaction.amount}</span>{" "}
      <span className="t-category">{transaction.category}</span>
      <Button cn={"btn-t"} onClick={() => onHandleDeleteItem(transaction.id)}>
        Delete
      </Button>
    </li>
  );
}

// !  -------------- button--------------
function Button({ children, onClick, cn = "" }) {
  return (
    <button className={`btn ${cn}`} onClick={onClick}>
      {children}
    </button>
  );
}
