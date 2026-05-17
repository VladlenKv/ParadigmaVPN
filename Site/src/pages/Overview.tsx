import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Shield, Zap, Globe, Activity, ArrowRight, AlertCircle, MonitorSmartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../lib/i18n";

export function Overview() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            {t("Welcome back", "С возвращением")}
          </h1>
          <p className="text-white/50 text-lg">
            {t("Your connection is currently", "Ваше соединение сейчас")} <span className="text-red-400 font-medium">{t("unprotected", "не защищено")}</span>.
          </p>
        </div>
        <Button size="lg" className="w-full md:w-auto shadow-lg shadow-blue-500/20">
          <Zap className="w-5 h-5 mr-2" />
          {t("Connect Now", "Подключиться")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glass className="relative overflow-hidden group border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {t("Inactive", "Неактивен")}
                </span>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">{t("Status", "Статус")}</h3>
              <p className="text-2xl font-semibold text-white">{t("Disconnected", "Отключено")}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card glass className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">{t("Current IP", "Текущий IP")}</h3>
              <p className="text-2xl font-semibold text-white font-mono">192.168.1.1</p>
              <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {t("Exposed", "Уязвим")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card glass className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">{t("Data Usage", "Трафик")}</h3>
              <p className="text-2xl font-semibold text-white">0 <span className="text-lg text-white/50">{t("GB", "ГБ")}</span></p>
              <p className="text-xs text-white/40 mt-2">{t("This month", "В этом месяце")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="flex flex-col">
          <CardContent className="p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Shield className="w-8 h-8 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{t("No Active Subscription", "Нет активной подписки")}</h2>
            <p className="text-white/50 mb-8 max-w-sm">
              {t("Get unlimited access to high-speed servers, military-grade encryption, and 24/7 support.", "Получите неограниченный доступ к высокоскоростным серверам, шифрованию военного уровня и круглосуточной поддержке.")}
            </p>
            <Button size="lg" className="w-full max-w-xs shadow-lg shadow-blue-500/20">
              {t("View Plans", "Смотреть тарифы")}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card glass hover>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 flex items-center justify-center border border-[#0088cc]/20">
                  <svg className="w-6 h-6 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">{t("Link Telegram", "Привязать Telegram")}</h3>
                  <p className="text-sm text-white/50">{t("Manage subscription from bot", "Управление подпиской через бота")}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">{t("Connect", "Привязать")}</Button>
            </CardContent>
          </Card>

          <Card glass hover>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <MonitorSmartphone className="w-6 h-6 text-white/70" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{t("Setup Devices", "Настройка устройств")}</h3>
                  <p className="text-sm text-white/50">{t("Download apps for your OS", "Скачайте приложения для вашей ОС")}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
