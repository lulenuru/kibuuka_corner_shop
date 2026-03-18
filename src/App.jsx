import { useState } from "react";
import LoginScreen    from "./screens/login";
import HomeScreen     from "./screens/home";
import SalesScreen    from "./screens/sales";
import InventoryScreen from "./screens/inventory";
import CreditScreen   from "./screens/credit_management";
import ReportsScreen  from "./screens/reports";
import StaffScreen    from "./screens/staff";
import RestockHistoryScreen from "./screens/restock_history";
import KaMoneyScreen from "./screens/ka_money";

export default function App() {
  const [auth,   setAuth]   = useState(false);
  const [screen, setScreen] = useState("home");

  if (!auth) {
    return <LoginScreen onLogin={() => setAuth(true)} />;
  }

  const goBack   = () => setScreen("home");
  const navigate = (s) => {setScreen(s)};



  switch (screen) {
    case "sales":     return <SalesScreen     onBack={goBack} />;
    case "inventory": return <InventoryScreen onBack={goBack} />;
    case "credit":    return <CreditScreen    onBack={goBack} />;
    case "reports":   return <ReportsScreen   onBack={goBack} />;
    case "staff":     return <StaffScreen     onBack={goBack} />;
    case "ka_money":   return <KaMoneyScreen   onBack={goBack} />;
    case "restock": return <RestockHistoryScreen onBack={goBack} />;
    default:          return <HomeScreen      onNavigate={navigate} onLogout={() => setAuth(false)} />;
  }
}