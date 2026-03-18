import {
  ShoppingCart, Package, CreditCard, BarChart2,
  UserCheck, TrendingUp, Bell, LogOut,
  ChevronRight, AlertTriangle, DollarSign, PiggyBank,
} from "lucide-react";

const FEATURES = [
  { key: "sales",     icon: ShoppingCart, label: "Record Sale",     sub: "Add products & checkout",   iconColor: "text-emerald-500", iconBg: "bg-emerald-50",  badge: "47 today"        },
  { key: "expenses",  icon: DollarSign,   label: "Record Expense",  sub: "Track costs like restock, transport", iconColor: "text-purple-500", iconBg: "bg-purple-50", badge: "Add now" },
  { key: "inventory", icon: Package,      label: "Inventory",       sub: "Track stock levels",        iconColor: "text-blue-500",    iconBg: "bg-blue-50",     badge: "3 low stock"     },
  { key: "credit",    icon: CreditCard,   label: "Credit",          sub: "Customer debt tracking",    iconColor: "text-amber-500",   iconBg: "bg-amber-50",    badge: "UGX 187K owed"   },
  { key: "ka_money",  icon: PiggyBank,    label: "Ka Money",        sub: "Earn UGX 500 per MM txn",   iconColor: "text-purple-500", iconBg: "bg-purple-50", badge: "Redeem after 10" },
  { key: "reports",   icon: BarChart2,    label: "Reports",         sub: "Sales & performance",       iconColor: "text-slate-600",   iconBg: "bg-slate-100",   badge: "View insights"   },
  { key: "restock",   icon: TrendingUp,   label: "Restock History", sub: "Past stock additions",      iconColor: "text-teal-500",    iconBg: "bg-teal-50",     badge: "2 days ago"      },
  { key: "staff",     icon: UserCheck,    label: "Staff",           sub: "Manage your team",          iconColor: "text-sky-500",     iconBg: "bg-sky-50",      badge: "3 members"       },
];

const LOW_STOCK = [
  { name: "Sugar 1kg",  stock: 3 },
  { name: "Bread Loaf", stock: 2 },
  { name: "Milk 500ml", stock: 4 },
];

export default function HomeScreen({ onNavigate, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm flex flex-col shadow-2xl bg-slate-50 min-h-screen">

        {/* ── Header ── */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900 px-5 pt-14 pb-6">
          {/* blob */}
          <div className="absolute -top-16 -right-12 w-52 h-52 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* top row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Good morning 👋</p>
                <h1 className="text-white text-xl font-extrabold mt-1">Kibuuka</h1>
              </div>
              <div className="flex gap-2">
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
                  <Bell size={17} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border-2 border-blue-900" />
                </button>
                <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* quick stats strip */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Revenue", val: "UGX 284K" },
                { label: "Expenses",   val: "UGX 47K"  },
                { label: "Credit",  val: "UGX 187K"  },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/10 border border-white/12 rounded-xl px-3 py-2.5">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{label}</p>
                  <p className="text-white text-[13px] font-extrabold mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-10" style={{ scrollbarWidth: "none" }}>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Features</p>

          {/* Feature tiles */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(({ key, icon: Icon, label, sub, iconColor, iconBg, badge }) => (
              <button
                key={key}
                onClick={() => { onNavigate && onNavigate(key)}}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 text-left active:scale-95 hover:border-emerald-300 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className={`${iconBg} rounded-xl p-2.5 inline-flex`}>
                    <Icon size={19} className={iconColor} strokeWidth={2} />
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-slate-800 text-[13px] font-bold leading-tight">{label}</p>
                  <p className="text-slate-400 text-[11px] mt-1 leading-snug">{sub}</p>
                </div>
                <span className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500">
                  {badge}
                </span>
              </button>
            ))}
          </div>

          {/* Low stock warning */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-100 rounded-lg p-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
              </div>
              <p className="text-amber-700 text-sm font-bold">Low Stock Alert</p>
            </div>

            <div className="flex flex-col gap-1.5">
              {LOW_STOCK.map(item => (
                <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-amber-100 last:border-0">
                  <span className="text-slate-700 text-sm font-medium">{item.name}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate && onNavigate("inventory")}
              className="mt-3 flex items-center gap-1 text-emerald-500 text-xs font-bold hover:text-emerald-600 transition-colors"
            >
              Manage inventory <ChevronRight size={12} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}