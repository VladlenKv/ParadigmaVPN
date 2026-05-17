import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { User, Lock, Bell, Moon, ShieldAlert, Smartphone, Mail, EyeOff, CheckCircle2, MonitorSmartphone } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { useState } from "react";
import { cn } from "../lib/utils";

type SettingsTab = 'account' | 'security' | 'notifications' | 'appearance';

export function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          {t("Settings", "Настройки")}
        </h1>
        <p className="text-white/50 text-lg">
          {t("Manage your account preferences and security.", "Управляйте настройками аккаунта и безопасностью.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-1 space-y-2">
          <nav className="flex flex-row overflow-x-auto hide-scrollbar gap-2 lg:flex-col lg:gap-1 pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            <button
              onClick={() => setActiveTab('account')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0",
                activeTab === 'account' ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <User className="w-4 h-4" /> {t("Account", "Аккаунт")}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0",
                activeTab === 'security' ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Lock className="w-4 h-4" /> {t("Security", "Безопасность")}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0",
                activeTab === 'notifications' ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Bell className="w-4 h-4" /> {t("Notifications", "Уведомления")}
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0",
                activeTab === 'appearance' ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Moon className="w-4 h-4" /> {t("Appearance", "Внешний вид")}
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'account' && (
            <>
              <Card glass>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">{t("Account Details", "Данные аккаунта")}</h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        U
                      </div>
                      <div>
                        <Button variant="secondary" size="sm" className="mb-2">{t("Change Avatar", "Изменить аватар")}</Button>
                        <p className="text-xs text-white/40">{t("JPG, GIF or PNG. Max size of 2MB.", "JPG, GIF или PNG. Максимальный размер 2МБ.")}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-white/70">{t("User ID", "ID пользователя")}</label>
                        <input
                          type="text"
                          value="388896367"
                          disabled
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 font-mono text-sm cursor-not-allowed"
                        />
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-white/70">{t("Email Address", "Email адрес")}</label>
                        <div className="flex gap-3">
                          <input
                            type="email"
                            placeholder={t("Not set", "Не установлен")}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                          />
                          <Button variant="secondary">{t("Save", "Сохранить")}</Button>
                        </div>
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                          <ShieldAlert className="w-3 h-3" />
                          {t("Set an email to login without Telegram", "Установите email для входа без Telegram")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card glass className="border-red-500/20">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-red-500 mb-2">{t("Danger Zone", "Опасная зона")}</h2>
                  <p className="text-white/50 text-sm mb-6">{t("Irreversible actions for your account.", "Необратимые действия для вашего аккаунта.")}</p>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div>
                      <h3 className="text-white font-medium mb-1">{t("Delete Account", "Удалить аккаунт")}</h3>
                      <p className="text-sm text-white/50">{t("Permanently delete your account and all data.", "Навсегда удалить ваш аккаунт и все данные.")}</p>
                    </div>
                    <Button variant="destructive" className="whitespace-nowrap w-full md:w-auto">{t("Delete Account", "Удалить аккаунт")}</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card glass>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">{t("Password & Authentication", "Пароль и аутентификация")}</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div>
                        <h3 className="text-white font-medium mb-1">{t("Change Password", "Изменить пароль")}</h3>
                        <p className="text-sm text-white/50">{t("Update your password to keep your account secure.", "Обновите пароль для безопасности аккаунта.")}</p>
                      </div>
                      <Button variant="secondary">{t("Update", "Обновить")}</Button>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div>
                        <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                          {t("Two-Factor Authentication", "Двухфакторная аутентификация")}
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">{t("Off", "Выкл")}</span>
                        </h3>
                        <p className="text-sm text-white/50">{t("Add an extra layer of security to your account.", "Добавьте дополнительный уровень защиты вашему аккаунту.")}</p>
                      </div>
                      <Button variant="secondary">{t("Enable", "Включить")}</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1">{t("Telegram Login", "Вход через Telegram")}</h3>
                        <p className="text-sm text-white/50">{t("Allow signing in with your connected Telegram account.", "Разрешить вход с помощью подключенного Telegram аккаунта.")}</p>
                      </div>
                      <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card glass>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">{t("Active Sessions", "Активные сессии")}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/10">
                          <Smartphone className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <h3 className="text-white text-sm font-medium">iPhone 14 Pro</h3>
                          <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> {t("Current session", "Текущая сессия")}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">Moscow, RU</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/5">
                          <MonitorSmartphone className="w-5 h-5 text-white/50" />
                        </div>
                        <div>
                          <h3 className="text-white text-sm font-medium">MacBook Pro 16"</h3>
                          <p className="text-xs text-white/40 mt-0.5">Last active: 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        {t("Revoke", "Завершить")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card glass>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">{t("Notification Preferences", "Настройки уведомлений")}</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{t("Email Notifications", "Уведомления по Email")}</h3>
                        <p className="text-sm text-white/50">{t("Receive updates about your subscription and news.", "Получайте обновления о вашей подписке и новости.")}</p>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-white/10 rounded-full relative cursor-pointer border border-white/10">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20">
                        <svg className="w-6 h-6 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{t("Telegram Bot", "Telegram Бот")}</h3>
                        <p className="text-sm text-white/50">{t("Instant alerts for new logins and connection issues.", "Мгновенные оповещения о новых входах и проблемах.")}</p>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <EyeOff className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{t("Marketing Messages", "Рекламные сообщения")}</h3>
                        <p className="text-sm text-white/50">{t("Special offers and promotional content.", "Специальные предложения и рекламный контент.")}</p>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-white/10 rounded-full relative cursor-pointer border border-white/10">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card glass>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">{t("Theme Settings", "Настройки темы")}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex flex-col items-center gap-4 p-4 rounded-xl border-2 border-blue-500 bg-white/5">
                    <div className="w-full h-24 rounded-lg bg-[#050505] border border-white/10 flex flex-col p-2 gap-2 overflow-hidden relative">
                      <div className="w-full h-4 bg-white/5 rounded" />
                      <div className="w-3/4 h-3 bg-white/5 rounded" />
                      <div className="w-1/2 h-3 bg-blue-500/20 rounded" />
                    </div>
                    <span className="text-sm font-medium text-white">{t("Dark Mode", "Темная тема")}</span>
                  </button>

                  <button className="flex flex-col items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-white/5 hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
                    <div className="w-full h-24 rounded-lg bg-[#FAFAFA] border border-black/10 flex flex-col p-2 gap-2 overflow-hidden relative">
                      <div className="w-full h-4 bg-black/5 rounded" />
                      <div className="w-3/4 h-3 bg-black/5 rounded" />
                      <div className="w-1/2 h-3 bg-blue-500/20 rounded" />
                    </div>
                    <span className="text-sm font-medium text-white/50">{t("Light Mode", "Светлая тема")} (Coming Soon)</span>
                  </button>

                  <button className="flex flex-col items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-white/5 hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
                    <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#050505] to-[#1a1a1a] border border-white/10 flex flex-col p-2 gap-2 overflow-hidden relative">
                      <div className="w-full h-4 bg-white/10 rounded" />
                      <div className="flex gap-2">
                        <div className="w-1/2 h-8 bg-blue-500/20 rounded" />
                        <div className="w-1/2 h-8 bg-purple-500/20 rounded" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white/50">{t("System", "Системная")}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
