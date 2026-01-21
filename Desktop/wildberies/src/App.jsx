import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import Navbar from './models/Navbar'
import Banner from './pages/Banner'
import Karusel from './pages/Karusel'
import FetchCards from './pages/FetchCards'
import Footer from './pages/Footer'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'

function Home() {
  return (
    <>
      <Banner />
      <Karusel />
      <FetchCards />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  )
}
