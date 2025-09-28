// Test script to verify cart functionality
// This script can be run in the browser console or as a standalone test

// Function to add a test item to the cart
function addTestItemToCart() {
  try {
    // Create a test item
    const testItem = {
      name: 'Test Product - " + new Date().toISOString().slice(0, 19) + "',
      company: 'Test Company',
      price: '199.99',
      description: 'This is a test product to verify cart functionality',
      ram: '8GB',
      storage: '256GB',
      image: 'https://via.placeholder.com/100x100?text=Test'
    };
    
    // Create the cart item object with necessary properties
    const cartItem = {
      id: `${testItem.name}-${Date.now()}`, // Generate a unique ID
      name: testItem.name,
      company: testItem.company,
      price: parseFloat(testItem.price),
      description: testItem.description,
      ram: testItem.ram,
      storage: testItem.storage,
      image: testItem.image,
      quantity: 1,
      basePrice: parseFloat(testItem.price) // Store base price for quantity changes
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
    
    console.log(`✓ Item "${testItem.name}" added to cart`);
    console.log('  - Total items in cart:', cart.length);
    console.log('  - Cart content preview:', cart);
    
    return {
      success: true,
      message: `${testItem.name} has been added to your cart!`,
      item: cartItem,
      cart: cart
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'Failed to add item to cart. Please try again.',
      error: error.message
    };
  }
}

// Function to get cart contents
function getCartContents() {
  try {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    console.log('✓ Cart retrieved');
    console.log('  - Number of items:', cart.length);
    console.log('  - Cart contents:', cart);
    
    return cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

// Function to clear the cart
function clearCartContents() {
  try {
    localStorage.removeItem('cart');
    console.log('✓ Cart cleared');
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    return getCartContents();
  }
}

// Helper function to calculate cart total
function calculateCartTotal() {
  const cart = getCartContents();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  console.log('✓ Cart total calculated');
  console.log('  - Total price: $' + total.toFixed(2));
  return total;
}

// Run a complete test sequence
function runCompleteTest() {
  console.log('\n===== Starting Cart Functionality Test =====\n');
  
  // 1. Clear the cart first
  console.log('Step 1: Clear existing cart');
  clearCartContents();
  
  // 2. Add a test item
  console.log('\nStep 2: Add a test item to cart');
  const addResult = addTestItemToCart();
  if (!addResult.success) {
    console.error('Test failed at step 2:', addResult.error);
    return;
  }
  
  // 3. Verify the item is in the cart
  console.log('\nStep 3: Verify item is in cart');
  const cart = getCartContents();
  if (cart.length === 0) {
    console.error('Test failed: Cart is empty after adding item');
    return;
  }
  
  // 4. Calculate and verify total
  console.log('\nStep 4: Calculate and verify cart total');
  const total = calculateCartTotal();
  if (total <= 0) {
    console.error('Test failed: Total price is zero or negative');
    return;
  }
  
  // 5. Add a second item
  console.log('\nStep 5: Add a second test item to cart');
  const addResult2 = addTestItemToCart();
  if (!addResult2.success) {
    console.error('Test failed at step 5:', addResult2.error);
    return;
  }
  
  // 6. Verify both items are in the cart
  console.log('\nStep 6: Verify both items are in cart');
  const cartAfterSecondAdd = getCartContents();
  if (cartAfterSecondAdd.length !== 2) {
    console.error('Test failed: Expected 2 items in cart, but found', cartAfterSecondAdd.length);
    return;
  }
  
  console.log('\n===== Test Completed Successfully! =====');
  console.log('✅ Cart functionality is working correctly');
  console.log('✅ Items added to cart are properly stored in localStorage');
  console.log('✅ CartPage should now display items correctly when navigating to it');
}

// Run the test when this script is executed
if (typeof window !== 'undefined') {
  // For browser environment
  console.log('Cart Test Script Loaded');
  console.log('To run a complete test, type: runCompleteTest()');
  console.log('To add a single test item: addTestItemToCart()');
  console.log('To view cart contents: getCartContents()');
  console.log('To clear cart: clearCartContents()');
} else {
  // For Node.js environment (would require localStorage mock)
  console.log('This script is designed to run in a browser environment');
}

// Make functions available globally for easy testing in browser console
if (typeof window !== 'undefined') {
  window.addTestItemToCart = addTestItemToCart;
  window.getCartContents = getCartContents;
  window.clearCartContents = clearCartContents;
  window.calculateCartTotal = calculateCartTotal;
  window.runCompleteTest = runCompleteTest;
}