import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Plus, User, Clock, ChevronRight, CreditCard, X, ChevronDown } from "lucide-react";

const CREDIT_STORAGE_KEY = "credit_v1";
const CLIENTS_STORAGE_KEY = "clients_v1";
const TRANSACTIONS_STORAGE_KEY = "transactions_v1";

function loadAllCreditData() {
  try {
    const credit = JSON.parse(localStorage.getItem(CREDIT_STORAGE_KEY)) ?? {};
    const saved = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
    const txns = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) ?? {};
    
    const allClientsCredit = {};
    
    // Load from credit data
    Object.entries(credit).forEach(([clientId, data]) => {
      const cid = parseInt(clientId);
      allClientsCredit[cid] = {
        id: cid,
        name: data.name,
        balance: data.balance,
        transactions: data.transactions ?? [],
        isSaved: saved.some(c => c.id === cid),
        phone: saved.find(c => c.id === cid)?.phone || "N/A",
      };
    });
    
    return Object.values(allClientsCredit).sort((a, b) => b.balance - a.balance);
  } catch {
    return [];
  }
}

export default function CreditScreen({ onBack }) {
  const [credits, setCredits] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterAmount, setFilterAmount] = useState("all"); // "all", "overdue", "paid"
  const [paymentAmount, setPaymentAmount] = useState("");
  const [addCreditModal, setAddCreditModal] = useState(false);
  const [creditForm, setCreditForm] = useState({ clientId: "", amount: "", repaymentDate: "" });
  const [savedClients, setSavedClients] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCredits(loadAllCreditData());
    try {
      const saved = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
      setSavedClients(saved);
    } catch {
      setSavedClients([]);
    }
  };

  const saveCredit = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(CREDIT_STORAGE_KEY)) ?? {};
      const cid = parseInt(creditForm.clientId);
      const client = savedClients.find(c => c.id === cid);
      const amount = parseFloat(creditForm.amount);

      if (!amount || amount <= 0) {
        setErr("Please enter a valid amount");
        return;
      }

      if (!client) {
        setErr("Please select a client");
        return;
      }

      const clientCredit = existing[cid] ?? { name: client.name, balance: 0, transactions: [] };
      clientCredit.balance += amount;
      clientCredit.transactions = [
        {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          amount,
          type: "manual",
          description: `Manual credit entry - Due ${creditForm.repaymentDate || "N/A"}`,
        },
        ...(clientCredit.transactions ?? [])
      ];

      existing[cid] = clientCredit;
      localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(existing));
      
      setErr("");
      setCreditForm({ clientId: "", amount: "", repaymentDate: "" });
      setAddCreditModal(false);
      loadData();
    } catch (e) {
      setErr("Failed to save credit");
    }
  };

  const recordPayment = () => {
    try {
      const amount = parseFloat(paymentAmount);
      if (!selectedClient || amount <= 0) {
        setErr("Invalid amount");
        return;
      }

      const existing = JSON.parse(localStorage.getItem(CREDIT_STORAGE_KEY)) ?? {};
      const clientCredit = existing[selectedClient.id];
      if (!clientCredit) return;

      clientCredit.balance = Math.max(0, clientCredit.balance - amount);
      clientCredit.transactions = [
        {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          amount: -amount,
          type: "payment",
          description: "Payment received",
        },
        ...(clientCredit.transactions ?? [])
      ];

      existing[selectedClient.id] = clientCredit;
      localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(existing));

      setErr("");
      setPaymentAmount("");
      setSelectedClient(null);
      loadData();
    } catch (e) {
      setErr("Failed to record payment");
    }
  };

  const totalOwed = credits.reduce((s, c) => s + c.balance, 0);
  const overduCount = credits.filter(c => c.balance > 0).length;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 flex flex-col shadow-2xl min-h-screen relative">

        {/* ── Header ── */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-5">
          <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Finance</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Credit</h1>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
              <Bell size={17} />
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* Summary card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Outstanding</p>
              <div className="bg-amber-100 rounded-lg p-1.5"><CreditCard size={14} className="text-amber-600" /></div>
            </div>
            <p className="text-amber-700 text-2xl font-extrabold">UGX {totalOwed.toLocaleString()}</p>
            <p className="text-slate-400 text-xs mt-1">{overduCount} {overduCount === 1 ? "customer" : "customers"} with outstanding credit</p>
          </div>

          {/* List header with filter and add */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customers on Credit</p>
            <button
              onClick={() => setAddCreditModal(true)}
              className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Plus size={13} /> Add Credit
            </button>
          </div>

          {/* Customer cards */}
          {credits.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-slate-500 text-sm">No customers with credit yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {credits.filter(c => c.balance > 0).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-amber-300 hover:shadow-sm transition-all text-left w-full active:scale-98"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={17} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-bold truncate">{c.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-red-500 text-base font-extrabold">UGX {c.balance.toLocaleString()}</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Add credit modal ── */}
        {addCreditModal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => { setAddCreditModal(false); setErr(""); setCreditForm({ clientId: "", amount: "", repaymentDate: "" }); }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Add Credit to Client</h2>
                <button onClick={() => { setAddCreditModal(false); setErr(""); setCreditForm({ clientId: "", amount: "", repaymentDate: "" }); }} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {err && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm font-medium">
                    {err}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select Client</label>
                  <select
                    value={creditForm.clientId}
                    onChange={e => setCreditForm({ ...creditForm, clientId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  >
                    <option value="">Choose a trusted client...</option>
                    {savedClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount (UGX)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <input 
                      type="number"
                      placeholder="e.g. 45000" 
                      value={creditForm.amount}
                      onChange={e => setCreditForm({ ...creditForm, amount: e.target.value })}
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Repayment Date (Optional)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <input 
                      type="text"
                      placeholder="dd/mm/yyyy" 
                      value={creditForm.repaymentDate}
                      onChange={e => setCreditForm({ ...creditForm, repaymentDate: e.target.value })}
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none" 
                    />
                  </div>
                </div>
                <button 
                  onClick={saveCredit}
                  className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all mt-1">
                  Add Credit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Customer detail modal ── */}
        {selectedClient && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => { setSelectedClient(null); setPaymentAmount(""); setErr(""); }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">{selectedClient.name}</h2>
                <button onClick={() => { setSelectedClient(null); setPaymentAmount(""); setErr(""); }} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {err && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm font-medium">
                    {err}
                  </div>
                )}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Outstanding Balance</p>
                  <p className="text-red-500 text-3xl font-extrabold">UGX {selectedClient.balance.toLocaleString()}</p>
                </div>

                {/* Transaction history */}
                {selectedClient.transactions && selectedClient.transactions.length > 0 && (
                  <div className="max-h-40 overflow-y-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Transactions</p>
                    <div className="space-y-1.5">
                      {selectedClient.transactions.slice(0, 5).map(txn => (
                        <div key={txn.id} className="bg-slate-50 rounded-lg p-2 text-xs flex justify-between border border-slate-100">
                          <span className="text-slate-600">{txn.date}</span>
                          <span className={`font-bold ${txn.amount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                            {txn.amount > 0 ? "+" : ""} UGX {Math.abs(txn.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Record Payment (UGX)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <input
                      type="number"
                      placeholder="Enter amount paid"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={recordPayment}
                  className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}