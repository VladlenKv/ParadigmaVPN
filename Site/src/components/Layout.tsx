import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  CreditCard,
  MonitorSmartphone,
  LifeBuoy,
  Gift,
  Settings,
  Menu,
  X,
  LogOut,
  Zap
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { useLanguage } from "../lib/i18n";

function LanguageSwitcher({
  language,
  setLanguage,
}: {
  language: "en" | "ru";
  setLanguage: (language: "en" | "ru") => void;
}) {
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
    >
      {language === 'en' ? 'RU' : 'EN'}
    </button>
  );
}

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { icon: Home, label: t("Overview", "Обзор"), path: "/" },
    { icon: Zap, label: t("Subscription", "Подписка"), path: "/subscription" },
    { icon: CreditCard, label: t("Pricing", "Тарифы"), path: "/pricing" },
    { icon: MonitorSmartphone, label: t("Devices", "Устройства"), path: "/devices" },
    { icon: LifeBuoy, label: t("Support", "Поддержка"), path: "/support" },
    { icon: Gift, label: t("Referrals", "Рефералы"), path: "/referrals" },
    { icon: Settings, label: t("Settings", "Настройки"), path: "/settings" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-white/5 bg-[#0A0A0A]/80 backdrop-blur-3xl z-20">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="font-semibold text-lg tracking-tight">Paradigma</span>
          </div>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-panel p-4 rounded-2xl mb-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,122,255,0.4)] text-white font-medium">
              U
            </div>
            <div className="text-sm font-medium text-white/90">ID: 388896367</div>
            <div className="text-xs text-white/40 mt-1">{t("Free Plan", "Бесплатный план")}</div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-white/50 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            {t("Sign Out", "Выйти")}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6" />
          <span className="font-semibold tracking-tight">Paradigma</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/70 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#050505] z-20 flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative pt-16 md:pt-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen" />
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 md:p-10 relative z-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
