import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PiggyBank, CreditCard, CheckCircle2, User } from "lucide-react";

const REWARD_PER_TXN = 500;
const REDEEM_THRESHOLD = 10;
const STORAGE_KEY = "kaMoneyState_v1";
const CLIENTS_STORAGE_KEY = "clients_v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function KaMoneyScreen({ onBack }) {
  const [clientType, setClientType] = useState("auto");
  const [customer, setCustomer] = useState("");
  const [txns, setTxns] = useState([]);
  const [redeemed, setRedeemed] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    setClients(loadClients());
  }, []);

  useEffect(() => {
    const stored = loadState();
    
    if (clientType === "auto") {
      // Load auto-generated transactions
      const allTxns = Object.entries(stored)
        .filter(([key]) => key.startsWith("client_"))
        .flatMap(([key, data]) => {
          const clientId = parseInt(key.replace("client_", ""));
          return (data.txns || []).map(txn => ({ ...txn, clientId }));
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTxns(allTxns);
      setRedeemed(false);
      setCustomer("");
      setSelectedClientId(null);
    } else if (clientType === "manual") {
      // Load manual entry (keep original behavior)
      if (stored.customer) setCustomer(stored.customer);
      if (stored.txns) setTxns(stored.txns);
      if (stored.redeemed) setRedeemed(stored.redeemed);
    } else if (clientType.startsWith("client_")) {
      // Load specific client
      const cid = parseInt(clientType.replace("client_", ""));
      setSelectedClientId(cid);
      const clientData = stored[clientType] ?? { txns: [], redeemed: false };
      if (clientData.txns) setTxns(clientData.txns);
      if (clientData.redeemed) setRedeemed(clientData.redeemed);
      setCustomer("");
    }
  }, [clientType]);

  useEffect(() => {
    if (clientType === "manual") {
      saveState({ customer, txns, redeemed });
    } else if (clientType.startsWith("client_")) {
      const stored = loadState();
      stored[clientType] = { txns, redeemed };
      saveState(stored);
    }
  }, [customer, txns, redeemed, clientType]);

  const mmTxns = useMemo(() => txns.filter(t => t.type === "MM"), [txns]);
  const earned = mmTxns.length * REWARD_PER_TXN;
  const remaining = Math.max(0, REDEEM_THRESHOLD - mmTxns.length);
  const canRedeem = !redeemed && mmTxns.length >= REDEEM_THRESHOLD;

  const addMMTransaction = () => {
    if (!customer.trim()) return;
    setTxns(prev => [
      { id: Date.now(), date: new Date().toLocaleDateString(), amount: 0, type: "MM" },
      ...prev,
    ]);
    setRedeemed(false);
  };

  const handleRedeem = () => {
    if (!canRedeem) return;
    setRedeemed(true);
    // TODO: wire this to backend / actual award logic.
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 shadow-2xl min-h-screen flex flex-col">

        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-5">
          <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Ka Money</p>
              <h1 className="text-white text-xl font-extrabold mt-0.5 flex items-center gap-2">
                <PiggyBank size={18} />
                Savings Jar
              </h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">
          
          {/* View selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setClientType("auto")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                clientType === "auto" 
                  ? "bg-blue-500 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setClientType("manual")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                clientType === "manual" 
                  ? "bg-blue-500 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* Client selector or manual input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            {clientType === "auto" ? (
              <>
                <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">View by client</label>
                <select
                  value={clientType === "manual" ? "" : (selectedClientId ? `client_${selectedClientId}` : "auto")}
                  onChange={(e) => {
                    if (e.target.value) setClientType(e.target.value);
                    else setClientType("auto");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="auto">All clients transactions</option>
                  {clients.map(client => (
                    <option key={client.id} value={`client_${client.id}`}>
                      {client.name} ({client.phone})
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400">Customer name</label>
                  <input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g. Lule Nuru"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {/* Stats and actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Earned</p>
                <p className="text-2xl font-extrabold text-emerald-700">UGX {earned.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">MM Purchases</p>
                <p className="text-2xl font-extrabold text-slate-700">{mmTxns.length}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              {clientType !== "auto" && (
                <>
                  <button
                    onClick={addMMTransaction}
                    disabled={clientType === "manual" && !customer.trim()}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      (clientType !== "manual" || customer.trim())
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Add MM transaction
                  </button>

                  <button
                    onClick={handleRedeem}
                    disabled={!canRedeem}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      canRedeem
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {redeemed ? "Redeemed" : "Redeem"}
                  </button>
                </>
              )}
            </div>

            {clientType !== "auto" && (
              <p className="mt-3 text-xs text-slate-500">
                {redeemed
                  ? "You have redeemed your Ka Money reward."
                  : remaining > 0
                  ? `${remaining} more mobile money purchases to unlock redemption.`
                  : "Ready to redeem! Tap redeem to claim."}
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-800 text-sm font-bold">Recent MM transactions</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <CreditCard size={14} /> Mobile money
              </div>
            </div>

            {mmTxns.length === 0 ? (
              <p className="text-xs text-slate-400">No mobile money transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {mmTxns.slice(0, 6).map((txn) => {
                  const client = txn.clientId ? clients.find(c => c.id === txn.clientId) : null;
                  return (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {txn.amount > 0 ? `UGX ${txn.amount.toLocaleString()}` : "UGX 0"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {txn.date}
                          {client && ` • ${client.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={14} /> +UGX {REWARD_PER_TXN}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}