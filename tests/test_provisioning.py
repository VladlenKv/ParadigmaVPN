import pytest

pytest.importorskip("sqlalchemy")

from app.db.models import User  # noqa: E402
from app.services.provisioning import gb_to_bytes, marzban_username_for  # noqa: E402


def test_marzban_username_for_user() -> None:
    user = User(telegram_id=12345)

    assert marzban_username_for(user) == "tg_12345"
    assert marzban_username_for(user, 9) == "tg_12345_9"


def test_gb_to_bytes() -> None:
    assert gb_to_bytes(None) is None
    assert gb_to_bytes(2) == 2 * 1024 * 1024 * 1024
