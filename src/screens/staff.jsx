import { useState } from "react";
import { ArrowLeft, Bell, Plus, User, Clock, X, ShoppingCart, Shield } from "lucide-react";

const STAFF = [
  { id: 1, name: "Namukasa Rita",   role: "manager",   shift: "8am – 4pm",  sales: 23, phone: "0772 001 001" },
  { id: 2, name: "Ochieng David",   role: "cashier",   shift: "8am – 4pm",  sales: 18, phone: "0701 002 002" },
  { id: 3, name: "Namutebi Brenda", role: "assistant", shift: "4pm – 10pm", sales: 6,  phone: "0782 003 003" },
];

const ROLE_STYLE = {
  manager:   { badge: "bg-violet-100 text-violet-600",   dot: "bg-violet-400"   },
  cashier:   { badge: "bg-sky-100 text-sky-600",         dot: "bg-sky-400"      },
  assistant: { badge: "bg-slate-100 text-slate-500",     dot: "bg-slate-400"    },
};

export default function StaffScreen({ onBack }) {
  const [modal, setModal]     = useState(false);
  const [selected, setSelected] = useState(null);

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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Team</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Staff</h1>
              </div>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-xl px-3 py-2 text-emerald-300 text-xs font-bold hover:bg-emerald-400/30 transition-colors"
            >
              <Plus size={13} /> Add Staff
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Staff", val: STAFF.length,                                       color: "text-slate-700" },
              { label: "On Shift",    val: STAFF.filter(s => s.shift.includes("8am")).length,  color: "text-emerald-500" },
              { label: "Sales Today", val: STAFF.reduce((a, s) => a + s.sales, 0),             color: "text-blue-500" },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                <p className={`text-xl font-extrabold ${color}`}>{val}</p>
                <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Members</p>

          {/* Staff cards */}
          <div className="flex flex-col gap-2.5">
            {STAFF.map(s => {
              const rs = ROLE_STYLE[s.role];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all text-left w-full active:scale-98"
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-slate-500" />
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${rs.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-bold">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rs.badge}`}>{s.role}</span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock size={9} /> {s.shift}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-500 text-base font-extrabold">{s.sales}</p>
                    <p className="text-slate-400 text-[10px]">sales today</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Add staff modal ── */}
        {modal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => setModal(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Add Staff Member</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {[
                  { label: "Full Name",    placeholder: "e.g. Nakato Sarah"  },
                  { label: "Phone",        placeholder: "07XX XXX XXX"        },
                  { label: "Shift Hours",  placeholder: "e.g. 8am – 4pm"     },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                      <input placeholder={placeholder} className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none" />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                  <select className="w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all">
                    <option value="cashier">Cashier</option>
                    <option value="assistant">Assistant</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <button className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all mt-1">
                  Register Staff
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Staff detail modal ── */}
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
              <div className="p-5 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <ShoppingCart size={16} className="text-emerald-400 mx-auto mb-1" />
                    <p className="text-emerald-600 text-2xl font-extrabold">{selected.sales}</p>
                    <p className="text-slate-400 text-xs">Sales today</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <Shield size={16} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-600 text-sm font-bold capitalize mt-1">{selected.role}</p>
                    <p className="text-slate-400 text-xs">Role</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-slate-700 text-sm font-semibold">{selected.phone}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Shift</p>
                  <p className="text-slate-700 text-sm font-semibold">{selected.shift}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}