import React, { createContext, useContext, useState } from "react";

const translations = {
  ru: {
    brands: "Бренды",
    forBusiness: "Для бизнеса",
    workAt: "Работа в",
    addresses: "Адреса",
    login: "Войти",
    cart: "Корзина",
    search: "Найти в WB",
    russia: "Россия",
    uzbekistan: "Узбекистан",
    loginTitle: "Вход",
    signupTitle: "Регистрация",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    name: "Имя",
    yourName: "Ваше имя",
    loginBtn: "Войти",
    signupBtn: "Зарегистрироваться",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    register: "Зарегистрироваться",
    passwordMismatch: "Пароли не совпадают!",
    january: "января",
    tashkent: "Ташкент",
    addToCart: "В корзину",
    emptyCart: "Корзина пуста",
    emptyCartText: "Добавьте товары для оформления заказа",
    continueShopping: "Продолжить покупки",
    clearCart: "Очистить корзину",
    totalItems: "Товаров",
    total: "Итого",
    checkout: "Оформить заказ",
  },
  uz: {
    brands: "Brendlar",
    forBusiness: "Biznes uchun",
    workAt: "Ish joyi",
    addresses: "Manzillar",
    login: "Kirish",
    cart: "Savat",
    search: "WB da qidirish",
    russia: "Rossiya",
    uzbekistan: "O'zbekiston",
    loginTitle: "Kirish",
    signupTitle: "Ro'yxatdan o'tish",
    email: "Email",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    name: "Ism",
    yourName: "Ismingiz",
    loginBtn: "Kirish",
    signupBtn: "Ro'yxatdan o'tish",
    noAccount: "Akkauntingiz yo'qmi?",
    haveAccount: "Akkauntingiz bormi?",
    register: "Ro'yxatdan o'tish",
    passwordMismatch: "Parollar mos kelmadi!",
    january: "yanvar",
    tashkent: "Toshkent",
    addToCart: "Savatga",
    emptyCart: "Savat bo'sh",
    emptyCartText: "Buyurtma berish uchun mahsulot qo'shing",
    continueShopping: "Xaridni davom ettirish",
    clearCart: "Savatni tozalash",
    totalItems: "Mahsulotlar",
    total: "Jami",
    checkout: "Buyurtma berish",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ru");

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
