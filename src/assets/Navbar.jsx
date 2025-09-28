import './Navbar.css';

import { useState, useEffect } from 'react';
import { getCart } from '../utils/cartUtils.js';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItems, setCartItems] = useState(0);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' }); // 'success' or 'info'
    const [cartButtonAnimation, setCartButtonAnimation] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    // Initialize cart from localStorage on component mount
    useEffect(() => {
        try {
            const cart = getCart();
            setCart(cart);
            setCartItems(cart.length);
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Updated search functionality - navigate to search results page
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/search', { state: { query: searchQuery } });
        }
    };

    // Add item to cart
    const handleAddToCart = (product) => {
        const updatedCart = [...cart, product];
        setCart(updatedCart);
        setCartItems(updatedCart.length);
        
        // Store cart in localStorage for persistence
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        showNotification(`${product.name} has been added to your cart!`, 'success');
        
        // Trigger cart button animation
        setCartButtonAnimation(true);
        setTimeout(() => {
          setCartButtonAnimation(false);
        }, 1000); // Match animation duration
    };

    // Handle cart button click - navigate to cart page
    const handleCartClick = () => {
        navigate('/cart');
    };
    
    // Show aesthetic notification
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return(
        <div className="navbar">
            <img src="/logo.svg" alt="Logo" />
            <div className="search-bar">
                <div className="search-container">
                    <form onSubmit={handleSearch}>
                        <input 
                            name="product_search" 
                            type="text" 
                            placeholder="Search for products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                    
                </div>
                <button onClick={handleCartClick} className={`cart-button ${cartButtonAnimation ? 'add-animation' : ''}`}>
                    <i className="fa-solid fa-cart-shopping"></i>
                    {cartItems > 0 && <span className="cart-badge">{cartItems}</span>}
                </button>
                <Link to="/profile" className='user-account-link'>
                    <button className='user-account'><i className="fa-solid fa-user"></i></button>
                </Link>
            </div>
        </div>
        
        
    )
}

export default NavBar;