import { FormEvent, useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { MessageCircle, FileText, Mail, ArrowRight, Send } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { apiFetch } from "../lib/api";

export function Support() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("idle");
    setLoading(true);
    try {
      await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          type: "support",
          name,
          email,
          telegramUsername,
          message,
        }),
      });
      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
          {t("How can we help?", "Как мы можем помочь?")}
        </h1>
        <p className="text-white/50 text-lg">
          {t("Get assistance with setup, billing, or technical issues.", "Получите помощь по настройке, оплате или техническим вопросам.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card glass hover className="group">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{t("Live Chat", "Онлайн-чат")}</h3>
            <p className="text-sm text-white/50 mb-6">{t("Talk to our support team via Telegram.", "Свяжитесь с поддержкой через Telegram.")}</p>
            <Button
              variant="secondary"
              className="w-full mt-auto"
              onClick={() => {
                if (botUsername) window.open(`https://t.me/${botUsername}`, "_blank", "noopener,noreferrer");
              }}
              disabled={!botUsername}
            >
              {t("Open Telegram", "Открыть Telegram")}
            </Button>
          </CardContent>
        </Card>

        <Card glass hover className="group">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{t("Knowledge Base", "База знаний")}</h3>
            <p className="text-sm text-white/50 mb-6">{t("Browse guides, FAQs, and setup tutorials.", "Читайте руководства, FAQ и инструкции по настройке.")}</p>
            <Button variant="secondary" className="w-full mt-auto">{t("Read Articles", "Читать статьи")}</Button>
          </CardContent>
        </Card>

        <Card glass hover className="group">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{t("Request Support", "Заявка в поддержку")}</h3>
            <p className="text-sm text-white/50 mb-6">{t("Send a protected request to the admin panel and Telegram.", "Отправьте заявку в админку и Telegram.")}</p>
            <a href="#support-form" className="w-full">
              <Button variant="secondary" className="w-full mt-auto">{t("Create Request", "Создать заявку")}</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <Card id="support-form" glass className="max-w-3xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">{t("Contact support", "Связаться с поддержкой")}</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60"
                placeholder={t("Name", "Имя")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={120}
              />
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={320}
              />
            </div>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60"
              placeholder={t("Telegram username", "Telegram username")}
              value={telegramUsername}
              onChange={(event) => setTelegramUsername(event.target.value)}
              maxLength={64}
            />
            <textarea
              className="w-full min-h-36 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60 resize-y"
              placeholder={t("Describe the issue", "Опишите вопрос")}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              minLength={5}
              maxLength={4000}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm">
                {status === "sent" && <span className="text-emerald-400">{t("Request sent.", "Заявка отправлена.")}</span>}
                {status === "error" && <span className="text-red-400">{t("Failed to send request.", "Не удалось отправить заявку.")}</span>}
              </div>
              <Button disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? t("Sending...", "Отправка...") : t("Send request", "Отправить заявку")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">{t("Frequently Asked Questions", "Частые вопросы")}</h2>
        <div className="space-y-4">
          {[
            { en: "How do I setup the VPN on my router?", ru: "Как настроить VPN на роутере?" },
            { en: "Can I use the VPN on multiple devices simultaneously?", ru: "Можно ли использовать VPN на нескольких устройствах?" },
            { en: "What payment methods do you accept?", ru: "Какие способы оплаты доступны?" },
            { en: "How does the 30-day money-back guarantee work?", ru: "Как работает гарантия возврата?" },
          ].map((q) => (
            <Card key={q.en} glass hover className="cursor-pointer">
              <CardContent className="p-5 flex items-center justify-between">
                <span className="text-white/80 font-medium">{t(q.en, q.ru)}</span>
                <ArrowRight className="w-5 h-5 text-white/30" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
