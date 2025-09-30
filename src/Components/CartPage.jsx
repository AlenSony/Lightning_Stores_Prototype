import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Stylings/CartPage.css';
import { useToast } from '../assets/Toast.jsx';
import { calculateTotal, clearCart, getCart, removeFromCart, updateItemQuantity } from '../utils/cartUtils.js';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh
    const { showToast } = useToast();

    // Load cart items from API on component mount and when refresh is triggered
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const cart = await getCart();
                setCartItems(cart);
                
                // Calculate total price
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
                setTotalPrice(total);
            } catch (error) {
                console.error('Error loading cart items:', error);
                setCartItems([]);
                setTotalPrice(0);
            }
        };

        loadCartItems();
    }, [refreshTrigger]); // Refresh when this state changes
    
    // Add an event listener to refresh cart when component gains focus (useful for SPAs)
    useEffect(() => {
        const handleFocus = () => {
            setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
        };
        
        // Listen for focus events when navigating back to this tab/window
        window.addEventListener('focus', handleFocus);
        
        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Update localStorage when cart items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleRemoveItem = async (itemId) => {
        const result = await removeFromCart(itemId);
        if (result.success) {
            // Refresh cart after successful removal
            setRefreshTrigger(prev => prev + 1);
            showToast(result.message, 'success');
        } else {
            showToast(result.message, 'error');
        }
    };

    const handleQuantityChange = async (itemId, change) => {
        try {
            // For now, we'll handle quantity changes locally
            // In the future, this should call an API endpoint
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error updating quantity:', error);
            showToast('Failed to update quantity', 'error');
        }
    };

    const handleBuyNow = async () => {
        if (cartItems.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }
        
        // In a real app, this would handle the checkout process
        showToast(`Thank you for your purchase! Total amount: $${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'success');
        
        // In the future, implement API call to clear cart
        setCartItems([]);
        setTotalPrice(0);
    };

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <i className="fa-solid fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is currently empty</p>
                    <Link to="/main" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img 
                                        src={item.image || 'https://via.placeholder.com/100x100?text=Product'} 
                                        alt={item.name}
                                    />
                                </div>
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">
                                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                    <div className="quantity-control">
                                        <button 
                                            className="quantity-btn minus"
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity || 1}</span>
                                        <button 
                                            className="quantity-btn plus"
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                    aria-label={`Remove ${item.name} from cart`}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <button 
                            className="buy-now-btn"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                        <Link to="/main" className="continue-shopping-btn small">
                            <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;