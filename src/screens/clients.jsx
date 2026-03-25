import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Phone, Trash2, Edit2, TrendingUp } from "lucide-react";
import { Banknote, Smartphone, CreditCard } from "lucide-react";

const CLIENTS_STORAGE_KEY = "clients_v1";
const TRANSACTIONS_STORAGE_KEY = "transactions_v1";

function loadAllClientsData() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
    const txns = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) ?? {};
    
    // Combine saved clients with transaction data
    const allClients = {};
    
    // Add saved clients
    saved.forEach(client => {
      allClients[client.id] = {
        id: client.id,
        name: client.name,
        phone: client.phone,
        isSaved: true,
        transactions: txns[client.id]?.transactions ?? [],
      };
    });
    
    // Add clients from transactions (even if not manually saved)
    Object.entries(txns).forEach(([clientId, data]) => {
      const cid = parseInt(clientId);
      if (!allClients[cid]) {
        allClients[cid] = {
          id: cid,
          name: data.name,
          phone: "N/A",
          isSaved: false,
          transactions: data.transactions ?? [],
        };
      } else {
        allClients[cid].transactions = data.transactions ?? [];
      }
    });
    
    return Object.values(allClients).sort((a, b) => {
      const aLatest = a.transactions[0]?.date || "";
      const bLatest = b.transactions[0]?.date || "";
      return aLatest > bLatest ? -1 : 1;
    });
  } catch {
    return [];
  }
}

const paymentMethodIcon = (method) => {
  switch(method) {
    case "cash":
      return <Banknote size={14} className="text-emerald-500" />;
    case "momo":
      return <Smartphone size={14} className="text-blue-500" />;
    case "credit":
      return <CreditCard size={14} className="text-amber-500" />;
    default:
      return null;
  }
};

export default function ClientsScreen({ onBack }) {
  const [allClients, setAllClients] = useState([]);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    refreshClients();
  }, []);

  const refreshClients = () => {
    setAllClients(loadAllClientsData());
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setErr("Please fill in all fields");
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
      setErr("");

      if (editId) {
        const updated = saved.map(c => c.id === editId ? { ...c, name, phone } : c);
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
        setEditId(null);
      } else {
        const newClient = { id: Date.now(), name, phone, createdAt: new Date().toISOString() };
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify([...saved, newClient]));
      }

      setName("");
      setPhone("");
      setShowModal(false);
      refreshClients();
    } catch (e) {
      setErr("Failed to save client");
    }
  };

  const handleEdit = (client) => {
    setName(client.name);
    setPhone(client.phone);
    setEditId(client.id);
    setShowModal(true);
  };

  const handleDelete = (clientId) => {
    try {
      const saved = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
      const updated = saved.filter(c => c.id !== clientId);
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
      refreshClients();
    } catch (e) {
      console.error("Failed to delete client:", e);
    }
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    setEditId(null);
    setErr("");
    setShowModal(false);
  };

  const totalSpent = (client) => {
    return client.transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 shadow-2xl min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-5">
          <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Clients</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">All Customers</h1>
              </div>
            </div>
            <button
              onClick={() => { setEditId(null); setName(""); setPhone(""); setErr(""); setShowModal(true); }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10" style={{ scrollbarWidth: "none" }}>
          {allClients.length === 0 ? (
            <div className="text-center mt-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">No customers yet</p>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">Customers will appear here as you record sales</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allClients.map(client => (
                <div key={client.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  {/* Client header */}
                  <button
                    onClick={() => setExpandedClientId(expandedClientId === client.id ? null : client.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-800 font-semibold truncate">{client.name}</p>
                        {client.isSaved && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded">Saved</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                        <Phone size={12} /> {client.phone}
                      </p>
                    </div>
                    <div className="text-right mr-3">
                      <p className="text-emerald-500 font-bold">{client.transactions.length}</p>
                      <p className="text-slate-400 text-xs">purchases</p>
                    </div>
                  </button>

                  {/* Expanded transactions */}
                  {expandedClientId === client.id && (
                    <div className="border-t border-slate-200 bg-slate-50">
                      {/* Stats */}
                      <div className="px-4 py-3 flex gap-2">
                        <div className="flex-1 bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Total Spent</p>
                          <p className="text-sm font-bold text-emerald-600">UGX {totalSpent(client).toLocaleString()}</p>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Transactions</p>
                          <p className="text-sm font-bold text-slate-700">{client.transactions.length}</p>
                        </div>
                      </div>

                      {/* Transactions */}
                      {client.transactions.length > 0 ? (
                        <div className="px-4 pb-3 space-y-2 max-h-60 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                          {client.transactions.map(txn => (
                            <div key={txn.id} className="bg-white rounded-lg p-2.5 text-sm border border-slate-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {paymentMethodIcon(txn.method)}
                                  <span className="text-xs font-medium text-slate-600">{txn.methodLabel}</span>
                                </div>
                                <span className="font-bold text-slate-700">UGX {txn.amount.toLocaleString()}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                {txn.date} {txn.time && `• ${txn.time}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="px-4 pb-3 text-xs text-slate-400">No transactions</p>
                      )}

                      {/* Actions */}
                      {client.isSaved && (
                        <div className="px-4 pb-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="flex-1 px-2 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="flex-1 px-2 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-slate-800 font-bold text-lg">
                  {editId ? "Edit Client" : "Add New Client"}
                </h2>
                <button onClick={handleCancel} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {err && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm font-medium">
                  {err}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lule Nuru"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="070XX XXX XXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 h-[52px] border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:from-emerald-500 hover:to-emerald-600 transition-all"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
