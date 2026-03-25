import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Phone, Trash2, User, Edit2 } from "lucide-react";

const STORAGE_KEY = "clients_v1";

function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export default function ClientsScreen({ onBack }) {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setClients(loadClients());
  }, []);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setErr("Please fill in all fields");
      return;
    }

    setErr("");
    
    if (editId) {
      // Edit existing
      setClients(clients.map(c => c.id === editId ? { ...c, name, phone } : c));
      setEditId(null);
    } else {
      // Add new
      setClients([...clients, { id: Date.now(), name, phone, createdAt: new Date().toISOString() }]);
    }
    
    setName("");
    setPhone("");
    setShowModal(false);
  };

  const handleEdit = (client) => {
    setName(client.name);
    setPhone(client.phone);
    setEditId(client.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    setEditId(null);
    setErr("");
    setShowModal(false);
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
                <h1 className="text-white text-xl font-extrabold mt-0.5 flex items-center gap-2">
                  <User size={18} />
                  Trusted Clients
                </h1>
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
          {clients.length === 0 ? (
            <div className="text-center mt-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">No clients yet</p>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">Add your trusted customers to enable Ka Money savings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map(client => (
                <div key={client.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold">{client.name}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                      <Phone size={12} /> {client.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
