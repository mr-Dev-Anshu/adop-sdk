import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowRight,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaTruck,
} from "react-icons/fa";

const Home = () => {
  const { addToCart } = useOutletContext();
  // Product data - only 4 products
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      price: "$149.99",
      rating: 4.8,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: "$199.99",
      rating: 4.9,
      badge: "New",
    },
    {
      id: 3,
      name: "Ultra HD Camera",
      price: "$399.99",
      rating: 4.7,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Gaming Laptop Elite",
      price: "$1299.99",
      rating: 4.9,
      badge: "Trending",
    },
  ];

  // Categories
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Books",
    "Sports",
    "Toys",
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      comment: "Amazing products! The quality exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Tech Enthusiast",
      comment:
        "Best online shopping experience. Fast delivery and great support!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Fashion Blogger",
      comment: "Love the variety and style. My go-to shopping destination!",
      rating: 4,
    },
  ];

  // Render stars as text
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = "★".repeat(fullStars);
    if (hasHalfStar) stars += "½";
    stars += "☆".repeat(5 - Math.ceil(rating));
    return stars;
  };

  return (
    <div id="home-page" className="min-h-screen bg-white">
      {/* Hero Section */}
      <div id="hero-section" className="bg-black py-16 px-4 text-center">
        <div id="hero-content" className="max-w-3xl mx-auto">
          <h1
            id="hero-title"
            className="text-4xl md:text-5xl font-light text-white tracking-wide mb-3"
          >
            Welcome to ShopHub
          </h1>
          <p
            id="hero-subtitle"
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-6"
          >
            Discover quality products at the best prices
          </p>
          <div
            id="hero-buttons"
            className="flex flex-wrap gap-3 justify-center"
          >
            <button
              id="shop-now-btn"
              className="px-8 py-2.5 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Shop Now <FaArrowRight className="text-xs" />
            </button>
            <button
              id="learn-more-btn"
              className="px-8 py-2.5 border border-white text-white text-sm font-medium rounded hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        id="stats-section"
        className="max-w-6xl mx-auto px-4 -mt-6 relative z-10"
      >
        <div id="stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: <FaShoppingCart className="text-gray-600" />,
              number: "10K+",
              label: "Products Sold",
            },
            {
              icon: <FaUsers className="text-gray-600" />,
              number: "5K+",
              label: "Happy Customers",
            },
            {
              icon: <FaStar className="text-gray-600" />,
              number: "4.8",
              label: "Average Rating",
            },
            {
              icon: <FaTruck className="text-gray-600" />,
              number: "Free",
              label: "Delivery",
            },
          ].map((stat, index) => (
            <div
              key={index}
              id={`stat-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-gray-600 mb-1.5 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-xl font-semibold text-black">
                {stat.number}
              </h3>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories-section" className="max-w-6xl mx-auto px-4 py-10">
        <h2
          id="categories-title"
          className="text-2xl font-light text-center text-black mb-6"
        >
          Categories
        </h2>
        <div
          id="categories-grid"
          className="grid grid-cols-3 md:grid-cols-6 gap-2"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              id={`category-${index}`}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-1">
                {["📱", "👕", "🏠", "📚", "⚽", "🧸"][index]}
              </div>
              <h3 className="text-xs font-medium text-gray-700">{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div id="products-section" className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            id="products-title"
            className="text-2xl font-light text-center text-black mb-6"
          >
            Featured Products
          </h2>
          <div
            id="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div
                  id={`product-image-${product.id}`}
                  className="h-32 bg-gray-100 flex items-center justify-center relative"
                >
                  <span className="text-4xl opacity-60">
                    {product.id === 1 && "🎧"}
                    {product.id === 2 && "⌚"}
                    {product.id === 3 && "📷"}
                    {product.id === 4 && "💻"}
                  </span>
                  {product.badge && (
                    <span
                      id={`badge-${product.id}`}
                      className={`absolute top-1.5 left-1.5 text-white px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.badge === "Best Seller"
                          ? "bg-black"
                          : product.badge === "New"
                            ? "bg-gray-700"
                            : product.badge === "Sale"
                              ? "bg-red-600"
                              : "bg-gray-800"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div id={`product-details-${product.id}`} className="p-3">
                  <h3
                    id={`product-name-${product.id}`}
                    className="text-sm font-medium text-gray-900 mb-0.5"
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div
                    id={`product-rating-${product.id}`}
                    className="flex items-center gap-1 mb-1"
                  >
                    <span className="text-amber-500 text-xs tracking-tight">
                      {renderStars(product.rating)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Price and Button */}
                  <div
                    id={`product-footer-${product.id}`}
                    className="flex justify-between items-center mt-1.5"
                  >
                    <span
                      id={`product-price-${product.id}`}
                      className="text-base font-semibold text-black"
                    >
                      {product.price}
                    </span>
                    <button
                      id={`add-to-cart-${product.id}`}
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs rounded transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials-section" className="max-w-6xl mx-auto px-4 py-10">
        <h2
          id="testimonials-title"
          className="text-2xl font-light text-center text-black mb-6"
        >
          What Our Customers Say
        </h2>
        <div
          id="testimonials-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              id={`testimonial-${index}`}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="text-amber-500 text-sm tracking-tight mb-2">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 text-sm italic mb-3">
                "{testimonial.comment}"
              </p>
              <div>
                <h4 className="text-sm font-medium text-black">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div id="newsletter-section" className="bg-black py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            id="newsletter-title"
            className="text-2xl font-light text-white mb-2"
          >
            Subscribe to Our Newsletter
          </h2>
          <p id="newsletter-subtitle" className="text-gray-400 text-sm mb-4">
            Get updates on new products and special offers
          </p>
          <div
            id="newsletter-form"
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              id="newsletter-input"
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-700 rounded bg-gray-900 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white"
            />
            <button
              id="newsletter-submit"
              className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div
            id="footer-grid"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div id="footer-brand">
              <h3 className="text-lg font-light mb-1">ShopHub</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop shop for everything
              </p>
            </div>
            <div id="footer-links">
              <h4 className="text-sm font-medium mb-2">Quick Links</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div id="footer-social">
              <h4 className="text-sm font-medium mb-2">Follow Us</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div
            id="footer-bottom"
            className="border-t border-gray-800 pt-4 text-center"
          >
            <p className="text-gray-500 text-xs">
              © 2024 ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
