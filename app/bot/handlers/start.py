from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import CallbackQuery, Message
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import main_menu
from app.bot.texts import ru
from app.config import Settings
from app.services.users import UserService

router = Router()


@router.message(CommandStart())
async def start(message: Message, session: AsyncSession, settings: Settings) -> None:
    referral_code = None
    if message.text and len(message.text.split(maxsplit=1)) == 2:
        referral_code = message.text.split(maxsplit=1)[1]
    if message.from_user:
        await UserService(session, settings).upsert_from_telegram(message.from_user, referral_code)
        await session.commit()
    await message.answer(ru.WELCOME, reply_markup=main_menu(str(settings.public_site_url)))


@router.callback_query(lambda call: call.data == "menu:main")
async def show_main_menu(call: CallbackQuery, settings: Settings) -> None:
    if call.message:
        await call.message.edit_text(ru.WELCOME, reply_markup=main_menu(str(settings.public_site_url)))
    await call.answer()
