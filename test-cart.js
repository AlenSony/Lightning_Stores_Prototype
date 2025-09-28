// Script to manually add an item to localStorage cart
// This helps test if the cart functionality works at a basic level

console.log('Testing cart functionality...');

// Create a test product to add to cart
const testProduct = {
    id: 'test-123',
    name: 'iPhone 15 Pro',
    price: 1099.99,
    basePrice: 1099.99,
    quantity: 1,
    image: 'https://via.placeholder.com/200x200?text=iPhone+15+Pro',
    description: 'The latest flagship iPhone with pro camera system'
};

// Function to add product to cart (simulating Navbar functionality)
function addToCart(product) {
    try {
        // Get existing cart or create new one
        const existingCart = localStorage.getItem('cart');
        let cart = [];
        
        if (existingCart) {
            cart = JSON.parse(existingCart);
        }
        
        // Add the product
        const updatedCart = [...cart, product];
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        console.log(`Successfully added ${product.name} to cart.`);
        console.log(`Cart now has ${updatedCart.length} item(s).`);
        console.log('Cart content:', updatedCart);
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

// Run the test
console.log('\n--- Adding test product to cart ---');
const result = addToCart(testProduct);

if (result) {
    console.log('\n--- Test completed successfully ---');
    console.log('To verify, open your browser console and check localStorage.cart');
    console.log('After adding this item, the cart page should display this product.');
} else {
    console.log('\n--- Test failed ---');
    console.log('There was an error adding the product to the cart.');
}

// Additional debug info
console.log('\n--- Debug Information ---');
console.log('Current working directory:', process.cwd());
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');