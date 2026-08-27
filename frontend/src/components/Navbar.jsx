import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  ShoppingCart,
  Home,
  ShoppingBag,
  ClipboardList,
  Phone,
  Info,
  User,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showMobileSearch =
    location.pathname === "/" || location.pathname.startsWith("/products");
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // =====================================================
  // CHECK LOGIN STATUS
  // =====================================================

  const checkLoginStatus = () => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");

    if (userId) {
      setIsLoggedIn(true);
      setUserName(name || "My Account");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  // =====================================================
  // GET CART COUNT
  // =====================================================

  const getCartCount = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(
        `https://exps-ecommercestore.onrender.com/api/cart/${userId}/`,
      );

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      // API response agar array ho
      const items = Array.isArray(data)
        ? data
        : data.results || data.cart_items || data.items || [];

      // Har cart item ki quantity ka total
      const totalQuantity = items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.log("Cart count error:", error);
      setCartCount(0);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Agar tokens bhi localStorage mein hain
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUserName("");
    setCartCount(0);
    setShowDropdown(false);

    navigate("/login");
  };

  // =====================================================
  // LOAD + UPDATE
  // =====================================================

  useEffect(() => {
    checkLoginStatus();
    getCartCount();

    const handleStorageChange = () => {
      checkLoginStatus();
      getCartCount();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cart/login update check
    const interval = setInterval(() => {
      checkLoginStatus();
      getCartCount();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // DESKTOP NAV LINK CLASS
  // =====================================================

  const desktopNavClass = ({ isActive }) =>
    isActive
      ? "border-b-2 border-red-600 pb-1 text-red-600"
      : "pb-1 text-gray-700 hover:text-red-500";

  // =====================================================
  // MOBILE NAV LINK CLASS
  // =====================================================

  const mobileNavClass = ({ isActive }) =>
    isActive ? "text-red-600" : "text-gray-600 hover:text-red-500";

  return (
    <>
      {/* =====================================================
          DESKTOP NAVBAR
      ===================================================== */}

      <nav
        className={`sticky top-0 z-50 h-16 w-full bg-white shadow-sm ${
          isAuthPage ? "hidden" : "hidden md:block"
        }`}
      >
        {" "}
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3">
          {/* ================= LOGO ================= */}

          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Shopora Logo"
              className="h-11 w-11 object-contain"
            />

            <div className="leading-none">
              <h1 className="font-serif text-2xl font-semibold tracking-wide text-red-500">
                SHOPORA
              </h1>

              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="h-px w-2 bg-red-500"></span>

                <p className="text-[9px] font-medium uppercase tracking-[2px] text-red-500">
                  FIND YOUR STYLE
                </p>

                <span className="h-px w-2 bg-red-500"></span>
              </div>
            </div>
          </Link>

          {/* ================= CENTER MENU ================= */}

          <div className="hidden items-center gap-7 font-medium lg:flex">
            <NavLink to="/" end className={desktopNavClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={desktopNavClass}>
              Products
            </NavLink>

            {isLoggedIn && (
              <NavLink to="/myorder" className={desktopNavClass}>
                My Orders
              </NavLink>
            )}

            <NavLink to="/about" className={desktopNavClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={desktopNavClass}>
              Contact
            </NavLink>
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-2">
            {/* SEARCH */}

            <form
              method="GET"
              action="/search"
              className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:border-red-400"
            >
              <Search size={18} className="text-gray-400" />

              <input
                name="q"
                placeholder="Search products..."
                className="ml-2 w-40 bg-transparent text-sm text-gray-700 outline-none"
              />
            </form>

            {/* ================= CART ================= */}

            <Link
              to="/cart"
              className="relative rounded-md p-2 text-red-500 transition hover:bg-red-50"
              title="Cart"
            >
              <ShoppingCart size={22} />

              {/* CART COUNT */}

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* ================= LOGIN / ACCOUNT DROPDOWN ================= */}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <User size={17} />

                  <span>{userName || "My Account"}</span>

                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}

                {showDropdown && (
                  <div className="absolute right-0 top-12 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
                    <div className="border-b px-4 py-2">
                      <p className="text-xs text-gray-400">Logged in as</p>

                      <p className="truncate text-sm font-medium text-gray-800">
                        {userName || "User"}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <User size={17} />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      {/* =====================================================
    MOBILE TOP HEADER
===================================================== */}

      <nav
        className={`sticky top-0 z-40 bg-white shadow-sm ${
          isAuthPage ? "block" : "md:hidden"
        }`}
      >
        {" "}
        <div className="flex flex-col items-center px-4 py-3">
          {/* LOGO */}
          <Link to="/" className="flex flex-col items-center">
            <img
              src={logo}
              alt="Shopora Logo"
              className="h-12 w-12 object-contain"
            />

            <h1 className="font-serif text-xl font-semibold tracking-wide text-red-500">
              SHOPORA
            </h1>

            <div className="mt-0.5 flex items-center justify-center gap-1">
              <span className="h-px w-2 bg-red-500"></span>

              <p className="text-[7px] font-medium uppercase tracking-[1.5px] text-red-500">
                FIND YOUR STYLE
              </p>

              <span className="h-px w-2 bg-red-500"></span>
            </div>
          </Link>

          {/* SEARCH */}
          {showMobileSearch && (
            <form
              method="GET"
              action="/search"
              className="mt-3 flex w-full max-w-md items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <Search size={18} className="shrink-0 text-gray-400" />

              <input
                name="q"
                placeholder="Search products..."
                className="ml-2 w-full bg-transparent text-sm text-gray-700 outline-none"
              />
            </form>
          )}
        </div>
      </nav>

      {/* =====================================================
          MOBILE NAVBAR
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-white shadow-lg md:hidden">
        <div className="flex items-center justify-around px-1 py-2">
          {/* HOME */}

          <NavLink to="/" end className={mobileNavClass}>
            <div className="flex flex-col items-center gap-1 text-[10px]">
              <Home size={21} />
              <span>Home</span>
            </div>
          </NavLink>

          {/* PRODUCTS */}

          <NavLink to="/products" className={mobileNavClass}>
            <div className="flex flex-col items-center gap-1 text-[10px]">
              <ShoppingBag size={21} />
              <span>Products</span>
            </div>
          </NavLink>

          {/* ORDERS */}

          {isLoggedIn && (
            <NavLink to="/myorder" className={mobileNavClass}>
              <div className="flex flex-col items-center gap-1 text-[10px]">
                <ClipboardList size={21} />
                <span>Orders</span>
              </div>
            </NavLink>
          )}
          {/*CART*/}

          <Link
            to="/cart"
            className="flex flex-col items-center gap-1 text-[10px]"
            title="Cart"
          >
            <ShoppingCart size={22} />
            <span>Cart</span>

            {/* CART COUNT */}

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* ACCOUNT / LOGIN */}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <div className="flex flex-col items-center gap-1 text-[10px]">
                <LogOut size={21} />
                <span>Logout</span>
              </div>
            </button>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-red-600">
              <div className="flex flex-col items-center gap-1 text-[10px]">
                <User size={21} />
                <span>Login</span>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
