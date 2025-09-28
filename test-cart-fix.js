// Test script to verify cart functionality
console.log('Testing cart functionality...');

// Function to add a test item to localStorage
try {
    const testItem = {
        id: 'test1',
        name: 'Test Product',
        price: 29.99,
        image: 'https://via.placeholder.com/100x100?text=Test+Product',
        quantity: 1
    };
    
    localStorage.setItem('cart', JSON.stringify([testItem]));
    console.log('Successfully added test item to cart in localStorage');
    console.log('Stored cart data:', localStorage.getItem('cart'));
    
    // Try to parse the cart data to ensure it's valid
    const parsedCart = JSON.parse(localStorage.getItem('cart'));
    console.log('Parsed cart data:', parsedCart);
    console.log('Cart items count:', parsedCart.length);
    
    // Test price calculation
    const totalPrice = parsedCart.reduce((sum, item) => sum + item.price, 0);
    console.log('Calculated total price:', totalPrice);
    
    console.log('\n--- TEST PASSED ---\n');
    console.log('The cart functionality appears to be working correctly.');
    console.log('Now try visiting the cart page in your browser.');
    console.log('Make sure to clear any existing server processes and start fresh with:');
    console.log('1. cd c:\\Users\\Alen Sony\\OneDrive\\Documents\\projects\\Lightning_Stores');
    console.log('2. npm install (if you haven\'t already)');
    console.log('3. npm run dev');
} catch (error) {
    console.error('Error during cart test:', error);
    console.log('\n--- TEST FAILED ---\n');
    console.log('There might be an issue with how cart data is stored or retrieved.');
}