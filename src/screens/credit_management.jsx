import { useState } from "react";
import { ArrowLeft, Bell, Plus, User, Clock, ChevronRight, CreditCard, X } from "lucide-react";

const CUSTOMERS = [
  { id: 1, name: "Nakato Sarah",    phone: "0772 123 456", balance: 45000,  purchases: 3, overdue: true  },
  { id: 2, name: "Ssemakula John",  phone: "0701 987 654", balance: 120000, purchases: 7, overdue: false },
  { id: 3, name: "Apio Grace",      phone: "0782 456 789", balance: 22500,  purchases: 2, overdue: true  },
  { id: 4, name: "Matovu Brian",    phone: "0753 321 900", balance: 67000,  purchases: 5, overdue: false },
];

export default function CreditScreen({ onBack }) {
  const [modal, setModal]     = useState(false);
  const [selected, setSelected] = useState(null);
  const totalOwed = CUSTOMERS.reduce((s, c) => s + c.balance, 0);

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
            <p className="text-slate-400 text-xs mt-1">{CUSTOMERS.length} customers with debt</p>
          </div>

          {/* Overdue note */}
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <Clock size={14} className="text-red-400 shrink-0" />
            <p className="text-red-500 text-sm font-medium">
              {CUSTOMERS.filter(c => c.overdue).length} customers have overdue payments
            </p>
          </div>

          {/* List header */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customers</p>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Plus size={13} /> Add Credit
            </button>
          </div>

          {/* Customer cards */}
          <div className="flex flex-col gap-2.5">
            {CUSTOMERS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-amber-300 hover:shadow-sm transition-all text-left w-full active:scale-98"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <User size={17} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-bold truncate">{c.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{c.phone}</p>
                  {c.overdue && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={10} className="text-red-400" />
                      <span className="text-red-400 text-[10px] font-bold">Overdue</span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-red-500 text-base font-extrabold">UGX {c.balance.toLocaleString()}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{c.purchases} purchases</p>
                </div>
                <ChevronRight size={15} className="text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Add credit modal ── */}
        {modal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => setModal(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Record Credit Purchase</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {[
                  { label: "Customer Name",  placeholder: "Full name" },
                  { label: "Phone Number",   placeholder: "07XX XXX XXX" },
                  { label: "Amount (UGX)",   placeholder: "e.g. 45000" },
                  { label: "Repayment Date", placeholder: "dd/mm/yyyy" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                      <input placeholder={placeholder} className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none" />
                    </div>
                  </div>
                ))}
                <button className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all mt-1">
                  Record Credit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Customer detail modal ── */}
        {selected && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Outstanding Balance</p>
                  <p className="text-red-500 text-3xl font-extrabold">UGX {selected.balance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Record Payment (UGX)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <input type="number" placeholder="Enter amount paid" className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none" />
                  </div>
                </div>
                <button className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all">
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