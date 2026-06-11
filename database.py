import sqlite3
from datetime import datetime
from typing import List, Optional, Tuple
from parser import ProductInfo


class Database:
    """Обёртка над SQLite для хранения пользователей и товаров."""

    def __init__(self, db_path: str):
        self.connection = sqlite3.connect(db_path, check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self._prepare_database()

    def _prepare_database(self) -> None:
        """Создаёт необходимые таблицы при запуске."""
        with self.connection:
            self.connection.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY,
                    username TEXT
                )
                """
            )
            self.connection.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                    product_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    current_price REAL NOT NULL,
                    discount INTEGER,
                    rating REAL,
                    feedback_count INTEGER,
                    last_notified_price REAL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            self.connection.execute(
                """
                CREATE TABLE IF NOT EXISTS tracked (
                    user_id INTEGER NOT NULL,
                    product_id TEXT NOT NULL,
                    added_at TEXT NOT NULL,
                    PRIMARY KEY(user_id, product_id),
                    FOREIGN KEY(user_id) REFERENCES users(user_id),
                    FOREIGN KEY(product_id) REFERENCES products(product_id)
                )
                """
            )

    def add_user(self, user_id: int, username: str) -> None:
        """Сохраняет информацию о пользователе, если он новый."""
        with self.connection:
            self.connection.execute(
                "INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)"
                , (user_id, username)
            )

    def upsert_product(self, product: ProductInfo) -> None:
        """Сохраняет или обновляет данные о товаре."""
        with self.connection:
            existing = self.connection.execute(
                "SELECT current_price, last_notified_price FROM products WHERE product_id = ?",
                (product.product_id,),
            ).fetchone()
            if existing is None:
                last_notified_price = product.current_price
            else:
                last_notified_price = existing["last_notified_price"] or existing["current_price"]

            self.connection.execute(
                """
                INSERT INTO products (
                    product_id, name, url, current_price, discount, rating, feedback_count,
                    last_notified_price, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(product_id) DO UPDATE SET
                    name=excluded.name,
                    url=excluded.url,
                    current_price=excluded.current_price,
                    discount=excluded.discount,
                    rating=excluded.rating,
                    feedback_count=excluded.feedback_count,
                    updated_at=excluded.updated_at
                """,
                (
                    product.product_id,
                    product.name,
                    product.url,
                    product.current_price,
                    product.discount,
                    product.rating,
                    product.feedback_count,
                    last_notified_price,
                    datetime.utcnow().isoformat(),
                ),
            )

    def track_product(self, user_id: int, product: ProductInfo) -> bool:
        """Добавляет товар в список отслеживания пользователя."""
        self.upsert_product(product)
        with self.connection:
            cursor = self.connection.execute(
                "INSERT OR IGNORE INTO tracked (user_id, product_id, added_at) VALUES (?, ?, ?)",
                (user_id, product.product_id, datetime.utcnow().isoformat()),
            )
        return cursor.rowcount > 0

    def get_user_products(self, user_id: int) -> List[Tuple[ProductInfo, str]]:
        """Возвращает список товаров, которые отслеживает пользователь."""
        rows = self.connection.execute(
            """
            SELECT p.* , t.added_at
            FROM products p
            JOIN tracked t ON p.product_id = t.product_id
            WHERE t.user_id = ?
            ORDER BY t.added_at DESC
            """,
            (user_id,),
        ).fetchall()

        result: List[Tuple[ProductInfo, str]] = []
        for row in rows:
            product = ProductInfo(
                product_id=row["product_id"],
                name=row["name"],
                current_price=row["current_price"],
                discount=row["discount"] or 0,
                rating=row["rating"],
                feedback_count=row["feedback_count"],
                url=row["url"],
            )
            result.append((product, row["added_at"]))
        return result

    def get_tracked_entries(self) -> List[sqlite3.Row]:
        """Возвращает список всех отслеживаемых товаров с привязкой к пользователю."""
        return self.connection.execute(
            """
            SELECT t.user_id, p.product_id, p.url, p.current_price, p.last_notified_price, p.name
            FROM tracked t
            JOIN products p ON t.product_id = p.product_id
            """
        ).fetchall()

    def update_product_price(
        self, product_id: str, new_price: float, last_notified_price: Optional[float] = None
    ) -> None:
        """Обновляет цену товара и сохраняет цену для уведомлений."""
        with self.connection:
            self.connection.execute(
                """
                UPDATE products
                SET current_price = ?,
                    last_notified_price = COALESCE(?, last_notified_price),
                    updated_at = ?
                WHERE product_id = ?
                """,
                (
                    new_price,
                    last_notified_price,
                    datetime.utcnow().isoformat(),
                    product_id,
                ),
            )
