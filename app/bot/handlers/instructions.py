from aiogram import Router
from aiogram.types import CallbackQuery

from app.bot.keyboards.common import back_keyboard
from app.bot.texts import ru
from app.config import Settings

router = Router()


@router.callback_query(lambda call: call.data == "instructions:show")
async def instructions(call: CallbackQuery) -> None:
    if call.message:
        await call.message.edit_text(ru.INSTRUCTIONS, reply_markup=back_keyboard())
    await call.answer()


@router.callback_query(lambda call: call.data == "support:show")
async def support(call: CallbackQuery, settings: Settings) -> None:
    if call.message:
        await call.message.edit_text(
            ru.SUPPORT.format(support_url=settings.support_url), reply_markup=back_keyboard()
        )
    await call.answer()


@router.callback_query(lambda call: call.data == "faq:show")
async def faq(call: CallbackQuery) -> None:
    if call.message:
        await call.message.edit_text(ru.FAQ, reply_markup=back_keyboard())
    await call.answer()
