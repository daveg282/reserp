'use client';
import { useState, useEffect } from 'react';
import { menuItems } from '../lib/data';
import { ArrowLeft } from 'lucide-react';

export default function CustomerMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories
  const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];

  // Filter items by category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Popular items
  const popularItems = menuItems.filter(item => item.popular);

  // Add item to cart
  const addToCart = (item) => {
    if (!item.available) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          ...item, 
          quantity: 1,
          specialInstructions: ''
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item.id !== itemId);
      } else {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  // Update special instructions
  const updateInstructions = (itemId, instructions) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Place order
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const orderDetails = {
      items: cart,
      total: cartTotal,
      tableNumber: 'T01',
      orderTime: new Date().toLocaleString()
    };
    
    console.log('Order placed:', orderDetails);
    alert(`Order placed successfully! Total: ETB ${cartTotal}\nYour order has been sent to the kitchen.`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Elegant Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
         <div className="max-w-7xl mx-auto px-6 pt-4">
    <button
      onClick={() => window.location.href = '/'}
      className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 ${
        isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
      }`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to Home</span>
    </button>
  </div>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className={`transition-all duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-90'
            }`}>
              <h1 className={`text-2xl font-serif font-bold transition-all duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>Bistro Elegante</h1>
              <p className={`text-sm transition-all duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-white/90'
              }`}>Fine Dining Experience</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 transition-all duration-300 rounded-full ${
                  isScrolled 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium">Cart</span>
                {cart.length > 0 && (
                  <span className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${
                    isScrolled ? 'bg-red-500' : 'bg-red-400'
                  }`}>
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 fade-in">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-black bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="text-white">
            <h2 className="text-5xl font-serif font-light mb-4">Our Menu</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Carefully crafted dishes using the finest ingredients
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items Section */}
      {activeCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">Signature Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our most beloved creations, crafted with passion and expertise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.map(item => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 h-48 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                      {item.image}
                    </span>
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                      <span className="text-white font-semibold">Currently Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-xl text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">ETB {item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        item.available
                          ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Menu Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
            {activeCategory === 'All' ? 'Complete Menu' : activeCategory}
          </h2>
          <p className="text-gray-600">
            {filteredItems.length} items found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-500 border border-gray-100">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{item.image}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-serif text-xl text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900 block">ETB {item.price}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        item.available
                          ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or select a different category</p>
          </div>
        )}
      </section>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          ></div>
          
          {/* Cart Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl slide-in">
            <div className="h-full flex flex-col">
              {/* Cart Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-serif font-light text-gray-900">Your Order</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Content */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="text-8xl mb-6 text-gray-300">🛒</div>
                  <h3 className="text-xl font-serif text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Discover our exquisite dishes and add them to your order
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-gray-600 text-sm">ETB {item.price} each</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="font-semibold text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Requests
                          </label>
                          <textarea
                            value={item.specialInstructions}
                            onChange={(e) => updateInstructions(item.id, e.target.value)}
                            placeholder="Any special preparation requests?"
                            rows="2"
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
                          />
                        </div>

                        {/* Item Total */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Item Total</span>
                          <span className="font-semibold text-gray-900">
                            ETB {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Footer */}
                  <div className="border-t border-gray-100 p-6 space-y-4">
                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-gray-900">ETB {cartTotal}</span>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={placeOrder}
                      className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg shadow-lg"
                    >
                      Place Order - ETB {cartTotal}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={clearCart}
                        className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Clear Cart
                      </button>
                      
                      <button
                        onClick={() => setShowCart(false)}
                        className="bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Elegant Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-serif text-2xl mb-4">Bistro Elegante</h4>
              <p className="text-gray-400 leading-relaxed">
                Experience the art of fine dining with our carefully curated menu and exceptional service.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-gray-400">
                <p>123 Gourmet Avenue</p>
                <p>Addis Ababa, Ethiopia</p>
                <p>+251 911 234 567</p>
                <p>info@bistroelegante.com</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Hours</h5>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bistro Elegante. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}