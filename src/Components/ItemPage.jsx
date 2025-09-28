import { useLocation } from 'react-router-dom';
import NavBar from '../assets/navbar.jsx';
import '../Stylings/ItemPage.css';
import { addToCart } from '../utils/cartUtils.js';

function ItemPage() {
  const location = useLocation();
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
  
  const handleAddToCart = () => {
    // Prepare item data
    const itemData = {
      name: item.name,
      company: item.company,
      price: item.price,
      description: item.description,
      ram: item.ram,
      storage: item.storage,
      image: item.image
    };
    
    // Use the utility function to add to cart
    const result = addToCart(itemData);
    
    // Show appropriate message based on result
    alert(result.message);
  };
  
  const handleBuyNow = () => {
    alert(`Processing purchase for ${item.name}!`);
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
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
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