import { ArrowLeft, Bell, TrendingUp, TrendingDown, ShoppingCart, CreditCard, Package, BarChart2, DollarSign } from "lucide-react";

const TOP_PRODUCTS = [
  { name: "Cooking Oil 2L", sales: 18, revenue: 252000, pct: 90 },
  { name: "Airtime MTN",    sales: 31, revenue: 31000,  pct: 55 },
  { name: "Sugar 1kg",      sales: 14, revenue: 63000,  pct: 40 },
  { name: "Milk 500ml",     sales: 9,  revenue: 22500,  pct: 25 },
];

const DAILY = [
  { day: "Mon", sales: 210000 },
  { day: "Tue", sales: 175000 },
  { day: "Wed", sales: 290000 },
  { day: "Thu", sales: 230000 },
  { day: "Fri", sales: 284000 },
];
const maxSales = Math.max(...DAILY.map(d => d.sales));

// New: Sample expenses data (replace with real data from your backend)
const EXPENSES = [
  { category: "Wholesaler Restock", amount: 150000 },
  { category: "Transport", amount: 25000 },
  { category: "Electricity", amount: 10000 },
  { category: "Other", amount: 15000 },
];
const totalExpenses = EXPENSES.reduce((sum, e) => sum + e.amount, 0);

// New: Daily expenses for comparison (sample data)
const DAILY_EXPENSES = [
  { day: "Mon", expenses: 50000 },
  { day: "Tue", expenses: 30000 },
  { day: "Wed", expenses: 70000 },
  { day: "Thu", expenses: 40000 },
  { day: "Fri", expenses: 60000 },
];
const maxExpenses = Math.max(...DAILY_EXPENSES.map(d => d.expenses));
const maxCombined = Math.max(maxSales, maxExpenses);

function StatCard({ label, value, sub, icon: Icon, bgColor, textColor, iconBg, trend }) {
  return (
    <div className={`${bgColor} border rounded-2xl p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`${iconBg} rounded-lg p-1.5`}>
          <Icon size={14} className={textColor} />
        </div>
      </div>
      <p className={`${textColor} text-2xl font-extrabold`}>{value}</p>
      {sub  && <p className="text-slate-400 text-xs">{sub}</p>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? "text-emerald-500" : "text-red-400"}`}>
          {trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </div>
  );
}

export default function ReportsScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-slate-50 flex flex-col shadow-2xl min-h-screen">

        {/* ── Header ── */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-5">
          <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Analytics</p>
                <h1 className="text-white text-xl font-extrabold mt-0.5">Reports</h1>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
              <Bell size={17} />
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* Period toggle */}
          <div className="flex bg-slate-200 rounded-xl p-1 gap-1">
            {["Today", "This Week", "This Month"].map((t, i) => (
              <button key={t} className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${i === 0 ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Revenue"     value="UGX 284K"
              sub="today"         trend={12}
              icon={TrendingUp}
              bgColor="bg-emerald-50 border-emerald-100"
              textColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <StatCard
              label="Transactions" value="47"
              sub="sales today"
              icon={ShoppingCart}
              bgColor="bg-blue-50 border-blue-100"
              textColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <StatCard
              label="Outstanding"  value="UGX 187K"
              sub="credit owed"
              icon={CreditCard}
              bgColor="bg-amber-50 border-amber-100"
              textColor="text-amber-600"
              iconBg="bg-amber-100"
            />
            <StatCard
              label="Low Stock"    value="3"
              sub="items"
              icon={Package}
              bgColor="bg-red-50 border-red-100"
              textColor="text-red-500"
              iconBg="bg-red-100"
            />
            {/* New: Expenses stat card */}
            <StatCard
              label="Expenses"    value={`UGX ${totalExpenses.toLocaleString()}`}
              sub="this week"
              icon={DollarSign}
              bgColor="bg-purple-50 border-purple-100"
              textColor="text-purple-600"
              iconBg="bg-purple-100"
            />
          </div>

          {/* Bar chart - Updated to show Revenue vs Expenses */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-800 text-sm font-bold">Revenue vs Expenses</p>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                <BarChart2 size={12} className="text-emerald-500" />
                <span className="text-emerald-600 text-[11px] font-bold">This Week</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-28">
              {DAILY.map((d, i) => {
                const revenueH = Math.round((d.sales / maxCombined) * 100);
                const expenseH = Math.round((DAILY_EXPENSES[i].expenses / maxCombined) * 100);
                const isToday = i === DAILY.length - 1;
                return (
                  <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 88 }}>
                      <div
                        className={`flex-1 rounded-t-lg transition-all ${isToday ? "bg-emerald-400" : "bg-slate-200"}`}
                        style={{ height: `${revenueH}%` }}
                      />
                      <div
                        className={`flex-1 rounded-t-lg transition-all bg-red-300`}
                        style={{ height: `${expenseH}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isToday ? "text-emerald-500" : "text-slate-400"}`}>{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-200 rounded"></div>
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-300 rounded"></div>
                <span className="text-xs text-slate-500">Expenses</span>
              </div>
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-slate-800 text-sm font-bold mb-4">Top Selling Products</p>
            <div className="flex flex-col gap-4">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[10px] font-extrabold text-slate-500">{i + 1}</span>
                    <span className="flex-1 text-slate-700 text-sm font-medium truncate">{p.name}</span>
                    <span className="text-emerald-600 text-xs font-bold shrink-0">UGX {p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New: Expenses breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-slate-800 text-sm font-bold mb-4">Expenses Breakdown</p>
            <div className="flex flex-col gap-4">
              {EXPENSES.map((e, i) => (
                <div key={e.category} className="flex items-center justify-between">
                  <span className="text-slate-700 text-sm font-medium">{e.category}</span>
                  <span className="text-red-600 text-xs font-bold">UGX {e.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-slate-800 text-sm font-bold">Total</span>
                <span className="text-red-600 text-sm font-bold">UGX {totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}