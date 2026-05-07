from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import CallbackQuery, Message
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import main_menu
from app.bot.texts import ru
from app.config import Settings
from app.services.users import UserService

router = Router()


def user_is_admin(telegram_id: int | None, settings: Settings) -> bool:
    return telegram_id is not None and telegram_id in settings.admin_telegram_ids


@router.message(CommandStart())
async def start(message: Message, session: AsyncSession, settings: Settings) -> None:
    referral_code = None
    if message.text and len(message.text.split(maxsplit=1)) == 2:
        referral_code = message.text.split(maxsplit=1)[1]
    if message.from_user:
        await UserService(session, settings).upsert_from_telegram(message.from_user, referral_code)
        await session.commit()
    await message.answer(
        ru.WELCOME,
        reply_markup=main_menu(
            str(settings.public_site_url),
            is_admin=user_is_admin(message.from_user.id if message.from_user else None, settings),
        ),
    )


@router.callback_query(lambda call: call.data == "menu:main")
async def show_main_menu(call: CallbackQuery, settings: Settings) -> None:
    if call.message:
        await call.message.edit_text(
            ru.WELCOME,
            reply_markup=main_menu(
                str(settings.public_site_url),
                is_admin=user_is_admin(call.from_user.id if call.from_user else None, settings),
            ),
        )
    await call.answer()