import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const Cart = () => {
  const { cart, clearCart, cartCount, cartTotal, removeFromCart } = useOutletContext();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <div id="cart-page" className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div id="cart-header" className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h1 id="cart-title" className="text-2xl font-light text-black flex items-center gap-2">
          <FaShoppingCart className="text-gray-600" />
          Shopping Cart
        </h1>
        <Link 
          to="/product" 
          id="back-to-products" 
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <FaArrowLeft size={12} />
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 && !orderPlaced ? (
        <div id="empty-cart-container" className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-4">
          <span className="text-4xl text-gray-300">🛒</span>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-700">Your cart is empty</h3>
            <p className="text-xs text-gray-500 max-w-xs">Items you add to your cart will appear here for checkout.</p>
          </div>
          <Link
            to="/product"
            id="browse-products-btn"
            className="mt-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : orderPlaced ? (
        <div id="success-message-overlay" className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-4">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <div className="flex flex-col gap-1.5">
            <h2 id="success-title" className="text-lg font-bold text-black">Order Placed Successfully!</h2>
            <p id="success-description" className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Your order has been recorded. Thank you for shopping with us!
            </p>
          </div>
          <button
            id="success-close-btn"
            onClick={() => setOrderPlaced(false)}
            className="mt-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div id="cart-content-grid" className="grid md:grid-cols-3 gap-8 items-start">
          {/* Items Timeline list */}
          <div id="cart-items-list" className="md:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                id={`cart-item-${item.id}`} 
                className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-black">{item.name}</span>
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    id={`remove-item-${item.id}`}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Info Box */}
          <div id="checkout-summary-box" className="p-6 bg-gray-50 border border-gray-100 rounded-xl flex flex-col gap-6">
            <h3 className="font-bold text-sm text-black border-b border-gray-200 pb-3">Order Summary</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Selected Items:</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-black border-t border-gray-200 pt-3">
                <span>Grand Total:</span>
                <span id="cart-total-price">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
