import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#a832ff] mb-6">
          {t('loginTitle')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a832ff]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#a832ff] hover:bg-[#9126e6] text-white py-2 rounded-lg font-bold transition-colors duration-200"
          >
            {t('loginBtn')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {t('noAccount')}{" "}
          <Link to="/signup" className="text-[#a832ff] hover:underline font-medium">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
