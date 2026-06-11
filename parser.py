import re
from dataclasses import dataclass
from typing import Optional
import requests

USER_AGENT = "Mozilla/5.0 (compatible; WildberriesPriceBot/1.0; +https://github.com/)"
WB_CARD_API = (
    "https://card.wb.ru/cards/detail?appType=1&curr=rub"
    "&dest=-1257786&regions=80,64,38,4,115,83,33,70,82&nm={product_id}"
)


@dataclass
class ProductInfo:
    product_id: str
    name: str
    current_price: float
    discount: int
    rating: Optional[float]
    feedback_count: Optional[int]
    url: str


def extract_product_id(url: str) -> str:
    """Извлекает ID товара из ссылки Wildberries."""
    url = url.strip()
    match = re.search(r"wildberries\.ru/catalog/(\d+)", url)
    if not match:
        raise ValueError("Неправильная ссылка. Укажите ссылку вида https://www.wildberries.ru/catalog/ID/detail.aspx")
    return match.group(1)


def fetch_product_info(url: str) -> ProductInfo:
    """Получает информацию о товаре Wildberries через публичное API карточки."""
    product_id = extract_product_id(url)
    response = requests.get(
        WB_CARD_API.format(product_id=product_id),
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )

    if response.status_code != 200:
        raise ValueError("Не удалось получить данные товара. Попробуйте позже.")

    payload = response.json()
    products = payload.get("data", {}).get("products")
    if not products:
        raise ValueError("Товар не найден или ссылка некорректна.")

    product_data = products[0]
    name = product_data.get("name") or product_data.get("brandName") or "Без названия"
    sale_price_u = product_data.get("salePriceU") or product_data.get("priceU")
    if sale_price_u is None:
        raise ValueError("Не удалось получить цену товара.")

    current_price = sale_price_u / 100
    discount = int(product_data.get("discount") or 0)
    rating = product_data.get("rating")
    feedback_count = product_data.get("feedbacks") or product_data.get("feedbacksCount") or 0

    return ProductInfo(
        product_id=product_id,
        name=name,
        current_price=current_price,
        discount=discount,
        rating=rating,
        feedback_count=feedback_count,
        url=url.strip(),
    )
