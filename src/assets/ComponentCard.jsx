
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../assets/Toast.jsx';
import { addToCart } from '../utils/cartUtils.js';

function CardComponent ({_id, name, company, price, description, ram, storage, image}) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    
    const handleCardClick = () => {
        // Navigate to item page with phone details as params
        navigate('/item', {
            state: {
                item: {
                    _id,
                    name,
                    company,
                    price,
                    image,
                    description,
                    ram,
                    storage,
                }
            }
        });
    };
    
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent triggering card click
        
        if (isAddingToCart) return;
        
        setIsAddingToCart(true);
        
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please log in to add items to cart', 'error');
                navigate('/login');
                return;
            }
            
            // Prepare item data
            const itemData = {
                _id, // Use the _id parameter directly
                name,
                company,
                price,
                description,
                ram,
                storage,
                image
            };
            
            // Use the utility function to add to cart (now handles backend integration)
            const result = await addToCart(itemData);
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Failed to add item to cart. Please try again.', 'error');
        } finally {
            setIsAddingToCart(false);
        }
    };
    
    const handleBuyNow = async (e) => {
        //e.stopPropagation(); // Prevent triggering card click
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please log in to continue', 'error');
            navigate('/login');
            return;
        }
        
        try {
            // First add to cart
            await handleAddToCart(e);
            // Then navigate to cart/checkout
            navigate('/cart');
        } catch (error) {
            console.error('Error processing purchase:', error);
            showToast('Failed to process purchase. Please try again.', 'error');
        }
    };
    
    return (
        <>
            <div className="component_contrainer" onClick={handleCardClick}>
                <img src={image} alt={name} />
                <div className="component_header">
                    <h2>{name}</h2>
                    <p>{company}</p>
                </div>
                <div className="component_price">
                    <p>${price}</p>
                </div>
                <div className="component_description">
                    <p>{description}</p>
                </div>
                <div className="component_specs">
                    <p>RAM: {ram}</p>
                    <p>Storage: {storage}</p>
                </div>
                <div className="component_buttons">
                    <div className="component_add-to-cart-button">
                        <button 
                            onClick={handleAddToCart} 
                            data-product-id={_id} 
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                    <div className="component_buy-button">
                        <button onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardComponent;