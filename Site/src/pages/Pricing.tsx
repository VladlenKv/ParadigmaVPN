import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useLanguage } from "../lib/i18n";

export function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("1 Month", "1 Месяц"),
      price: "$9.99",
      period: t("/mo", "/мес"),
      description: t("Perfect for short-term travel or testing.", "Идеально для коротких поездок или тестирования."),
      features: [
        t("Unlimited bandwidth", "Неограниченный трафик"),
        t("All premium servers", "Все премиум серверы"),
        t("Up to 5 devices", "До 5 устройств"),
        t("24/7 priority support", "Приоритетная поддержка 24/7"),
        t("Strict no-logs policy", "Строгая политика без логов")
      ],
      popular: false,
      savings: null
    },
    {
      name: t("12 Months", "12 Месяцев"),
      price: "$4.99",
      period: t("/mo", "/мес"),
      description: t("Our most popular plan. Best value.", "Наш самый популярный план. Лучшая цена."),
      features: [
        t("Unlimited bandwidth", "Неограниченный трафик"),
        t("All premium servers", "Все премиум серверы"),
        t("Up to 10 devices", "До 10 устройств"),
        t("24/7 priority support", "Приоритетная поддержка 24/7"),
        t("Strict no-logs policy", "Строгая политика без логов"),
        t("Ad & malware blocker", "Блокировщик рекламы и вредоносных программ")
      ],
      popular: true,
      savings: t("Save 50%", "Скидка 50%"),
      totalPrice: t("$59.88 billed annually", "$59.88 оплачивается ежегодно")
    },
    {
      name: t("6 Months", "6 Месяцев"),
      price: "$6.99",
      period: t("/mo", "/мес"),
      description: t("A great balance of commitment and price.", "Отличный баланс обязательств и цены."),
      features: [
        t("Unlimited bandwidth", "Неограниченный трафик"),
        t("All premium servers", "Все премиум серверы"),
        t("Up to 7 devices", "До 7 устройств"),
        t("24/7 priority support", "Приоритетная поддержка 24/7"),
        t("Strict no-logs policy", "Строгая политика без логов")
      ],
      popular: false,
      savings: t("Save 30%", "Скидка 30%"),
      totalPrice: t("$41.94 billed semi-annually", "$41.94 оплачивается раз в полгода")
    }
  ];

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          {t("Simple, transparent pricing", "Простые и прозрачные тарифы")}
        </h1>
        <p className="text-white/50 text-lg md:text-xl">
          {t("Choose the plan that fits your needs. 30-day money-back guarantee on all plans.", "Выберите тариф, который подходит именно вам. 30-дневная гарантия возврата денег на всех тарифах.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-center">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative",
              plan.popular ? "md:-translate-y-4 z-10" : "z-0"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/30">
                  <Star className="w-3 h-3 fill-white" /> {t("Most Popular", "Самый популярный")}
                </span>
              </div>
            )}

            <Card
              glass
              className={cn(
                "h-full flex flex-col relative overflow-hidden transition-all duration-300",
                plan.popular
                  ? "border-blue-500/50 shadow-[0_0_40px_rgba(0,122,255,0.15)] bg-blue-500/[0.02]"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />
              )}

              <CardContent className="p-8 flex-1 flex flex-col relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-sm h-10">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/50">{plan.period}</span>
                  </div>
                  {plan.savings ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-0.5 rounded">
                        {plan.savings}
                      </span>
                      <span className="text-white/40 text-xs">{plan.totalPrice}</span>
                    </div>
                  ) : (
                    <div className="mt-2 h-6" /> // spacer
                  )}
                </div>

                <Button
                  size="lg"
                  variant={plan.popular ? "default" : "secondary"}
                  className={cn("w-full mb-8", plan.popular && "shadow-lg shadow-blue-500/25")}
                >
                  {t("Choose Plan", "Выбрать тариф")}
                </Button>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-medium text-white/70">{t("What's included:", "Что включено:")}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-white/50 text-sm">
          {t("Crypto payments accepted. We support BTC, ETH, USDT, and more.", "Принимаем оплату криптовалютой. Мы поддерживаем BTC, ETH, USDT и другие.")}
        </p>
      </div>
    </div>
  );
}
