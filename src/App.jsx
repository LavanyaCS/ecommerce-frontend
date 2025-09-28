import React from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Header from './pages/Header'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'
import CategoryProducts from './pages/CategoryProducts'
import CartPage from './pages/Cartpage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import CheckoutPage from './pages/CheckoutPage'
import MyAccount from './pages/MyAccount'
import Addresses from './pages/Addresses'
import AddressPage from './pages/AddressPage'

function App() {
  return (
  
      <div className="h-screen w-full flex flex-col">

      <Header />
      <div className="flex-1 overflow-y-auto w-full">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/product" element={<Product />}></Route>
        <Route path="/product/:id" element={<ProductDetail />}></Route>

  <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/my-wishlist" element={<Wishlist />}></Route>
<Route path="/cart" element={<CartPage />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/order/:orderId" element={<OrderConfirmationPage />} />
 <Route path="/account" element={<MyAccount />} />
  <Route path="/account/addresses" element={<Addresses />} />
  <Route path="/account/addresses" element={<AddressPage />} />


      </Routes>
      </div>
    </div>
  )
}

export default App
