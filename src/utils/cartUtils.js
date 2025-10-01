/**
 * Cart utility functions for Lightning Stores
 * Handles cart operations with backend integration
 */

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Update cart item quantity
 * @param {string} itemId - The ID of the item to update
 * @param {number} quantity - The new quantity (must be positive)
 * @returns {Promise<Object>} - Result with success status and message
 */
export const addToCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    // Helper to safely get cart
    const getSafeCart = () => {
      let cart;
      try {
        cart = JSON.parse(localStorage.getItem("cart"));
      } catch (e) {
        cart = [];
      }
      return Array.isArray(cart) ? cart : [];
    };

    // If no token, just update local storage
    if (!token) {
      let localCart = getSafeCart();

      const existingItemIndex = localCart.findIndex(
        (item) => item._id === product._id || item.id === product.id
      );

      if (existingItemIndex >= 0) {
        localCart[existingItemIndex].quantity =
          (localCart[existingItemIndex].quantity || 1) + 1;
      } else {
        localCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));

      const totalPrice = localCart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );

      return {
        success: true,
        message: `${product.name || "Item"} added to cart!`,
        cart: localCart,
        totalPrice,
      };
    }

    // If token exists → update server
    const itemId = product.id || product._id;
    if (!itemId) {
      console.error("Error: Product ID is missing", product);
      return { success: false, message: "Product ID missing" };
    }

    await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, quantity: 1 }),
    });

    // Update local cart as fallback
    let localCart = getSafeCart();

    const existingItemIndex = localCart.findIndex(
      (item) => item._id === product._id || item.id === product.id
    );

    if (existingItemIndex >= 0) {
      localCart[existingItemIndex].quantity =
        (localCart[existingItemIndex].quantity || 1) + 1;
    } else {
      localCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(localCart));

    const totalPrice = localCart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    return {
      success: true,
      message: `${product.name} added to cart!`,
      cart: localCart,
      totalPrice,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Failed to add to cart" };
  }
};

export const getCart = async () => {
  try {
    // Get token if available
    const token = localStorage.getItem("token");

    // If no token, just return local cart
    if (!token) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Calculate total price
      const totalPrice = cart.reduce((sum, item) => {
        const price = item.price || item.productPrice || 0;
        const quantity = item.quantity || 1;
        return sum + price * quantity;
      }, 0);

      return {
        cart,
        totalPrice,
        success: true,
      };
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      credentials: "include", // ensures cookies are sent
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    // Ensure we always return cart items and calculate total price
    const cartItems = Array.isArray(data) ? data : data.cart || [];
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.price || item.productPrice || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    return {
      cart: cartItems,
      totalPrice,
      success: true,
    };
  } catch (error) {
    console.error("Error getting cart:", error);
    return {
      cart: [],
      totalPrice: 0,
      success: false,
      message: "Failed to get cart",
    };
  }
};

/**
 * Remove an item from the cart
 * @param {string} item_id - The ID of the item to remove
 * @returns {Promise<Object>} - Result with success status and message
 */
export const removeFromCart = async (item_id) => {
  if (!item_id) {
    console.error("removeFromCart called with undefined itemId");
    return { success: false, message: "Invalid item ID" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${item_id}`, {
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
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }

    const response = await fetch(`${API_BASE_URL}/cart/update/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to update item quantity",
      };
    }

    // ✅ Backend sends updated cart back
    const data = await response.json();
    const updatedCart = data.cart;

    // ✅ Always keep localStorage as an array
    localStorage.setItem(
      "cart",
      JSON.stringify(Array.isArray(updatedCart) ? updatedCart : [])
    );

    return { success: true, message: "Cart updated!", cart: updatedCart };
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      message: "Failed to update cart. Please try again.",
    };
  }
};
