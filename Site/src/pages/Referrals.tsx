import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Gift, Copy, Users, Wallet, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../lib/i18n";

export function Referrals() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          {t("Referrals", "Рефералы")}
        </h1>
        <p className="text-white/50 text-lg">
          {t("Invite friends and earn free premium time.", "Приглашайте друзей и получайте бесплатное премиум-время.")}
        </p>
      </div>

      <Card glass className="overflow-hidden border-white/10 relative bg-gradient-to-br from-[#0A0A0A] to-[#111]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <CardContent className="p-8 md:p-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("Give 30 Days, Get 30 Days", "Подари 30 дней, получи 30 дней")}</h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  {t("For every friend who signs up using your link and purchases a premium plan, you both get an extra 30 days of premium for free.", "За каждого друга, который зарегистрируется по вашей ссылке и купит премиум-тариф, вы оба получите дополнительные 30 дней премиума бесплатно.")}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-sm font-medium text-white/40 uppercase tracking-wider">{t("Your Referral Link", "Ваша реферальная ссылка")}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm text-white/80 overflow-hidden text-ellipsis whitespace-nowrap">
                    https://paradigma.vpn/ref/u388896367
                  </div>
                  <Button variant="secondary" className="px-4">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Apple Card Style Representation */}
              <motion.div
                initial={{ rotateY: -10, rotateX: 10 }}
                animate={{ rotateY: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full max-w-sm mx-auto aspect-[1.6] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/20"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50" />
                <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')", opacity: 0.5 }} />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-white" />
                    <span className="font-semibold tracking-tight text-white">{t("Rewards", "Награды")}</span>
                  </div>
                  <span className="text-white/50 font-mono text-sm">ID: 388896367</span>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="text-white/60 text-sm mb-1">{t("Earned Time", "Заработанное время")}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">0 <span className="text-lg font-normal text-white/60">{t("Days", "Дней")}</span></p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-white/70" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{t("Your Referrals", "Ваши рефералы")}</h3>
                <p className="text-sm text-white/50">{t("People who joined via your link", "Люди, присоединившиеся по вашей ссылке")}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02]">
              <p className="text-white/50">{t("No referrals yet.", "Пока нет рефералов.")}</p>
              <p className="text-sm text-white/30 mt-1">{t("Share your link to get started.", "Поделитесь ссылкой, чтобы начать.")}</p>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Wallet className="w-6 h-6 text-white/70" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{t("Partner Program", "Партнерская программа")}</h3>
                <p className="text-sm text-white/50">{t("Earn cash commissions", "Зарабатывайте денежные комиссии")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                {t("Want to earn real money instead of premium time? Join our affiliate program and earn up to 40% commission on every sale.", "Хотите зарабатывать реальные деньги вместо премиум-времени? Присоединяйтесь к нашей партнерской программе и получайте до 40% комиссии с каждой продажи.")}
              </p>
              <Button variant="secondary" className="w-full justify-between">
                {t("Apply for Partner Program", "Подать заявку на участие")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
