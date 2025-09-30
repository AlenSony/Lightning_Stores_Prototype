/**
 * Cart utility functions for Lightning Stores
 * Handles cart operations with backend integration
 */

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Add an item to the cart
 * @param {Object} product - The product to add to cart
 * @returns {Promise<Object>} - Result with success status and message
 */
export const addToCart = async (product) => {
  try {
    // First, add to backend
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: product._id,
        quantity: 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || 'Failed to add item to cart' 
      };
    }

    // If backend operation succeeds, update local cart
    const localCart = getCart();
    
    // Check if product already exists in cart
    const existingItemIndex = localCart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      localCart[existingItemIndex].quantity = (localCart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Add new item with quantity 1
      localCart.push({ ...product, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(localCart));
    
    return { 
      success: true, 
      message: `${product.name} added to cart!` 
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { 
      success: false, 
      message: 'Failed to add item to cart. Please try again.' 
    };
  }
};

/**
 * Get the current cart
 * @returns {Array} - Array of cart items
 */
export const getCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - The ID of the item to remove
 * @returns {Promise<Object>} - Result with success status and message
 */
export const removeFromCart = async (itemId) => {
  try {
    // First, remove from backend
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({ productId: itemId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || 'Failed to remove item from cart' 
      };
    }

    // If backend operation succeeds, update local cart
    const localCart = getCart();
    const updatedCart = localCart.filter(item => item._id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return { 
      success: true, 
      message: 'Item removed from cart!' 
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { 
      success: false, 
      message: 'Failed to remove item from cart. Please try again.' 
    };
  }
};

/**
 * Update the quantity of an item in the cart
 * @param {string} itemId - The ID of the item to update
 * @param {number} quantity - The new quantity
 * @returns {Promise<Object>} - Result with success status and message
 */
export const updateItemQuantity = async (itemId, quantity) => {
  try {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }

    // First, update in backend
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({ 
        productId: itemId,
        quantity 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || 'Failed to update item quantity' 
      };
    }

    // If backend operation succeeds, update local cart
    const localCart = getCart();
    const updatedCart = localCart.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return { 
      success: true, 
      message: 'Cart updated!' 
    };
  } catch (error) {
    console.error('Error updating cart:', error);
    return { 
      success: false, 
      message: 'Failed to update cart. Please try again.' 
    };
  }
};

/**
 * Calculate the total price of items in the cart
 * @returns {number} - The total price
 */
export const calculateTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
};

/**
 * Clear the entire cart
 * @returns {Promise<Object>} - Result with success status and message
 */
export const clearCart = async () => {
  try {
    // First, clear in backend
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || 'Failed to clear cart' 
      };
    }

    // If backend operation succeeds, clear local cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    return { 
      success: true, 
      message: 'Cart cleared!' 
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { 
      success: false, 
      message: 'Failed to clear cart. Please try again.' 
    };
  }
};