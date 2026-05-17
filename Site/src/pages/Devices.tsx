import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Monitor, Smartphone, Apple, Laptop, Download, ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export function Devices() {
  const { t } = useLanguage();

  const devices = [
    {
      name: "iOS",
      icon: Apple,
      description: t("iPhone and iPad", "iPhone и iPad"),
      status: t("Available", "Доступно"),
      version: "v2.4.1"
    },
    {
      name: "macOS",
      icon: Laptop,
      description: t("MacBook and iMac", "MacBook и iMac"),
      status: t("Available", "Доступно"),
      version: "v3.1.0"
    },
    {
      name: "Android",
      icon: Smartphone,
      description: t("Phones and Tablets", "Телефоны и планшеты"),
      status: t("Available", "Доступно"),
      version: "v2.5.0"
    },
    {
      name: "Windows",
      icon: Monitor,
      description: t("PC and Laptops", "ПК и ноутбуки"),
      status: t("Available", "Доступно"),
      version: "v4.0.2"
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          {t("Devices & Setup", "Устройства и настройка")}
        </h1>
        <p className="text-white/50 text-lg">
          {t("Download apps and configure your devices.", "Скачайте приложения и настройте свои устройства.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devices.map((device) => (
          <Card key={device.name} glass hover className="flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <device.icon className="w-8 h-8 text-white/80" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">{device.name}</h3>
              <p className="text-sm text-white/50 mb-6">{device.description}</p>

              <div className="mt-auto w-full space-y-3">
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {t("Download", "Скачать")}
                </Button>
                <div className="text-xs text-white/40 flex justify-between px-1">
                  <span>{device.version}</span>
                  <button className="hover:text-white transition-colors">{t("Setup Guide", "Инструкция")}</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">{t("Manual Configuration", "Ручная настройка")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card glass hover>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">WireGuard</h3>
                <p className="text-sm text-white/50">{t("Generate configs for WireGuard client", "Генерация конфигов для клиента WireGuard")}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          <Card glass hover>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">OpenVPN</h3>
                <p className="text-sm text-white/50">{t("Download .ovpn configuration files", "Скачать файлы конфигурации .ovpn")}</p>
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
