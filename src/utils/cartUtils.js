// Utility functions for cart operations

/**
 * Adds an item to the cart stored in localStorage
 * @param {Object} item - The item to add to the cart
 * @param {string} item.name - Name of the product
 * @param {string} item.company - Company/manufacturer
 * @param {number} item.price - Price of the product
 * @param {string} item.description - Product description
 * @param {string} item.ram - RAM specification
 * @param {string} item.storage - Storage specification
 * @param {string} item.image - URL to product image
 * @returns {Object} Result object with success status and message
 */
export const addToCart = (item) => {
  try {
    // Create the cart item object with necessary properties
    const cartItem = {
      id: `${item.name}-${Date.now()}`, // Generate a unique ID
      name: item.name,
      company: item.company,
      price: parseFloat(item.price),
      description: item.description,
      ram: item.ram,
      storage: item.storage,
      image: item.image,
      quantity: 1,
      basePrice: parseFloat(item.price) // Store base price for quantity changes
    };
    
    // Get existing cart or create new
    let cart = [];
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    
    // Add the new item
    cart.push(cartItem);
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return {
      success: true,
      message: `${item.name} has been added to your cart!`,
      cartItems: cart.length
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'Failed to add item to cart. Please try again.',
      error: error.message
    };
  }
};

/**
 * Gets the current cart from localStorage
 * @returns {Array} Array of cart items
 */
export const getCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

/**
 * Removes an item from the cart
 * @param {string} itemId - The ID of the item to remove
 * @returns {Object} Result object with success status, message, and updated cart
 */
export const removeFromCart = (itemId) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return {
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart,
      total: calculateTotal(updatedCart)
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: 'Failed to remove item from cart. Please try again.',
      error: error.message
    };
  }
};

/**
 * Updates the quantity of an item in the cart
 * @param {string} itemId - The ID of the item to update
 * @param {number} change - The change in quantity (+1, -1, etc.)
 * @returns {Object} Result object with success status, message, and updated cart
 */
export const updateItemQuantity = (itemId, change) => {
  try {
    const cart = getCart();
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = (item.quantity || 1) + change;
        if (newQuantity < 1) return null; // Remove item if quantity becomes 0
        
        return {
          ...item,
          quantity: newQuantity,
          price: (item.basePrice || item.price) * newQuantity
        };
      }
      return item;
    }).filter(Boolean);
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return {
      success: true,
      message: 'Cart updated',
      cart: updatedCart,
      total: calculateTotal(updatedCart)
    };
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return {
      success: false,
      message: 'Failed to update item quantity. Please try again.',
      error: error.message
    };
  }
};

/**
 * Clears the entire cart
 * @returns {Array} Empty array representing cleared cart
 */
export const clearCart = () => {
  try {
    localStorage.removeItem('cart');
    
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    return getCart(); // Return current cart if clear fails
  }
};

/**
 * Calculates the total price of all items in the cart
 * @param {Array} cartItems - Optional array of cart items to calculate total for
 * @returns {number} Total price
 */
export const calculateTotal = (cartItems = null) => {
  try {
    // Use provided cart items or get from localStorage
    const cart = cartItems !== null ? cartItems : getCart();
    return cart.reduce((sum, item) => sum + item.price, 0);
  } catch (error) {
    console.error('Error calculating total:', error);
    return 0;
  }
};