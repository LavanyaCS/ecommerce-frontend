import React from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Header from './pages/Header'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'
import CategoryProducts from './pages/CategoryProducts'
import CartPage from './pages/CartPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import CheckoutPage from './pages/CheckoutPage'
import MyAccount from './pages/MyAccount'
import AddressPage from './pages/AddressPage'
import OrderPage from './pages/OrderPage'
import OrderDetailPage from './pages/OrderDetailPage'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './pages/Footer'
import AboutUs from './pages/AboutUs'
import { Contact } from 'lucide-react'
import ContactUs from './pages/ContactUs'

function App() {
  return (
  
      <div className="h-screen w-full flex flex-col">

      <Header />
      <div className="flex-1 overflow-y-auto w-full px-4 md:px-0">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
          {/* Dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

        <Route path="/product" element={<Product />}></Route>
        <Route path="/product/:id" element={<ProductDetail />}></Route>

  <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/my-wishlist" element={<Wishlist />}></Route>
<Route path="/cart" element={<CartPage />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/order/:orderId" element={<OrderDetailPage />} />
 <Route path="/account" element={<MyAccount />} />
  <Route path="/account/addresses" element={<AddressPage />} />
  <Route path="/myorders" element={<OrderPage />} />
  <Route path="/about" element={<AboutUs />} />
  <Route path="/contact" element={<ContactUs />} />


      </Routes>
      </div>
        <Footer />
    </div>
  )
}

export default App
