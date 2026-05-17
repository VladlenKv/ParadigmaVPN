import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { Subscription } from "./pages/Subscription";
import { Pricing } from "./pages/Pricing";
import { Devices } from "./pages/Devices";
import { Support } from "./pages/Support";
import { Referrals } from "./pages/Referrals";
import { Settings } from "./pages/Settings";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LanguageProvider } from "./lib/i18n";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="devices" element={<Devices />} />
            <Route path="support" element={<Support />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
