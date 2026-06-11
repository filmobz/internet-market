import asyncio
from aiogram import Bot, Dispatcher
from aiogram.types import BotCommand
from config import BOT_TOKEN, CHECK_INTERVAL_SECONDS
from handlers import router, db
from parser import fetch_product_info


async def notify_price_changes(bot: Bot) -> None:
    """Периодически проверяем отслеживаемые товары и уведомляем пользователя при падении цены."""
    while True:
        tracked_entries = db.get_tracked_entries()
        for entry in tracked_entries:
            try:
                product_info = await asyncio.to_thread(fetch_product_info, entry["url"])
            except Exception:
                continue

            old_price = entry["current_price"]
            new_price = product_info.current_price
            if new_price < old_price:
                message_text = (
                    f"<b>Цена упала!</b>\n"
                    f"<b>{product_info.name}</b>\n"
                    f"Старая цена: <b>{old_price:.2f} ₽</b>\n"
                    f"Новая цена: <b>{new_price:.2f} ₽</b>\n"
                    f"Скидка: <b>{product_info.discount}%</b>\n"
                    f"Отзывы: <b>{product_info.feedback_count}</b>\n"
                    f"Рейтинг: <b>{product_info.rating or 0:.1f}</b>\n"
                    f"<a href=\"{product_info.url}\">Перейти к товару</a>"
                )

                await bot.send_message(entry["user_id"], message_text)
                db.update_product_price(
                    product_info.product_id,
                    new_price,
                    last_notified_price=old_price,
                )
            elif new_price != old_price:
                db.update_product_price(product_info.product_id, new_price)

        await asyncio.sleep(CHECK_INTERVAL_SECONDS)


async def main() -> None:
    """Запуск бота и фоновой задачи для отслеживания цен."""
    bot = Bot(token=BOT_TOKEN, parse_mode="HTML")
    dp = Dispatcher()
    dp.include_router(router)

    await bot.set_my_commands([
        BotCommand(command="start", description="Начать работу с ботом"),
        BotCommand(command="track", description="Отслеживать цену товара Wildberries"),
        BotCommand(command="myproducts", description="Показать отслеживаемые товары"),
    ])

    asyncio.create_task(notify_price_changes(bot))
    await dp.start_polling(bot, close_bot_session=True)


if __name__ == "__main__":
    asyncio.run(main())
