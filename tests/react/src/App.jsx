import React, { useState } from "react";
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
  const location = useLocation();

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

  return (
    <div id="app-container">
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

              {/* Cart Button */}
              <button
                id="cart-btn"
                className="flex items-center gap-1.5 ml-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <FaShoppingCart />
                <span
                  id="cart-count"
                  className="bg-gray-700 text-white px-1.5 py-0.5 rounded-full text-xs"
                >
                  3
                </span>
              </button>
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
              <button
                id="mobile-cart-btn"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors w-full"
              >
                <FaShoppingCart />
                Cart (3 items)
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default App;
