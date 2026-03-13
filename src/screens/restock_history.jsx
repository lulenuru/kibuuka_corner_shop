import { useState } from "react";
import { ArrowLeft, Bell, Plus, Package, TrendingUp, X, Calendar, User } from "lucide-react";

const RESTOCK_HISTORY = [
  { id: 1, product: "Cooking Oil 2L", qty: 48, cost: 560000, supplier: "Mukwano Industries", date: "2026-03-11", addedBy: "Namukasa Rita" },
  { id: 2, product: "Sugar 1kg",      qty: 100, cost: 420000, supplier: "Kakira Sugar",       date: "2026-03-10", addedBy: "Ochieng David" },
  { id: 3, product: "Bread Loaf",     qty: 30,  cost: 90000,  supplier: "Kampala Bakery",     date: "2026-03-09", addedBy: "Namukasa Rita" },
  { id: 4, product: "Milk 500ml",     qty: 60,  cost: 132000, supplier: "Pearl Dairy",        date: "2026-03-08", addedBy: "Namutebi Brenda" },
  { id: 5, product: "Airtime MTN",    qty: 200, cost: 200000, supplier: "MTN Uganda",         date: "2026-03-07", addedBy: "Ochieng David" },
  { id: 6, product: "Cooking Oil 2L", qty: 24,  cost: 280000, supplier: "Mukwano Industries", date: "2026-03-05", addedBy: "Namukasa Rita" },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });
}

function daysAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

export default function RestockHistoryScreen({ onBack }) {
  const [modal, setModal]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]   = useState("all");

  const totalSpent  = RESTOCK_HISTORY.reduce((s, r) => s + r.cost, 0);
  const totalUnits  = RESTOCK_HISTORY.reduce((s, r) => s + r.qty, 0);

  const filtered = filter === "all"
    ? RESTOCK_HISTORY
    : RESTOCK_HISTORY.filter(r => r.product.toLowerCase().includes(filter.toLowerCase()));

  const uniqueProducts = [...new Set(RESTOCK_HISTORY.map(r => r.product))];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 flex flex-col shadow-2xl min-h-screen relative">

        {/* ── Header ── */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-5">
          <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inventory</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Restock History</h1>
              </div>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-xl px-3 py-2 text-emerald-300 text-xs font-bold hover:bg-emerald-400/30 transition-colors"
            >
              <Plus size={13} /> Add Restock
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-4"
          style={{ scrollbarWidth: "none" }}
        >

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Spent</p>
                <div className="bg-teal-100 rounded-lg p-1.5">
                  <TrendingUp size={14} className="text-teal-600" />
                </div>
              </div>
              <p className="text-teal-600 text-lg font-extrabold leading-tight">
                UGX {totalSpent.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs mt-1">all restocks</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units Added</p>
                <div className="bg-blue-100 rounded-lg p-1.5">
                  <Package size={14} className="text-blue-500" />
                </div>
              </div>
              <p className="text-blue-600 text-2xl font-extrabold">{totalUnits}</p>
              <p className="text-slate-400 text-xs mt-1">{RESTOCK_HISTORY.length} restock entries</p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setFilter("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filter === "all"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              All
            </button>
            {uniqueProducts.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filter === p
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Restock entries */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filtered.length} {filtered.length === 1 ? "Entry" : "Entries"}
          </p>

          <div className="flex flex-col gap-2.5">
            {filtered.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 hover:border-teal-300 hover:shadow-sm transition-all text-left w-full active:scale-[0.98]"
              >
                {/* icon */}
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={17} className="text-teal-500" />
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-bold truncate">{r.product}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Calendar size={9} /> {formatDate(r.date)}
                    </span>
                    <span className="text-slate-300 text-[10px]">·</span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <User size={9} /> {r.addedBy.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* amounts */}
                <div className="text-right shrink-0">
                  <p className="text-teal-600 text-sm font-extrabold">+{r.qty} units</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    UGX {r.cost.toLocaleString()}
                  </p>
                </div>

                {/* days ago badge */}
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg shrink-0">
                  {daysAgo(r.date)}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* ── Add Restock modal ── */}
        {modal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div
              onClick={() => setModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Record Restock</h2>
                <button
                  onClick={() => setModal(false)}
                  className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {[
                  { label: "Product Name",   placeholder: "e.g. Cooking Oil 2L"    },
                  { label: "Quantity Added", placeholder: "e.g. 48"                },
                  { label: "Total Cost (UGX)", placeholder: "e.g. 560000"          },
                  { label: "Supplier",       placeholder: "e.g. Mukwano Industries" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      {label}
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                      <input
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none"
                      />
                    </div>
                  </div>
                ))}
                <button className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all mt-1">
                  Save Restock Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Detail modal ── */}
        {selected && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Restock Details</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-3">

                {/* product + date */}
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                  <p className="text-teal-700 text-lg font-extrabold">{selected.product}</p>
                  <p className="text-slate-400 text-sm mt-1">{formatDate(selected.date)} · {daysAgo(selected.date)}</p>
                </div>

                {/* detail rows */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-teal-600 text-2xl font-extrabold">+{selected.qty}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Units Added</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-slate-800 text-base font-extrabold leading-tight">
                      UGX {selected.cost.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">Total Cost</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier</p>
                  <p className="text-slate-700 text-sm font-semibold">{selected.supplier}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recorded By</p>
                  <p className="text-slate-700 text-sm font-semibold">{selected.addedBy}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cost Per Unit</p>
                  <p className="text-slate-700 text-sm font-semibold">
                    UGX {Math.round(selected.cost / selected.qty).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}