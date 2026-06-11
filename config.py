import os
from dotenv import load_dotenv

# Загружаем значения из файла .env, если он есть.
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise RuntimeError("Переменная окружения BOT_TOKEN не задана.")

DB_PATH = os.getenv("DB_PATH", "wildberries_tracker.db")
CHECK_INTERVAL_SECONDS = int(os.getenv("CHECK_INTERVAL_SECONDS", "600"))
