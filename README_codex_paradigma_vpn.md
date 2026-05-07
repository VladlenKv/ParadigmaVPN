# Prompt for Codex Desktop: Telegram bot “Paradigma VPN”

## 0. Роль Codex

Ты — senior full-stack/backend engineer и DevOps-инженер. Твоя задача — спроектировать, реализовать, протестировать и задокументировать Telegram-бота **Paradigma VPN**.

Бот должен продавать и выдавать VPN-конфигурации пользователям через сервер, на котором установлен **Marzban**, синхронизироваться с моей базой данных, доменом и сайтом, а также по возможности повторить UX-логику референсного Telegram-бота:

- Reference bot: `https://t.me/Horizonvps_bot`
- New bot name: **Paradigma VPN**
- Target system: Telegram bot + backend + DB + Marzban integration + website/domain sync
- Output language for bot users: Russian by default
- Code quality target: production-ready MVP, clean architecture, secure config, tests, README, deployment guide

---

## 1. Важное ограничение по референс-боту

Перед началом разработки попробуй проанализировать структуру, кнопки, переходы, тексты и сценарии бота `@Horizonvps_bot`.

Если у тебя нет доступа к Telegram-сессии, невозможно открыть бота, бот недоступен, требует `/start`, капчу, оплату или ручное взаимодействие — не выдумывай факты. Вместо этого:

1. Создай файл `docs/reference_bot_audit.md`.
2. Опиши, что именно удалось или не удалось проверить.
3. Добавь чек-лист для ручного аудита референса.
4. Реализуй архитектуру Paradigma VPN на основе типовых сценариев VPN-бота, но все элементы UI вынеси в конфиг, чтобы я мог быстро заменить тексты и кнопки после ручного аудита.

---

## 2. Сначала изучи проект и окружение

Перед изменениями:

1. Осмотри текущую структуру репозитория.
2. Найди существующие файлы конфигурации, `.env.example`, docker-compose, миграции, схемы БД, backend/frontend код.
3. Определи стек проекта. Если проект пустой — предложи и создай стек по умолчанию.
4. Не удаляй существующий код без необходимости.
5. Все рискованные решения фиксируй в `docs/decisions.md`.

Если проект пустой, используй предпочтительный стек:

- Python 3.12+
- `aiogram` 3.x для Telegram bot
- `FastAPI` для backend API/webhooks
- `SQLAlchemy` 2.x async
- `Alembic` для миграций
- PostgreSQL как основная БД
- Redis для FSM/cache/rate limit, если нужен
- Docker + docker-compose
- `httpx` для Marzban API
- `pytest` для тестов
- `ruff`/`mypy` по возможности

Если в репозитории уже есть другой стек — адаптируйся к нему, не переписывай всё без причины.

---

## 3. Цель продукта

Создать Telegram-бота **Paradigma VPN**, который позволяет пользователю:

1. Запустить бота через `/start`.
2. Увидеть понятное приветствие и главное меню.
3. Выбрать тариф VPN.
4. Посмотреть описание, цену, срок, лимиты трафика/устройств.
5. Оплатить тариф или получить тестовый доступ, если он включён.
6. После успешной оплаты или активации получить конфигурацию/ссылку подписки из Marzban.
7. Смотреть статус подписки:
   - активна/истекла,
   - дата окончания,
   - использованный трафик,
   - лимит трафика,
   - ссылка подписки,
   - QR-код, если реализуемо.
8. Продлить подписку.
9. Получить инструкции для устройств:
   - iOS,
   - Android,
   - Windows,
   - macOS,
   - Linux.
10. Обратиться в поддержку.
11. Перейти на сайт Paradigma VPN.
12. Получать уведомления:
   - об успешной оплате,
   - о выдаче конфига,
   - за N дней до окончания подписки,
   - при окончании подписки,
   - при ошибке выдачи конфига.

---

## 4. Интеграция с Marzban

Нужно реализовать отдельный слой интеграции с Marzban.

### 4.1. Обязательная проверка API

Перед реализацией открой документацию Marzban на целевом сервере:

- `https://<MY_MARZBAN_DOMAIN>/docs`
- `https://<MY_MARZBAN_DOMAIN>/redoc`

Если документация закрыта, проверь README/официальные docs проекта и сделай слой клиента так, чтобы endpoint paths можно было легко поменять в одном месте.

### 4.2. Переменные окружения

Добавь в `.env.example`:

```env
BOT_TOKEN=

APP_ENV=local
APP_BASE_URL=https://bot.paradigma-vpn.example
WEBHOOK_SECRET=
WEBHOOK_PATH=/telegram/webhook

DATABASE_URL=postgresql+asyncpg://paradigma:paradigma@postgres:5432/paradigma_vpn
REDIS_URL=redis://redis:6379/0

MARZBAN_BASE_URL=https://panel.paradigma-vpn.example
MARZBAN_USERNAME=
MARZBAN_PASSWORD=
MARZBAN_VERIFY_SSL=true
MARZBAN_DEFAULT_PROXY_INBOUNDS=
MARZBAN_DEFAULT_DATA_LIMIT_GB=
MARZBAN_DEFAULT_EXPIRE_DAYS=

PUBLIC_SITE_URL=https://paradigma-vpn.example
SUPPORT_URL=https://t.me/paradigma_support
TERMS_URL=https://paradigma-vpn.example/terms
PRIVACY_URL=https://paradigma-vpn.example/privacy

PAYMENT_PROVIDER=manual
PAYMENT_WEBHOOK_SECRET=
ADMIN_TELEGRAM_IDS=
```

### 4.3. Marzban client

Создай `MarzbanClient` с методами:

- `authenticate()`
- `create_user(...)`
- `get_user(username)`
- `update_user(username, ...)`
- `revoke_user(username)` или `disable_user(username)`
- `get_subscription_link(username)`
- `get_user_usage(username)`
- `reset_user_traffic(username)`, если поддерживается
- `healthcheck()`

Требования:

- Не хранить пароль Marzban в коде.
- Токены хранить безопасно, обновлять при истечении.
- Все HTTP-ошибки оборачивать в понятные domain exceptions.
- Добавить retry/backoff для временных ошибок.
- Логировать без утечки токенов, паролей, subscription links.
- Покрыть unit tests через mock HTTP.

### 4.4. Логика имен пользователей Marzban

Marzban username должен быть стабильным и безопасным:

```text
tg_<telegram_user_id>
```

Если нужен multi-subscription режим, используй:

```text
tg_<telegram_user_id>_<subscription_id>
```

---

## 5. База данных

Создай или адаптируй схему БД.

Минимальные таблицы:

### `users`

- `id`
- `telegram_id` unique
- `username`
- `first_name`
- `last_name`
- `language_code`
- `created_at`
- `updated_at`
- `is_blocked`
- `is_admin`

### `plans`

- `id`
- `code` unique
- `title`
- `description`
- `price_amount`
- `currency`
- `duration_days`
- `traffic_limit_gb`
- `device_limit`
- `is_active`
- `sort_order`

### `subscriptions`

- `id`
- `user_id`
- `plan_id`
- `status`: `trial`, `pending_payment`, `active`, `expired`, `cancelled`, `failed`
- `marzban_username`
- `subscription_url`
- `starts_at`
- `expires_at`
- `traffic_limit_bytes`
- `last_traffic_used_bytes`
- `created_at`
- `updated_at`

### `payments`

- `id`
- `user_id`
- `subscription_id`
- `provider`
- `provider_payment_id`
- `amount`
- `currency`
- `status`: `pending`, `paid`, `failed`, `cancelled`, `refunded`
- `payload_json`
- `created_at`
- `updated_at`

### `bot_events`

- `id`
- `user_id`
- `event_type`
- `payload_json`
- `created_at`

### `settings`

- `key`
- `value_json`
- `updated_at`

Добавь Alembic migrations.

---

## 6. Telegram UX и структура меню

Все тексты и кнопки должны быть вынесены в отдельный слой:

- `bot/texts/ru.py` или `locales/ru.yaml`
- `bot/keyboards/*.py`

Главное меню:

- 🚀 Купить VPN
- 🎁 Тестовый период
- 👤 Моя подписка
- 📲 Инструкции
- 💬 Поддержка
- 🌐 Сайт
- ❓ FAQ

### 6.1. `/start`

Пример текста:

```text
👋 Добро пожаловать в Paradigma VPN!

Быстрый и стабильный VPN-доступ для ваших устройств.
Выберите действие в меню ниже.
```

Если пользователь пришёл с referral/deeplink параметром — сохрани его в БД.

### 6.2. Купить VPN

Сценарий:

1. Пользователь нажимает «🚀 Купить VPN».
2. Бот показывает активные тарифы из БД.
3. Пользователь выбирает тариф.
4. Бот показывает карточку тарифа:
   - название,
   - срок,
   - трафик,
   - количество устройств,
   - цена,
   - кнопки «Оплатить», «Назад».
5. После оплаты:
   - создать или продлить Marzban user,
   - сохранить subscription_url,
   - отправить пользователю ссылку/QR,
   - показать инструкции.

### 6.3. Тестовый период

Сценарий:

1. Проверить, не использовал ли пользователь тест раньше.
2. Если нет — создать trial subscription.
3. Создать Marzban user с ограниченным сроком и лимитом.
4. Показать ссылку и инструкции.
5. Если уже использовал — показать сообщение и предложить купить тариф.

Настройки trial вынести в БД/settings/env:

- включён/выключен,
- duration_days,
- traffic_limit_gb.

### 6.4. Моя подписка

Показывать:

```text
👤 Ваша подписка

Статус: Активна
Тариф: Premium 30 дней
Действует до: 31.12.2026
Трафик: 12.4 GB / 100 GB

Ваша ссылка подключения:
<subscription_url>
```

Кнопки:

- 🔄 Обновить статус
- 📎 Получить ссылку
- 🧾 QR-код
- ⏳ Продлить
- 📲 Инструкции
- Назад

### 6.5. Инструкции

Разделы:

- iOS
- Android
- Windows
- macOS
- Linux
- Clash / V2Ray / Sing-box, если применимо

Тексты инструкций вынести в markdown/yaml, чтобы их можно было редактировать без изменения логики.

### 6.6. Поддержка

Показывать:

```text
💬 Поддержка Paradigma VPN

Если у вас возник вопрос, напишите нам:
<SUPPORT_URL>
```

### 6.7. FAQ

Создать простой FAQ:

- Как подключиться?
- Как продлить подписку?
- Что делать, если VPN не работает?
- Можно ли использовать на нескольких устройствах?
- Как посмотреть срок действия?

---

## 7. Админ-функции

Добавь admin-only команды или меню для Telegram ID из `ADMIN_TELEGRAM_IDS`.

Минимально:

- `/admin`
- статистика:
  - пользователи,
  - активные подписки,
  - платежи,
  - ошибки Marzban;
- выдать подписку пользователю вручную;
- продлить подписку;
- отключить подписку;
- найти пользователя по Telegram ID / username;
- рассылка сообщения всем пользователям с подтверждением перед отправкой;
- просмотр последних ошибок.

Админ-команды должны проверять права доступа.

---

## 8. Оплаты

Если платежный провайдер уже есть в проекте — интегрируйся с ним.

Если данных о провайдере нет, реализуй payment abstraction:

```python
class PaymentProvider:
    async def create_invoice(...)
    async def parse_webhook(...)
    async def get_payment_status(...)
```

И добавь `manual` provider для MVP:

1. Пользователь выбирает тариф.
2. Бот создает payment со статусом `pending`.
3. Админ может подтвердить оплату командой.
4. После подтверждения запускается выдача/продление VPN.

Не привязывай архитектуру к одному провайдеру.

---

## 9. Сайт, домен и синхронизация

Нужно предусмотреть синхронизацию с доменом и сайтом Paradigma VPN:

1. Все публичные ссылки берутся из env:
   - `PUBLIC_SITE_URL`
   - `TERMS_URL`
   - `PRIVACY_URL`
   - `SUPPORT_URL`
   - `APP_BASE_URL`
2. Если в проекте есть сайт — добавь:
   - страницу тарифов,
   - ссылку на Telegram-бота,
   - базовые инструкции,
   - privacy/terms ссылки.
3. Если сайта нет — создай минимальный landing page, если это уместно для текущего стека.
4. Webhook Telegram должен работать на домене:
   - `https://<APP_DOMAIN>/telegram/webhook`
5. Не хардкодить домены.

---

## 10. Безопасность

Обязательно:

- Не коммитить `.env`.
- Добавить `.env.example`.
- Не логировать токены, пароли, payment secrets, subscription URLs.
- Проверять Telegram webhook secret.
- Проверять payment webhook secret.
- Ограничить admin actions.
- Rate limit для чувствительных действий.
- Валидация callback data.
- Idempotency для оплаты и выдачи подписки.
- Graceful handling ошибок Marzban.
- Audit log в `bot_events`.
- Не показывать stack traces пользователям.

---

## 11. Надёжность бизнес-логики

Реализуй сервисный слой:

- `UserService`
- `PlanService`
- `SubscriptionService`
- `PaymentService`
- `MarzbanProvisioningService`
- `NotificationService`

Ключевые требования:

1. Выдача подписки должна быть идемпотентной.
2. Если платеж paid, но Marzban недоступен:
   - payment остаётся paid,
   - subscription получает статус `failed` или `pending_provisioning`,
   - админ получает уведомление,
   - должна быть команда retry provisioning.
3. Продление подписки:
   - если активна — добавить дни к текущему `expires_at`;
   - если истекла — начать от текущего времени.
4. При обновлении/продлении синхронизировать дату и лимиты с Marzban.
5. Background job должен периодически обновлять usage/status из Marzban.

---

## 12. Структура проекта

Если проект пустой, создай структуру примерно такую:

```text
.
├── app/
│   ├── main.py
│   ├── config.py
│   ├── logging.py
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── models.py
│   ├── bot/
│   │   ├── dispatcher.py
│   │   ├── handlers/
│   │   │   ├── start.py
│   │   │   ├── plans.py
│   │   │   ├── subscriptions.py
│   │   │   ├── instructions.py
│   │   │   ├── support.py
│   │   │   └── admin.py
│   │   ├── keyboards/
│   │   └── texts/
│   ├── services/
│   │   ├── users.py
│   │   ├── plans.py
│   │   ├── subscriptions.py
│   │   ├── payments.py
│   │   ├── provisioning.py
│   │   └── notifications.py
│   ├── integrations/
│   │   └── marzban.py
│   ├── payments/
│   │   ├── base.py
│   │   └── manual.py
│   └── web/
│       ├── routes.py
│       └── webhooks.py
├── alembic/
├── tests/
├── docs/
│   ├── reference_bot_audit.md
│   ├── decisions.md
│   ├── deployment.md
│   └── marzban.md
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── README.md
└── pyproject.toml
```

Адаптируй структуру, если текущий проект уже имеет свой стиль.

---

## 13. Docker и deployment

Добавь:

1. `Dockerfile`
2. `docker-compose.yml`
3. healthcheck
4. PostgreSQL service
5. Redis service, если используется
6. инструкции запуска:

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app alembic upgrade head
```

Добавь в `docs/deployment.md`:

- как заполнить `.env`,
- как настроить домен,
- как настроить Telegram webhook,
- как проверить Marzban API,
- как создать тарифы,
- как выдать тестовую подписку,
- как посмотреть логи,
- как сделать backup БД.

---

## 14. Тесты

Добавь тесты:

- MarzbanClient auth success/fail
- create_user success/fail
- Telegram `/start`
- выбор тарифа
- manual payment confirmation
- provisioning success
- provisioning failure
- subscription renewal
- admin access denied for non-admin
- idempotency payment webhook/provisioning

Если полное покрытие невозможно за один проход — создай минимум критических тестов и список оставшихся в `docs/todo.md`.

---

## 15. Seed data

Добавь seed-команду или миграцию с начальными тарифами:

1. **Start**
   - 30 дней
   - лимит: например 100 GB
   - устройства: 1
2. **Plus**
   - 30 дней
   - лимит: например 300 GB
   - устройства: 3
3. **Premium**
   - 30 дней
   - лимит: unlimited или заданный лимит
   - устройства: 5

Цены и лимиты должны легко меняться через БД/admin/config.

---

## 16. Критерии готовности

Работа считается готовой, если:

1. Бот запускается локально.
2. `/start` работает.
3. Главное меню отображается.
4. Тарифы берутся из БД.
5. Можно создать pending payment.
6. Админ может подтвердить manual payment.
7. После подтверждения создаётся/продлевается пользователь в Marzban.
8. Пользователь получает subscription link.
9. «Моя подписка» показывает актуальный статус.
10. Ошибки Marzban не ломают бота.
11. Есть `.env.example`.
12. Есть Docker/deployment docs.
13. Есть миграции БД.
14. Есть хотя бы базовые тесты.
15. README объясняет запуск и настройку.

---

## 17. Порядок работы для Codex

Действуй по шагам:

1. Осмотри репозиторий.
2. Составь краткий план в `docs/implementation_plan.md`.
3. Проверь доступность референс-бота и зафиксируй результат в `docs/reference_bot_audit.md`.
4. Проверь существующий стек и выбери минимально инвазивную реализацию.
5. Реализуй модели БД и миграции.
6. Реализуй конфиг и `.env.example`.
7. Реализуй MarzbanClient.
8. Реализуй сервисный слой.
9. Реализуй Telegram handlers/keyboards/texts.
10. Реализуй manual payment provider.
11. Реализуй admin tools.
12. Добавь Docker/deployment docs.
13. Добавь тесты.
14. Запусти форматтер/линтер/тесты.
15. В финальном ответе дай:
    - список изменённых файлов,
    - что реализовано,
    - что требует ручной настройки,
    - как запустить,
    - какие тесты прошли,
    - какие риски/ограничения остались.

---

## 18. Данные, которые нужно запросить у владельца проекта, если их нет

Если в репозитории или `.env` нет этих данных, создай placeholders и явно перечисли их в финальном ответе:

- Telegram bot token
- Telegram admin IDs
- Marzban panel domain
- Marzban admin login/password или API token, если используется
- Public site domain
- Support Telegram link
- Payment provider
- Tariff names/prices/limits
- Trial settings
- Legal links: terms/privacy

Не блокируй разработку из-за отсутствия этих данных. Делай placeholders.

---

## 19. Тексты Paradigma VPN

Используй тон: аккуратный, современный, доверительный, без агрессивных обещаний.

Не использовать формулировки вроде:

- «100% анонимность»
- «обход любых блокировок гарантирован»
- «абсолютная безопасность»

Предпочтительные формулировки:

- «стабильное подключение»
- «удобная подписка»
- «инструкции для всех популярных устройств»
- «быстрая выдача доступа»
- «поддержка при настройке»

---

## 20. Финальная проверка

Перед финальным ответом проверь:

```bash
python -m compileall app
pytest
ruff check .
```

Если в проекте другой стек — используй эквивалентные команды.

Если команды не проходят, исправь ошибки. Если исправить невозможно в рамках текущей сессии, честно укажи причину и точный лог ошибки.
