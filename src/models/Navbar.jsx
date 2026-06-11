import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FiUser } from 'react-icons/fi'
import { MdLocationOn } from 'react-icons/md'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const { totalItems, totalPrice } = useCart();

    return (
        <div>
            <div className='flex flex-col bg-gradient-to-r from-purple-700 to-fuchsia-600' >
                <div className='flex justify-between px-20 pt-3'>
                    <div className='flex gap-58'>
                        <p>👤{t('tashkent')}</p>
                        <div className='flex gap-10 text-white'>
                            <Link to="/" className="hover:opacity-80">{t('brands')}</Link>
                            <p>{t('forBusiness')}</p>
                            <p>{t('workAt')}</p>
                        </div>

                    </div>
                    <div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none text-white bg-purple-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="ru">{t('russia')}</option>
                            <option value="uz">{t('uzbekistan')}</option>
                        </select>
                    </div>
                </div>
                <div className='px-80 pb-4'>
                    <div className='flex gap-20 items-center'>
                        <div className='flex gap-5'>
                            <button className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg">
                                <div className="flex flex-col gap-1">
                                    <span className="w-6 h-[2px] bg-white rounded"></span>
                                    <span className="w-6 h-[2px] bg-white rounded"></span>
                                    <span className="w-6 h-[2px] bg-white rounded"></span>
                                </div>
                            </button>
                            <input type="text" placeholder={t('search')} className='border pl-6 pr-96 rounded-2xl bg-white' />
                        </div>
                        <div>
                            <div className="flex gap-10 items-center py-4 text-gray-700">

                                <div className="flex flex-col items-center gap-1 cursor-pointer">
                                    <MdLocationOn className='text-white' size={20} />
                                    <span className="text-sm text-white">{t('addresses')}</span>
                                </div>

                                <Link to="/login" className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
                                    <FiUser className='text-white' size={20} />
                                    <span className="text-sm text-white">{t('login')}</span>
                                </Link>

                                <Link to="/cart" className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 relative">
                                    <div className="relative">
                                        <AiOutlineShoppingCart className='text-white' size={20} />
                                        {totalItems > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                {totalItems > 99 ? '99+' : totalItems}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-white">{t('cart')}</span>
                                    {totalPrice > 0 && (
                                        <span className="text-xs text-yellow-300 font-semibold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                                    )}
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
