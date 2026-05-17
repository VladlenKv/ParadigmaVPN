import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Zap, Shield, CreditCard, Clock } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export function Subscription() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          {t("Subscription", "Подписка")}
        </h1>
        <p className="text-white/50 text-lg">
          {t("Manage your plan and billing details.", "Управляйте своим тарифом и платежными данными.")}
        </p>
      </div>

      <Card glass className="overflow-hidden border-white/10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <CardContent className="p-8 md:p-10 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center justify-between border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Shield className="w-8 h-8 text-white/40" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">{t("Free Tier", "Бесплатный тариф")}</h2>
                <p className="text-white/50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  {t("No active premium subscription", "Нет активной премиум-подписки")}
                </p>
              </div>
            </div>

            <Button size="lg" className="w-full md:w-auto shadow-lg shadow-blue-500/20 whitespace-nowrap">
              <Zap className="w-5 h-5 mr-2" />
              {t("Upgrade to Premium", "Перейти на Premium")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">{t("Status", "Статус")}</h3>
              <p className="text-white font-medium">{t("Inactive", "Неактивен")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">{t("Next Billing", "Следующий платеж")}</h3>
              <p className="text-white font-medium">—</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">{t("Payment Method", "Способ оплаты")}</h3>
              <p className="text-white font-medium">—</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              {t("Payment Methods", "Способы оплаты")}
            </CardTitle>
            <CardDescription>{t("Manage how you pay for your subscription.", "Управляйте способами оплаты подписки.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-white/70 mb-4">{t("No payment methods added", "Нет добавленных способов оплаты")}</p>
              <Button variant="secondary" size="sm">{t("Add Payment Method", "Добавить способ оплаты")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              {t("Billing History", "История платежей")}
            </CardTitle>
            <CardDescription>{t("View your past invoices and receipts.", "Просмотр прошлых счетов и квитанций.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-white/70">{t("No billing history yet", "Истории платежей пока нет")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
