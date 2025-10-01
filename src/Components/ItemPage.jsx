import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../assets/navbar.jsx';
import { useToast } from '../assets/Toast.jsx';
import '../Stylings/ItemPage.css';
import { addToCart } from '../utils/cartUtils.js';

function ItemPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Get item details from location state
  const { state } = location;
  
  // Default values in case state is not provided
  const item = state?.item || {
    _id: state?.item?.id || 'default-id', // Ensure _id is always present
    name: "Product Name",
    company: "Company",
    price: 0,
    description: "Product description",
    ram: "RAM",
    storage: "Storage",
    image: "/placeholder.jpg"
  };
  
  const handleAddToCart = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (isAddingToCart) return;
    setIsAddingToCart(true);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please log in to add items to cart', 'error');
            navigate('/login');
            return;
        }

        // Use spread to safely pass all item fields
        const itemData = { ...item }; 

        const result = await addToCart(itemData);
        showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart. Please try again.', 'error');
    } finally {
        setIsAddingToCart(false);
    }
};

  
  const handleBuyNow = async () => {
    // First add to cart, then navigate to checkout
    try {
      await handleAddToCart();
      navigate('/cart'); // Navigate to cart/checkout page
    } catch (error) {
      console.error('Error processing purchase:', error);
      showToast('Failed to process purchase. Please try again.', 'error');
    }
  };

  return (
    <>
      <div className="container">
        <NavBar />
        
        <div className="item-page-container">
          <div className="item-content">
            <div className="item-image-section">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="item-details-section">
              <div className="item-header">
                <h1>{item.name}</h1>
                <p className="item-company">{item.company}</p>
              </div>
              
              <div className="item-price">
                <h2>${item.price}</h2>
              </div>
              
              <div className="item-description">
                <p>{item.description}</p>
              </div>
              
              <div className="item-specs">
                <h3>Specifications</h3>
                <ul>
                  <li><strong>RAM:</strong> {item.ram}</li>
                  <li><strong>Storage:</strong> {item.storage}</li>
                  {/* Add more specifications as needed */}
                </ul>
              </div>
              
              <div className="item-actions">
                <button 
                  className="add-to-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  className="buy-now-btn" 
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemPage