import React, { useEffect, useState } from "react";
import axiosinstance from "../axiosinstance";
import { HiOutlineShoppingCart, HiCheck, HiPlus, HiX, HiTrash } from "react-icons/hi";
import { FiStar, FiFilter } from "react-icons/fi";
import LikeButton from "../models/LikeButton";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

const allProducts = [
  // Телефоны
  { id: 1, name: "iPhone 17 Pro Max 256GB", category: "phone", difinition: "Титановый корпус, A19 Pro чип", cost: 149990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400" },
  { id: 2, name: "iPhone 17 Pro 128GB", category: "phone", difinition: "Камера 48MP, Dynamic Island", cost: 129990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=400" },
  { id: 3, name: "Samsung Galaxy S24 Ultra", category: "phone", difinition: "S Pen, 200MP камера", cost: 124990, image: "https://images.samsung.com/is/image/samsung/p6pim/ru/2401/gallery/ru-galaxy-s24-ultra-s928-sm-s928bztqser-thumb-539573637" },
  { id: 4, name: "Samsung Galaxy Z Fold 5", category: "phone", difinition: "Складной экран 7.6 дюймов", cost: 159990, image: "https://images.samsung.com/is/image/samsung/p6pim/ru/sm-f946blbgser/gallery/ru-galaxy-z-fold5-f946-sm-f946blbgser-thumb-537243856" },
  { id: 5, name: "Xiaomi 14 Pro", category: "phone", difinition: "Leica камера, Snapdragon 8 Gen 3", cost: 89990, image: "https://i02.appmifile.com/102_operator_sg/10/01/2024/c5e91e6e5a23a7e8c71f2b5e8f3a1b2c.png" },
  { id: 6, name: "Google Pixel 8 Pro", category: "phone", difinition: "Чистый Android, AI камера", cost: 94990, image: "https://lh3.googleusercontent.com/2Ma5GLQY7pzjWpNvBl3MMSaKOQwJxLxkxbVzPw8oOmW3KHMm0M17dW09dMZ_w9HFiaw" },

  // Ноутбуки
  { id: 7, name: "MacBook Pro 16 M3 Max", category: "laptop", difinition: "M3 Max чип, 36GB RAM", cost: 349990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=400" },
  { id: 8, name: "MacBook Air 15 M3", category: "laptop", difinition: "Тонкий и лёгкий, M3 чип", cost: 159990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=400" },
  { id: 9, name: "ASUS ROG Strix G16", category: "laptop", difinition: "RTX 4070, Intel i9", cost: 179990, image: "https://dlcdnwebimgs.asus.com/gain/1E9E28FE-E7D5-4E98-BD08-CAFE7F7B5A60/w717/h525" },
  { id: 10, name: "Lenovo ThinkPad X1 Carbon", category: "laptop", difinition: "Бизнес ноутбук, 14 дюймов", cost: 189990, image: "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjIyODYzfGltYWdlL3BuZ3xoMjMvaGIxLzE0MjA0NzI4" },
  { id: 11, name: "HP Spectre x360", category: "laptop", difinition: "2-в-1 трансформер, OLED", cost: 149990, image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08473937.png" },

  // Планшеты
  { id: 12, name: "iPad Pro 12.9 M2", category: "tablet", difinition: "M2 чип, Liquid Retina XDR", cost: 129990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=400" },
  { id: 13, name: "iPad Air 5", category: "tablet", difinition: "M1 чип, 10.9 дюймов", cost: 79990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=400" },
  { id: 14, name: "Samsung Galaxy Tab S9 Ultra", category: "tablet", difinition: "14.6 дюймов, S Pen", cost: 109990, image: "https://images.samsung.com/is/image/samsung/p6pim/ru/sm-x910nzaaser/gallery/ru-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaaser-thumb-537205315" },

  // Наушники
  { id: 15, name: "AirPods Pro 2", category: "audio", difinition: "Шумоподавление, USB-C", cost: 24990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400" },
  { id: 16, name: "Sony WH-1000XM5", category: "audio", difinition: "Лучшее шумоподавление", cost: 34990, image: "https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm5_Primary_image?$categorypdpnav$" },
  { id: 17, name: "AirPods Max", category: "audio", difinition: "Премиум звук, алюминий", cost: 59990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-spacegray-202011?wid=400" },

  // Часы
  { id: 18, name: "Apple Watch Ultra 2", category: "watch", difinition: "Титан, GPS + Cellular", cost: 79990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-702702?wid=400" },
  { id: 19, name: "Apple Watch Series 9", category: "watch", difinition: "S9 чип, яркий экран", cost: 44990, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-702702?wid=400" },
  { id: 20, name: "Samsung Galaxy Watch 6", category: "watch", difinition: "Wear OS, BioActive", cost: 29990, image: "https://images.samsung.com/is/image/samsung/p6pim/ru/sm-r960nzkaser/gallery/ru-galaxy-watch6-classic-r960-sm-r960nzkaser-thumb-537159285" },
];

const categories = [
  { id: "all", name: "Все", nameUz: "Hammasi" },
  { id: "phone", name: "Телефоны", nameUz: "Telefonlar" },
  { id: "laptop", name: "Ноутбуки", nameUz: "Noutbuklar" },
  { id: "tablet", name: "Планшеты", nameUz: "Planshetlar" },
  { id: "audio", name: "Наушники", nameUz: "Quloqchinlar" },
  { id: "watch", name: "Часы", nameUz: "Soatlar" },
];

export default function FetchCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "phone", difinition: "", cost: "", image: "" });
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosinstance.get("/Products");
      const apiProducts = response.data.map(item => ({
        ...item,
        category: item.category || "phone",
        image: item.image || item.avatar || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400"
      }));
      // Объединяем локальные + API товары
      const combinedProducts = [...allProducts, ...apiProducts];
      // Убираем дубликаты по id
      const uniqueProducts = combinedProducts.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );
      setProducts(uniqueProducts);
    } catch (error) {
      console.log(error);
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productToAdd = {
      name: newProduct.name,
      category: newProduct.category,
      difinition: newProduct.difinition,
      cost: Number(newProduct.cost),
      image: newProduct.image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400",
    };

    try {
      // POST запрос в mockapi
      const response = await axiosinstance.post("/Products", productToAdd);
      console.log("Товар добавлен в MockAPI:", response.data);
      // Добавляем новый товар в список
      setProducts((prev) => [...prev, { 
        ...response.data, 
        category: productToAdd.category,
        image: productToAdd.image 
      }]);
    } catch (error) {
      console.log("Ошибка добавления:", error);
      // Если ошибка - добавляем локально
      setProducts((prev) => [...prev, { ...productToAdd, id: Date.now() }]);
    }
    
    setNewProduct({ name: "", category: "phone", difinition: "", cost: "", image: "" });
    setShowModal(false);
  };

  const handleDeleteProduct = async (product) => {
    const isLocalProduct = typeof product.id === 'number' && product.id <= 20;
    
    if (isLocalProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      return;
    }

    try {
      await axiosinstance.delete(`/Products/${product.id}`);
      console.log("Товар удалён из MockAPI:", product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (error) {
      console.log("Ошибка удаления:", error);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  if (loading) {
    return (
      <div className="px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl w-56 shadow-md p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-10 bg-gray-50">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiFilter className="text-[#a832ff]" />
          {language === 'ru' ? 'Каталог товаров' : 'Mahsulotlar katalogi'}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#a832ff] hover:bg-[#9126e6] text-white px-4 py-2 rounded-xl font-semibold transition-colors"
        >
          <HiPlus className="w-5 h-5" />
          {language === 'ru' ? 'Добавить товар' : 'Mahsulot qo\'shish'}
        </button>
      </div>

      {/* Фильтры по категориям */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === cat.id
                ? "bg-[#a832ff] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
          >
            {language === 'ru' ? cat.name : cat.nameUz}
          </button>
        ))}
      </div>

      {/* Количество товаров */}
      <p className="text-gray-500 mb-4">
        {language === 'ru' ? 'Найдено товаров:' : 'Topilgan mahsulotlar:'} {filteredProducts.length}
      </p>

      {/* Карточки товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-2xl w-56 shadow-md p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="absolute top-3 right-3 z-10 flex gap-1">
              <LikeButton />
              <button
                onClick={() => handleDeleteProduct(item)}
                className="p-1.5 bg-white/80 rounded-full hover:bg-red-500 hover:text-white text-gray-400 transition-all duration-300"
                title={language === 'ru' ? 'Удалить' : 'O\'chirish'}
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -20%
              </span>
            </div>

            <div className="overflow-hidden rounded-xl mb-3 bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">(128)</span>
            </div>

            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[40px]">
              {item.name}
            </h2>

            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
              {item.difinition}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-gray-900">{item.cost.toLocaleString('ru-RU')} ₽</span>
              <span className="text-sm text-gray-400 line-through">
                {Math.round(item.cost * 1.25).toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <button
              onClick={() => handleAddToCart(item)}
              disabled={addedIds.includes(item.id)}
              className={`
                w-full flex items-center justify-center gap-2
                py-2.5 rounded-xl font-semibold text-sm
                transition-all duration-300 shadow-md active:scale-95
                ${addedIds.includes(item.id)
                  ? "bg-green-500 text-white"
                  : "bg-[#a832ff] hover:bg-[#9126e6] text-white"
                }
              `}
            >
              {addedIds.includes(item.id) ? (
                <>
                  <HiCheck className="w-5 h-5" />
                  <span>{language === 'ru' ? 'Добавлено!' : 'Qo\'shildi!'}</span>
                </>
              ) : (
                <>
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Модальное окно добавления товара */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'ru' ? 'Добавить товар' : 'Mahsulot qo\'shish'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ru' ? 'Название' : 'Nomi'}
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
                  placeholder="iPhone 17 Pro Max"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ru' ? 'Категория' : 'Kategoriya'}
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
                >
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'ru' ? cat.name : cat.nameUz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ru' ? 'Описание' : 'Tavsif'}
                </label>
                <input
                  type="text"
                  value={newProduct.difinition}
                  onChange={(e) => setNewProduct({ ...newProduct, difinition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
                  placeholder="Титановый корпус, A19 Pro чип"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ru' ? 'Цена (₽)' : 'Narxi (₽)'}
                </label>
                <input
                  type="number"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
                  placeholder="149990"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ru' ? 'URL картинки' : 'Rasm URL'}
                </label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#a832ff] hover:bg-[#9126e6] text-white py-3 rounded-xl font-bold transition-colors"
              >
                {language === 'ru' ? 'Добавить' : 'Qo\'shish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
