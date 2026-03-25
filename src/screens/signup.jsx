import { useState } from "react";
import { Eye, EyeOff, Store, Shield, Zap, CheckCircle, Lock, User, Phone } from "lucide-react";

export default function SignupScreen({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignup = () => {
    if (!name || !phone || !pass || !confirmPass) {
      setErr("Please fill in all fields.");
      return;
    }
    if (pass !== confirmPass) {
      setErr("Passwords do not match.");
      return;
    }
    if (pass.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setErr("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignup && onSignup({ name, phone, password: pass });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex justify-center bg-slate-800">
      <div className="w-full max-w-sm flex flex-col shadow-2xl">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 px-7 pt-16 pb-10 flex-shrink-0">
          {/* decorative blobs */}
          <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl" />
          <div className="absolute bottom-0 -left-12 w-40 h-40 rounded-full bg-emerald-300/8 blur-xl" />

          {/* icon */}
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center mb-6">
            <Store size={26} className="text-emerald-300" />
          </div>

          <h1 className="relative z-10 text-white text-3xl font-extrabold leading-tight mb-2">
            Join Kaduuka
          </h1>
          <p className="relative z-10 text-slate-400 text-sm leading-relaxed mb-6">
            Create your account to get started
          </p>

          {/* trust badges */}
          <div className="relative z-10 flex gap-2 flex-wrap">
            {[
              { icon: Shield, label: "Secure" },
              { icon: Zap, label: "Fast Setup" },
              { icon: CheckCircle, label: "Easy Management" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold">
                <Icon size={10} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10 flex flex-col gap-6">
          <div>
            <h2 className="text-slate-800 text-xl font-extrabold">Sign Up</h2>
            <p className="text-slate-400 text-sm mt-1">Create your account to manage your shop</p>
          </div>

          {/* fields */}
          <div className="flex flex-col gap-4">
            {/* name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-[52px] focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
                <User size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none font-medium"
                />
              </div>
            </div>

            {/* phone */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-[52px] focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none font-medium"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-[52px] focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none font-medium"
                />
                <button onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* confirm password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-[52px] focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 outline-none font-medium"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* error */}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm font-medium">
              {err}
            </div>
          )}

          {/* submit */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full h-[52px] bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-75"
          >
            {loading ? "Creating account…" : "Sign Up →"}
          </button>

          <div className="text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-emerald-500 text-sm font-bold hover:text-emerald-600 transition-colors"
            >
              Already have an account? Login
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-slate-300 text-xs">By signing up, you agree to our terms</p>
          </div>
        </div>

      </div>
    </div>
  );
}
