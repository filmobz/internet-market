from aiogram import Router, types
from aiogram.filters import Command
import asyncio
from database import Database
from parser import ProductInfo, fetch_product_info
from config import DB_PATH

router = Router()
db = Database(DB_PATH)


def format_product_message(product: ProductInfo) -> str:
    """Возвращает красивое описание товара для Telegram-сообщения."""
    return (
        f"<b>{product.name}</b>\n"
        f"Цена: <b>{product.current_price:.2f} ₽</b>\n"
        f"Скидка: <b>{product.discount}%</b>\n"
        f"Рейтинг: <b>{product.rating or 0:.1f}</b>\n"
        f"Отзывы: <b>{product.feedback_count or 0}</b>\n"
        f"<a href=\"{product.url}\">Ссылка на товар</a>"
    )


@router.message(Command(commands=["start"]))
async def start_command(message: types.Message) -> None:
    """Приветственный обработчик для команды /start."""
    await message.answer(
        "Привет! Отправь ссылку на товар Wildberries, и я покажу информацию о нём.\n"
        "Используй /track <ссылка>, чтобы начать отслеживание цены, и /myproducts для списка отслеживаемых товаров."
    )


@router.message(Command(commands=["track"]))
async def track_command(message: types.Message) -> None:
    """Команда для отслеживания товара по ссылке."""
    args = message.text.split(maxsplit=1)
    if len(args) < 2:
        await message.answer(
            "Пожалуйста, отправь команду в формате:\n/track https://www.wildberries.ru/catalog/ID/detail.aspx"
        )
        return

    url = args[1].strip()
    try:
        product = await asyncio.to_thread(fetch_product_info, url)
    except ValueError as error:
        await message.answer(f"Ошибка: {error}")
        return
    except Exception:
        await message.answer("Не удалось получить данные товара. Проверьте ссылку и попробуйте снова.")
        return

    db.add_user(message.from_user.id, message.from_user.username or "")
    tracked = db.track_product(message.from_user.id, product)
    if tracked:
        await message.answer(
            "Товар добавлен в отслеживаемые:\n" + format_product_message(product)
        )
    else:
        await message.answer("Этот товар уже находится в вашем списке отслеживания.")


@router.message(Command(commands=["myproducts"]))
async def myproducts_command(message: types.Message) -> None:
    """Показывает список товаров, которые пользователь отслеживает."""
    products = db.get_user_products(message.from_user.id)
    if not products:
        await message.answer("Вы пока не отслеживаете ни один товар. Используйте /track <ссылка>.")
        return

    lines = ["<b>Ваши отслеживаемые товары:</b>\n"]
    for product, added_at in products:
        lines.append(
            f"<b>{product.name}</b> — {product.current_price:.2f} ₽ — "
            f"<a href=\"{product.url}\">Ссылка</a>"
        )
    await message.answer("\n".join(lines))


@router.message()
async def product_link_handler(message: types.Message) -> None:
    """Автоматически отвечает на ссылку Wildberries, если пользователь её присылает."""
    text = message.text or ""
    if "wildberries.ru/catalog/" not in text:
        return

    try:
        product = await asyncio.to_thread(fetch_product_info, text.strip())
    except ValueError as error:
        await message.answer(f"Ошибка: {error}")
        return
    except Exception:
        await message.answer("Не удалось получить информацию о товаре. Проверьте ссылку.")
        return

    await message.answer(format_product_message(product))
