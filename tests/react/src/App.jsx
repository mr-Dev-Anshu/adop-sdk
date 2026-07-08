import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaInfoCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shophub_cart");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("shophub_cart", JSON.stringify(cart));
  }, [cart]);

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome />, id: "nav-home" },
    {
      path: "/product",
      label: "Products",
      icon: <FaBox />,
      id: "nav-products",
    },
    { path: "/about", label: "About", icon: <FaInfoCircle />, id: "nav-about" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const priceVal = typeof product.price === "string" 
        ? parseFloat(product.price.replace(/[^0-9.]/g, "")) 
        : product.price;
      return [...prevCart, { ...product, price: priceVal, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div id="app-container" className="min-h-screen bg-white text-black font-sans relative">
      {/* Navigation Bar */}
      <nav id="navbar" className="bg-black sticky top-0 z-50 shadow-sm">
        <div id="navbar-container" className="max-w-6xl mx-auto px-4">
          <div
            id="navbar-inner"
            className="flex justify-between items-center h-14"
          >
            {/* Logo */}
            <Link
              id="logo-link"
              to="/"
              className="text-white font-light text-xl tracking-wide hover:text-gray-300 transition-colors"
            >
              ShopHub
            </Link>

            {/* Desktop Navigation */}
            <div id="desktop-nav" className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  id={link.id}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded transition-colors ${
                    location.pathname === link.path
                      ? "bg-white text-black"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Cart Link Button */}
              <Link
                id="cart-btn"
                to="/cart"
                className={`flex items-center gap-1.5 ml-2 px-3 py-1.5 text-sm rounded transition-colors ${
                  location.pathname === "/cart"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FaShoppingCart />
                <span
                  id="cart-count"
                  className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
                >
                  {cartCount}
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={toggleMenu}
              className="md:hidden text-white text-xl hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              id="mobile-nav"
              className="md:hidden pb-3 border-t border-gray-800"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  id={`${link.id}-mobile`}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded transition-colors ${
                    location.pathname === link.path
                      ? "bg-white text-black"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Link
                id="mobile-cart-btn"
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded transition-colors w-full ${
                  location.pathname === "/cart"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FaShoppingCart />
                Cart ({cartCount} items)
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <Outlet context={{ cart, clearCart, cartCount, cartTotal, addToCart, removeFromCart }} />
    </div>
  );
};

export default App;
