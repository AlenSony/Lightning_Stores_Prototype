/**
 * Cart utility functions for Lightning Stores
 * Handles cart operations with backend integration
 */

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Add an item to the cart
 * @param {Object} product - The product to add to cart
 * @returns {Promise<Object>} - Result with success status and message
 */
export const addToCart = async (product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      credentials: "include", // crucial for cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: product.id || product._id,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
    }

    // Update local cart if needed
    const localCart = getCart();
    const existingItemIndex = localCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingItemIndex >= 0) {
      localCart[existingItemIndex].quantity =
        (localCart[existingItemIndex].quantity || 1) + 1;
    } else {
      localCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(localCart));

    return {
      success: true,
      message: `${product.name} added to cart!`,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

/**
 * Get the current cart
 * @returns {Array} - Array of cart items
 */
export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      credentials: "include", // ensures cookies are sent
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      return {
        success: false,
        message: errorData.message || "Failed to get cart",
      };
    }

    const data = await response.json();
    console.log("Cart data:", data);

    // Ensure we always return an array
    return Array.isArray(data) ? data : data.cart || [];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - The ID of the item to remove
 * @returns {Promise<Object>} - Result with success status and message
 */
export const removeFromCart = async (itemId) => {
  if (!itemId) {
    console.error("removeFromCart called with undefined itemId");
    return { success: false, message: "Invalid item ID" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    // Try to parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove item from cart",
      };
    }

    return { success: true, message: data.message, cart: data.cart || [] };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: "Failed to remove item from cart" };
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({
        productId: itemId,
        quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to update item quantity",
      };
    }

    // If backend operation succeeds, update local cart
    const localCart = getCart();
    const updatedCart = localCart.map((item) => {
      if (item._id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return {
      success: true,
      message: "Cart updated!",
    };
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      message: "Failed to update cart. Please try again.",
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
    return total + item.price * (item.quantity || 1);
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
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to clear cart",
      };
    }

    // If backend operation succeeds, clear local cart
    localStorage.setItem("cart", JSON.stringify([]));

    return {
      success: true,
      message: "Cart cleared!",
    };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      message: "Failed to clear cart. Please try again.",
    };
  }
};
