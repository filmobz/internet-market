import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <HiOutlineShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">{t('emptyCart')}</h2>
        <p className="text-gray-500 mb-6">{t('emptyCartText')}</p>
        <Link
          to="/"
          className="bg-[#a832ff] hover:bg-[#9126e6] text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('cart')}</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <FiTrash2 />
            {t('clearCart')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain bg-gray-50 rounded-xl p-1"
              />

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.difinition}</p>
                <p className="text-[#a832ff] font-bold mt-1">{item.cost.toLocaleString('ru-RU')} ₽</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                >
                  <FiMinus />
                </button>
                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#a832ff] hover:bg-[#9126e6] text-white flex items-center justify-center transition"
                >
                  <FiPlus />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-bold text-xl">{(item.cost * item.quantity).toLocaleString('ru-RU')} ₽</p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-600 p-2 transition"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">{t('totalItems')}:</span>
            <span className="font-bold text-lg">{totalItems}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 text-xl">{t('total')}:</span>
            <span className="font-bold text-3xl text-[#a832ff]">{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button className="w-full bg-[#a832ff] hover:bg-[#9126e6] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
            {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  );
}
