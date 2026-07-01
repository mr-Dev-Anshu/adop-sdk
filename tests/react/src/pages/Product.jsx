import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaHeartBroken,
} from "react-icons/fa";

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  // Product Data - Only 4 products
  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      category: "Audio",
      price: 149.99,
      rating: 4.8,
      reviews: 234,
      badge: "Best Seller",
      stock: 15,
      description: "Premium wireless headphones with noise cancellation.",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Wearables",
      price: 199.99,
      rating: 4.9,
      reviews: 189,
      badge: "New",
      stock: 8,
      description: "Advanced fitness tracker with heart rate monitor and GPS.",
    },
    {
      id: 3,
      name: "Professional Camera",
      category: "Photography",
      price: 399.99,
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
      stock: 5,
      description: "Professional-grade camera with 4K video and 24MP sensor.",
    },
    {
      id: 4,
      name: "Gaming Laptop Elite",
      category: "Computers",
      price: 1299.99,
      rating: 4.9,
      reviews: 312,
      badge: "Trending",
      stock: 3,
      description: "High-performance gaming laptop with RTX 4080 graphics.",
    },
  ];

  // Get unique categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

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
    <div id="product-page" className="min-h-screen bg-white">
      {/* Header */}
      <div id="product-header" className="bg-black py-12 px-4 text-center">
        <h1
          id="product-title"
          className="text-3xl md:text-4xl font-light text-white tracking-wide"
        >
          Products
        </h1>
        <p
          id="product-subtitle"
          className="text-gray-400 text-sm mt-2 max-w-md mx-auto"
        >
          Discover our curated collection of premium products
        </p>
      </div>

      {/* Search and Filters */}
      <div
        id="product-filters-section"
        className="max-w-6xl mx-auto px-4 -mt-4 relative z-10"
      >
        <div
          id="filters-container"
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6"
        >
          <div id="filters-grid" className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div
              id="search-container"
              className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50"
            >
              <FaSearch
                id="search-icon"
                className="text-gray-400 mr-2 text-sm"
              />
              <input
                id="search-input"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent py-1.5 text-sm w-full outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none focus:border-black"
            >
              {categories.map((category) => (
                <option key={`cat-${category}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Chips */}
          {(selectedCategory !== "All" || searchTerm) && (
            <div id="filter-chips" className="flex flex-wrap gap-2 mt-3">
              {selectedCategory !== "All" && (
                <span className="bg-gray-200 text-gray-800 px-3 py-0.5 rounded-full text-xs flex items-center gap-1.5">
                  {selectedCategory}
                  <button
                    id="clear-category-filter"
                    onClick={() => setSelectedCategory("All")}
                    className="text-gray-600 hover:text-black text-sm"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="bg-gray-200 text-gray-800 px-3 py-0.5 rounded-full text-xs flex items-center gap-1.5">
                  {searchTerm}
                  <button
                    id="clear-search-filter"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-600 hover:text-black text-sm"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div id="results-container" className="mb-4">
          <p id="results-count" className="text-gray-600 text-sm">
            Showing{" "}
            <strong id="results-number" className="text-black">
              {filteredProducts.length}
            </strong>{" "}
            products
          </p>
        </div>

        {/* Products Grid */}
        <div
          id="products-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Badge */}
              {product.badge && (
                <div
                  id={`badge-${product.id}`}
                  className={`absolute top-2 left-2 text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium z-10 ${
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
                </div>
              )}

              {/* Product Image Placeholder */}
              <div
                id={`product-image-${product.id}`}
                className="h-40 bg-gray-100 flex items-center justify-center relative"
              >
                <span
                  id={`product-icon-${product.id}`}
                  className="text-5xl opacity-60"
                >
                  {product.id === 1 && "🎧"}
                  {product.id === 2 && "⌚"}
                  {product.id === 3 && "📷"}
                  {product.id === 4 && "💻"}
                </span>

                {/* Wishlist Button */}
                <button
                  id={`wishlist-btn-${product.id}`}
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {wishlist.includes(product.id) ? (
                    <FaHeart
                      id={`heart-filled-${product.id}`}
                      className="text-red-500 text-sm"
                    />
                  ) : (
                    <FaHeartBroken
                      id={`heart-empty-${product.id}`}
                      className="text-gray-400 text-sm"
                    />
                  )}
                </button>
              </div>

              {/* Product Details */}
              <div id={`product-details-${product.id}`} className="p-3">
                <div id={`product-header-${product.id}`} className="mb-1">
                  <h3
                    id={`product-name-${product.id}`}
                    className="text-sm font-medium text-gray-900"
                  >
                    {product.name}
                  </h3>
                  <span
                    id={`product-category-${product.id}`}
                    className="text-xs text-gray-500"
                  >
                    {product.category}
                  </span>
                </div>

                <p
                  id={`product-description-${product.id}`}
                  className="text-xs text-gray-500 my-1.5"
                >
                  {product.description}
                </p>

                {/* Rating */}
                <div
                  id={`product-rating-${product.id}`}
                  className="flex items-center gap-1.5 mb-1.5"
                >
                  <span
                    id={`stars-${product.id}`}
                    className="text-amber-500 text-xs tracking-tight"
                  >
                    {renderStars(product.rating)}
                  </span>
                  <span
                    id={`reviews-${product.id}`}
                    className="text-xs text-gray-400"
                  >
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and Stock */}
                <div
                  id={`product-price-stock-${product.id}`}
                  className="flex justify-between items-center"
                >
                  <span
                    id={`current-price-${product.id}`}
                    className="text-base font-semibold text-black"
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    id={`stock-status-${product.id}`}
                    className={`text-[10px] font-medium ${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 5
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 5
                        ? `${product.stock} left`
                        : `Only ${product.stock} left`}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  id={`add-to-cart-${product.id}`}
                  className="w-full mt-2.5 py-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <FaShoppingCart
                    id={`cart-icon-${product.id}`}
                    className="text-xs"
                  />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div id="no-results" className="text-center py-10">
            <p id="no-results-message" className="text-gray-500 text-sm">
              No products found matching your criteria.
            </p>
            <button
              id="clear-all-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-2 text-sm text-black underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
