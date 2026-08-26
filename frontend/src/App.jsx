import { useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Footer from "./components/Footer";
import Login from "./Pages/Login";
import Search from "./Pages/Search";
import ProductDetail from "./Pages/ProductDetail";
import Products from "./Pages/Products";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Cart from "./Pages/Cart";
import MyOrders from "./Pages/MyOrders";
import Checkout from "./Pages/Checkout";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/search" element={<Search />} />
        <Route path="/products/:categorySlug?" element={<Products />} />
        <Route
          path="/products/:categorySlug/:productSlug"
          element={<ProductDetail />}
        />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorder" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
