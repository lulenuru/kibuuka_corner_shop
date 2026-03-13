import { useState } from "react";
import { ArrowLeft, Plus, AlertTriangle, Package, Bell, X, TrendingDown } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Cooking Oil 2L", category: "Groceries", price: 14000, stock: 24 },
  { id: 2, name: "Sugar 1kg",      category: "Groceries", price: 4500,  stock: 3  },
  { id: 3, name: "Airtime MTN",    category: "Airtime",   price: 1000,  stock: 100 },
  { id: 4, name: "Bread Loaf",     category: "Bakery",    price: 3500,  stock: 2  },
  { id: 5, name: "Milk 500ml",     category: "Dairy",     price: 2500,  stock: 4  },
];

const LOW_STOCK = PRODUCTS.filter(p => p.stock < 10);

export default function InventoryScreen({ onBack }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name: "", category: "", price: "", stock: "" });

  const Field = ({ label, field, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 h-[48px] focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
        <input
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none"
        />
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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Stock</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Inventory</h1>
              </div>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-xl px-3 py-2 text-emerald-300 text-xs font-bold hover:bg-emerald-400/30 transition-colors"
            >
              <Plus size={13} /> Add Product
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</p>
                <div className="bg-blue-100 rounded-lg p-1.5"><Package size={14} className="text-blue-500" /></div>
              </div>
              <p className="text-blue-600 text-2xl font-extrabold">48</p>
              <p className="text-slate-400 text-xs mt-1">total items</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Stock</p>
                <div className="bg-red-100 rounded-lg p-1.5"><AlertTriangle size={14} className="text-red-400" /></div>
              </div>
              <p className="text-red-500 text-2xl font-extrabold">{LOW_STOCK.length}</p>
              <p className="text-slate-400 text-xs mt-1">need restocking</p>
            </div>
          </div>

          {/* Low stock alert */}
          {LOW_STOCK.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-100 rounded-lg p-1.5">
                  <AlertTriangle size={13} className="text-amber-600" />
                </div>
                <p className="text-amber-700 text-sm font-bold">Low Stock Alert</p>
              </div>
              {LOW_STOCK.map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-amber-100 last:border-0">
                  <span className="text-slate-700 text-sm font-medium">{item.name}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingDown size={10} /> {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Product list */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Products</p>

          <div className="flex flex-col gap-2.5">
            {PRODUCTS.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-800 text-sm font-semibold">{p.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{p.category} · UGX {p.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.stock < 10
                      ? "bg-red-50 text-red-500 border border-red-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}>
                    {p.stock}
                  </span>
                  <button className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                    <Plus size={14} className="text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add product modal ── */}
        {modal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <div onClick={() => setModal(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative w-full bg-white rounded-t-3xl z-10 flex flex-col">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Add New Product</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <Field label="Product Name"  field="name"     placeholder="e.g. Cooking Oil 2L" />
                <Field label="Category"      field="category" placeholder="e.g. Groceries"      />
                <Field label="Price (UGX)"   field="price"    type="number" placeholder="e.g. 14000" />
                <Field label="Initial Stock" field="stock"    type="number" placeholder="e.g. 24"    />
                <button className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all mt-1">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}