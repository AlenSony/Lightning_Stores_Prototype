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
  const item = state || {
    name: "Product Name",
    company: "Company",
    price: 0,
    description: "Product description",
    ram: "RAM",
    storage: "Storage",
    image: "/placeholder.jpg"
  };
  
  const handleAddToCart = async () => {
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
        _id: item._id, // Include the product ID
        name: item.name,
        company: item.company,
        price: item.price,
        description: item.description,
        ram: item.ram,
        storage: item.storage,
        image: item.image,
      };
      
      // Use the utility function to add to cart (now async)
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
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in to continue', 'error');
      navigate('/login');
      return;
    }
    
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
              <img src={item.image_url} alt={item.name} />
            </div>
            
            <div className="item-details-section">
              <div className="item-header">
                <h1>{item.name}</h1>
                <p className="item-company">{item.company}</p>
              </div>
              
              <div className="item-price">
                <h2>${item.expected_price}</h2>
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