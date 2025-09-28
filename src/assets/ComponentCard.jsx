
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../utils/cartUtils.js';

function CardComponent ({name, company, price, description, ram, storage, image}) {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        // Navigate to item page with phone details as params
        navigate('/item', {
            state: {
                name,
                company,
                price,
                description,
                ram,
                storage,
                image
            }
        });
    };
    
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent triggering card click
        
        // Prepare item data
        const itemData = {
            name,
            company,
            price,
            description,
            ram,
            storage,
            image
        };
        
        // Use the utility function to add to cart
        const result = addToCart(itemData);
        
        // Show appropriate message based on result
        alert(result.message);
    };
    
    const handleBuyNow = (e) => {
        e.stopPropagation(); // Prevent triggering card click
        navigate('/item', {
            state: {
                name,
                company,
                price,
                description,
                ram,
                storage,
                image
            }
        });
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
                        <button onClick={handleAddToCart}>Add to Cart</button>
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