'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/menu/Header';
import Hero from '../../../components/menu/Hero';
import CategoryNav from '../../../components/menu/CategoryNav';
import MenuItemCard from '../../../components/menu/MenuItemCard';
import PopularItemCard from '../../../components/menu/PopularItemCard';
import CartSidebar from '../../../components/menu/CartSidebar';
import Footer from '../../../components/menu/Footer';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CustomerMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both data in parallel
        const [itemsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/menu/items`),
          fetch(`${API_BASE_URL}/menu/categories`)
        ]);

        if (!itemsRes.ok) throw new Error('Failed to fetch menu items');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

        const itemsData = await itemsRes.json();
        const categoriesData = await categoriesRes.json();

        // Extract items array from response
        const items = itemsData.items || itemsData || [];
        
        // Extract categories array from response and add "All"
        const cats = categoriesData.categories || categoriesData || [];
        const categoryNames = ['All', ...cats.map(c => c.name)];

        setMenuItems(items);
        setCategories(categoryNames);
        
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items by category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category_name === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get popular items
  const popularItems = menuItems.filter(item => item.popular === 1);

  // Calculate cart item count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add item to cart
  const addToCart = (item) => {
    if (item.available !== 1) return;
    
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

  // Calculate total - convert price from string to number
  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-xl font-serif text-gray-900 mb-2">Failed to load menu</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        isScrolled={isScrolled}
        cartItemCount={cartItemCount}
        onShowCart={() => setShowCart(true)}
        onShowSearch={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Hero Section */}
      <Hero />

      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Popular Items Section */}
      {activeCategory === 'All' && popularItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">Signature Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our most beloved creations, crafted with passion and expertise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.map(item => (
              <PopularItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
              />
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
            <MenuItemCard
              key={item.id}
              item={{
                ...item,
                available: item.available === 1,
                category: item.category_name,
                price: parseFloat(item.price)
              }}
              onAddToCart={addToCart}
            />
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

      {/* Cart Sidebar */}
      <CartSidebar
        showCart={showCart}
        cart={cart.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }))}
        cartTotal={cartTotal}
        onClose={() => setShowCart(false)}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateInstructions={updateInstructions}
        onClearCart={clearCart}
        onPlaceOrder={placeOrder}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}