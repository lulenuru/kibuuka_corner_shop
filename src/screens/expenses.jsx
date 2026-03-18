import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Wholesaler Restock",
  "Transport",
  "Electricity",
  "Rent",
  "Other"
];

export default function ExpensesScreen({ onBack }) {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem("expenses", JSON.stringify(newExpenses));
  };

  const addExpense = () => {
    if (!category || !amount) return;
    const newExpense = {
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      date
    };
    saveExpenses([...expenses, newExpense]);
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  const deleteExpense = (id) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow-sm p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Record Expense</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="number" placeholder="Amount (UGX)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={addExpense} className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2">
            <Plus size={16} /> Add Expense
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-md font-semibold mb-3">Expenses List</h2>
          <div className="text-sm text-slate-600 mb-2">Total: {totalExpenses.toLocaleString()} UGX</div>
          {expenses.length === 0 ? (
            <p className="text-slate-500">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">{e.category}</div>
                    <div className="text-sm text-slate-500">{e.date} - {e.amount.toLocaleString()} UGX</div>
                  </div>
                  <button onClick={() => deleteExpense(e.id)} className="text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}