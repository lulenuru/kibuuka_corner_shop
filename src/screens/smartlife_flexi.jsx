import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ShieldCheck, Save, Clock3, Info, ExternalLink, Plus, X } from "lucide-react";
import nssfImage from "../assets/nssf.jpg";

const STORAGE_KEY = "smartlifeFlexi_v1";
const MIN_CONTRIBUTION = 5000;
const DEFAULT_PLAN = {
  monthlyContribution: 30000,
  nextPaymentDate: new Date().toISOString().slice(0, 10),
  lastPaidDate: "",
  totalSaved: 0,
  notes: "",
  deposits: [], // Array of {date, amount, type: "self" or "staff"}
};

export default function SmartLifeFlexiScreen({ onBack }) {
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULT_PLAN.monthlyContribution);
  const [nextPaymentDate, setNextPaymentDate] = useState(DEFAULT_PLAN.nextPaymentDate);
  const [lastPaidDate, setLastPaidDate] = useState(DEFAULT_PLAN.lastPaidDate);
  const [totalSaved, setTotalSaved] = useState(DEFAULT_PLAN.totalSaved);
  const [notes, setNotes] = useState(DEFAULT_PLAN.notes);
  const [deposits, setDeposits] = useState(DEFAULT_PLAN.deposits);
  const [saved, setSaved] = useState(false);
  const [contributionError, setContributionError] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositType, setDepositType] = useState("self");
  const [depositAccountNumber, setDepositAccountNumber] = useState("");

  useEffect(() => {
    // Load SmartLife data
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored) {
        setMonthlyContribution(stored.monthlyContribution ?? DEFAULT_PLAN.monthlyContribution);
        setNextPaymentDate(stored.nextPaymentDate ?? DEFAULT_PLAN.nextPaymentDate);
        setLastPaidDate(stored.lastPaidDate ?? DEFAULT_PLAN.lastPaidDate);
        setTotalSaved(stored.totalSaved ?? DEFAULT_PLAN.totalSaved);
        setNotes(stored.notes ?? DEFAULT_PLAN.notes);
        setDeposits(stored.deposits ?? DEFAULT_PLAN.deposits);
      }
    } catch (e) {
      console.error("Failed to load SmartLife Flexi plan:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ monthlyContribution, nextPaymentDate, lastPaidDate, totalSaved, notes, deposits })
      );
    } catch (e) {
      console.error("Failed to save SmartLife Flexi plan:", e);
    }
  }, [monthlyContribution, nextPaymentDate, lastPaidDate, totalSaved, notes, deposits]);

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  const handleContributionChange = (value) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
    const amount = Number.isNaN(parsed) ? 0 : parsed;
    setMonthlyContribution(amount);
    if (amount > 0 && amount < MIN_CONTRIBUTION) {
      setContributionError(`SmartLife Flexi minimum contribution is UGX ${MIN_CONTRIBUTION.toLocaleString()}`);
    } else {
      setContributionError("");
    }
  };

  const handleMarkPayment = () => {
    if (monthlyContribution < MIN_CONTRIBUTION) {
      setContributionError(`Every payment must be at least UGX ${MIN_CONTRIBUTION.toLocaleString()}`);
      return;
    }

    const today = new Date();
    const nextMonth = new Date(nextPaymentDate || today.toISOString().slice(0, 10));
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setLastPaidDate(today.toISOString().slice(0, 10));
    setNextPaymentDate(nextMonth.toISOString().slice(0, 10));
    setTotalSaved((current) => current + monthlyContribution);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const handleAddDeposit = () => {
    const amount = parseInt(depositAmount.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(amount) || amount < MIN_CONTRIBUTION) {
      alert(`Deposit must be at least UGX ${MIN_CONTRIBUTION.toLocaleString()}`);
      return;
    }

    const newDeposit = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      amount,
      type: depositType,
      accountNumber: depositAccountNumber,
    };

    setDeposits((prev) => [newDeposit, ...prev]);
    setTotalSaved((current) => current + amount);
    setDepositAmount("");
    setDepositType("self");
    setDepositAccountNumber("");
    setShowDepositModal(false);
  };

  const recentDeposits = deposits.slice(0, 5); // Show last 5

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-slate-50 shadow-2xl rounded-[32px] overflow-hidden">
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-6">
          <div className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/15 text-white hover:bg-white/25 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">SmartLife Flexi</p>
              <h1 className="text-white text-xl font-extrabold mt-1">Savings Tracker</h1>
            </div>
          </div>
        </header>

        <div className="p-5 space-y-5">
          {/* Total Savings */}
          <div className="rounded-3xl bg-slate-900/95 p-5 text-slate-100 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Total Savings</p>
                <h2 className="text-3xl font-extrabold mt-2">UGX {totalSaved.toLocaleString()}</h2>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <Save size={24} />
              </div>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Recent Deposits</h3>
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
              >
                <Plus size={14} />
                Make Deposit
              </button>
            </div>
            {recentDeposits.length > 0 ? (
              <div className="space-y-3">
                {recentDeposits.map((deposit) => (
                  <div key={deposit.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">UGX {deposit.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{formatDate(deposit.date)} • {deposit.type === "self" ? "Self" : "Staff"} • {deposit.accountNumber || "No account"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No deposits yet</p>
            )}
          </div>



          <div className="rounded-3xl border border-slate-200 bg-white p-5 overflow-hidden">
            <img
              src={nssfImage}
              alt="NSSF SmartLife Flexi"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDepositModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 w-80 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-700">Make Deposit</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="self"
                  checked={depositType === "self"}
                  onChange={(e) => setDepositType(e.target.value)}
                />
                Self
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="staff"
                  checked={depositType === "staff"}
                  onChange={(e) => setDepositType(e.target.value)}
                />
                Staff
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
            <input
              type="text"
              value={depositAccountNumber}
              onChange={(e) => setDepositAccountNumber(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none focus:border-blue-400 mb-4"
              placeholder="Enter account number"
            />
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount (UGX)</label>
            <input
              type="text"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none focus:border-blue-400 mb-4"
              inputMode="numeric"
              placeholder="Enter amount"
            />
            <button
              onClick={handleAddDeposit}
              className="w-full rounded-3xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition-all"
            >
              Add Deposit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
