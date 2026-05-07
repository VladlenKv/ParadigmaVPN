from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from app.db.models import Plan


def main_menu(public_site_url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🚀 Купить VPN", callback_data="plans:list")],
            [InlineKeyboardButton(text="🎁 Тестовый период", callback_data="trial:create")],
            [InlineKeyboardButton(text="👤 Моя подписка", callback_data="subscription:show")],
            [InlineKeyboardButton(text="📲 Инструкции", callback_data="instructions:show")],
            [InlineKeyboardButton(text="💬 Поддержка", callback_data="support:show")],
            [InlineKeyboardButton(text="🌐 Сайт", url=public_site_url)],
            [InlineKeyboardButton(text="❓ FAQ", callback_data="faq:show")],
        ]
    )


def plans_keyboard(plans: list[Plan]) -> InlineKeyboardMarkup:
    rows = [
        [
            InlineKeyboardButton(
                text=f"{plan.title} · {plan.price_amount:g} {plan.currency}",
                callback_data=f"plans:select:{plan.id}",
            )
        ]
        for plan in plans
    ]
    rows.append([InlineKeyboardButton(text="Назад", callback_data="menu:main")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def plan_details_keyboard(plan_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Оплатить", callback_data=f"payments:create:{plan_id}")],
            [InlineKeyboardButton(text="Назад", callback_data="plans:list")],
        ]
    )


def back_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Назад", callback_data="menu:main")]]
    )


def subscription_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔄 Обновить статус", callback_data="subscription:show")],
            [InlineKeyboardButton(text="⏳ Продлить", callback_data="plans:list")],
            [InlineKeyboardButton(text="📲 Инструкции", callback_data="instructions:show")],
            [InlineKeyboardButton(text="Назад", callback_data="menu:main")],
        ]
    )
