import { useState, useEffect } from "react";
import {
  ArrowLeft, Plus, Minus, Trash2, Search,
  X, Banknote, Smartphone, CreditCard, CheckCircle, Bell, ChevronDown, User,
} from "lucide-react";

const CLIENTS_STORAGE_KEY = "clients_v1";
const KA_MONEY_STORAGE_KEY = "kaMoneyState_v1";
const REWARD_PER_TXN = 500;

const PRODUCTS = [
  { id: 1, name: "Cooking Oil 2L", category: "Groceries", price: 14000, stock: 24 },
  { id: 2, name: "Sugar 1kg",      category: "Groceries", price: 4500,  stock: 3  },
  { id: 3, name: "Airtime MTN",    category: "Airtime",   price: 1000,  stock: 100 },
  { id: 4, name: "Bread Loaf",     category: "Bakery",    price: 3500,  stock: 2  },
  { id: 5, name: "Milk 500ml",     category: "Dairy",     price: 2500,  stock: 4  },
];

const PAY_METHODS = [
  { key: "cash",   label: "Cash",         icon: Banknote,   on: "border-emerald-400 bg-emerald-50 text-emerald-600", off: "border-slate-200 bg-white text-slate-400" },
  { key: "momo",   label: "Mobile Money", icon: Smartphone, on: "border-blue-400 bg-blue-50 text-blue-600",         off: "border-slate-200 bg-white text-slate-400" },
  { key: "credit", label: "Credit",       icon: CreditCard, on: "border-amber-400 bg-amber-50 text-amber-600",      off: "border-slate-200 bg-white text-slate-400" },
];

export default function SalesScreen({ onBack }) {
  const [cart, setCart]              = useState([]);
  const [payment, setPayment]        = useState("cash");
  const [modal, setModal]            = useState(false);
  const [search, setSearch]          = useState("");
  const [success, setSuccess]        = useState(false);
  const [clientType, setClientType]  = useState("general"); // "general" or clientId
  const [clients, setClients]        = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
      setClients(stored);
    } catch {
      setClients([]);
    }
  }, []);

  const addToKaMoney = (selectedClientId) => {
    try {
      const existing = JSON.parse(localStorage.getItem(KA_MONEY_STORAGE_KEY)) ?? {};
      const clientKey = `client_${selectedClientId}`;
      const clientData = existing[clientKey] ?? { txns: [], redeemed: false };
      
      clientData.txns = [
        { id: Date.now(), date: new Date().toLocaleDateString(), amount: total, type: "MM" },
        ...(clientData.txns ?? [])
      ];
      clientData.redeemed = false;
      
      existing[clientKey] = clientData;
      localStorage.setItem(KA_MONEY_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to save ka money:", e);
    }
  };

  const addToCart = (p) => {
    setCart(c => c.find(i => i.id === p.id)
      ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      : [...c, { ...p, qty: 1 }]);
    setModal(false); setSearch("");
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { setCart(c => c.filter(i => i.id !== id)); return; }
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const payLabel = PAY_METHODS.find(m => m.key === payment)?.label;

  /* ── Success screen ── */
  const selectedClient = clients.find(c => c.id === parseInt(clientType));
  const successMsg = selectedClient ? `${selectedClient.name}` : "General Customer";
  const kaMoneyAdded = payment === "momo" && selectedClient;

  if (success) return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 flex flex-col items-center justify-center gap-5 px-8 shadow-2xl min-h-screen">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={42} className="text-emerald-500" />
        </div>
        <h2 className="text-slate-800 text-2xl font-extrabold text-center">Sale Complete!</h2>
        <p className="text-emerald-500 text-3xl font-extrabold">UGX {total.toLocaleString()}</p>
        <div className="text-center">
          <p className="text-slate-400 text-sm">Payment via {payLabel}</p>
          <p className="text-slate-600 text-sm font-medium mt-1">Customer: {successMsg}</p>
          {kaMoneyAdded && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-xs font-bold">✓ Ka Money +UGX {REWARD_PER_TXN} added to {selectedClient.name}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => { setCart([]); setSuccess(false); setClientType("general"); }}
          className="mt-2 w-56 h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all"
        >
          New Sale
        </button>
      </div>
    </div>
  );

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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sales</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Record Sale</h1>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
              <Bell size={17} />
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* Client selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Selling To</p>
            <div className="relative">
              <button
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 hover:border-emerald-300 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <User size={16} className={clientType === "general" ? "text-slate-400" : "text-blue-500"} />
                  <span className="text-sm font-medium text-slate-700">
                    {clientType === "general" ? "General Customer" : selectedClient?.name ?? "Select Client"}
                  </span>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {showClientDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg z-40">
                  <button
                    onClick={() => { setClientType("general"); setShowClientDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-slate-100 hover:bg-slate-50 transition-colors ${clientType === "general" ? "bg-emerald-50 text-emerald-600" : "text-slate-700"}`}
                  >
                    General Customer (One-time)
                  </button>
                  {clients.length > 0 && (
                    <>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 pt-2">Trusted Clients</p>
                      {clients.map(client => (
                        <button
                          key={client.id}
                          onClick={() => { setClientType(client.id); setShowClientDropdown(false); }}
                          className={`w-full text-left px-4 py-3 text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors ${clientType === client.id ? "bg-blue-50" : ""}`}
                        >
                          <p className="font-medium text-slate-700">{client.name}</p>
                          <p className="text-xs text-slate-400">{client.phone}</p>
                        </button>
                      ))}
                    </>
                  )}
                  {clients.length === 0 && (
                    <p className="text-xs text-slate-400 px-4 py-2">No saved clients. Go to Clients to add.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add product */}
          <button
            onClick={() => setModal(true)}
            className="w-full flex items-center gap-3 bg-white border-2 border-dashed border-emerald-200 rounded-2xl px-4 py-3.5 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all active:scale-98"
          >
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <Plus size={18} className="text-emerald-500" />
            </div>
            <span className="text-slate-500 text-sm font-semibold">Add Product to Cart</span>
          </button>

          {/* Cart items */}
          {cart.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Cart · {cart.length} {cart.length === 1 ? "item" : "items"}
              </p>
              <div className="flex flex-col gap-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-[13px] font-semibold truncate">{item.name}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">UGX {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                        <Minus size={11} className="text-slate-500" />
                      </button>
                      <span className="text-slate-800 text-sm font-bold w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                        <Plus size={11} className="text-slate-500" />
                      </button>
                    </div>
                    <p className="text-emerald-500 text-[13px] font-bold w-16 text-right shrink-0">
                      {(item.price * item.qty).toLocaleString()}
                    </p>
                    <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-200 mt-3 pt-3 flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Total</span>
                <span className="text-slate-800 text-2xl font-extrabold">UGX {total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Payment method */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {PAY_METHODS.map(({ key, label, icon: Icon, on, off }) => (
                <button
                  key={key}
                  onClick={() => setPayment(key)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all duration-150 ${payment === key ? on : off}`}
                >
                  <Icon size={20} strokeWidth={payment === key ? 2.5 : 1.8} />
                  <span className="text-[11px] font-bold leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checkout */}
          {cart.length > 0 && (
            <button
              onClick={() => {
                if (payment === "momo" && clientType !== "general") {
                  addToKaMoney(parseInt(clientType));
                }
                setSuccess(true);
              }}
              className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all"
            >
              Complete Sale · UGX {total.toLocaleString()}
            </button>
          )}
        </div>

        {/* ── Product modal ── */}
        {modal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => { setModal(false); setSearch(""); }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10 flex flex-col max-h-[80%]">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Select Product</h2>
                <button onClick={() => { setModal(false); setSearch(""); }} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex flex-col gap-3">
                {/* search */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-11 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search product…"
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                  />
                  {search && <button onClick={() => setSearch("")}><X size={13} className="text-slate-400" /></button>}
                </div>

                {filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left w-full"
                  >
                    <div>
                      <p className="text-slate-800 text-sm font-semibold">{p.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-500 text-sm font-bold">UGX {p.price.toLocaleString()}</p>
                      <p className={`text-xs mt-0.5 font-medium ${p.stock < 10 ? "text-red-400" : "text-slate-400"}`}>
                        {p.stock} in stock
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}