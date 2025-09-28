import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = location.state?.query || '';
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching products based on search query
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // In a real app, this would be an API call
                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Mock phone data based on search query
                const mockPhones = [
                    {
                        id: 1,
                        name: `${searchQuery} Pro Max`,
                        company: 'TechBrand',
                        price: 1099.99,
                        image: 'https://via.placeholder.com/300x200?text=Smartphone+Pro+Max',
                        description: 'Latest flagship smartphone with stunning display and powerful processor.'
                    },
                    {
                        id: 2,
                        name: `${searchQuery} Lite`,
                        company: 'TechBrand',
                        price: 599.99,
                        image: 'https://via.placeholder.com/300x200?text=Smartphone+Lite',
                        description: 'Affordable smartphone with great camera and long battery life.'
                    },
                    {
                        id: 3,
                        name: `${searchQuery} Ultra`,
                        company: 'GadgetCo',
                        price: 1299.99,
                        image: 'https://via.placeholder.com/300x200?text=Smartphone+Ultra',
                        description: 'Premium smartphone with cutting-edge technology and design.'
                    },
                    {
                        id: 4,
                        name: `${searchQuery} Mini`,
                        company: 'GadgetCo',
                        price: 799.99,
                        image: 'https://via.placeholder.com/300x200?text=Smartphone+Mini',
                        description: 'Compact smartphone with all the flagship features in a smaller package.'
                    }
                ];
                
                setSearchResults(mockPhones);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    const handleAddToCart = (product) => {
        // Get existing cart items from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = [...existingCart, product];
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Show notification (in a real app, you would use a notification system)
        alert(`${product.name} added to cart!`);
    };

    const handlePhoneClick = (phoneId) => {
        navigate(`/item?id=${phoneId}`);
    };

    return (
        <div className="search-page">
            <h1>Search Results for: "{searchQuery}"</h1>
            
            {loading ? (
                <div className="loading">Loading results...</div>
            ) : (
                <div className="search-results-grid">
                    {searchResults.map((phone) => (
                        <div key={phone.id} className="phone-card">
                            <div 
                                className="phone-image-container" 
                                onClick={() => handlePhoneClick(phone.id)}
                            >
                                <img src={phone.image} alt={phone.name} />
                            </div>
                            <div className="phone-info">
                                <h3 onClick={() => handlePhoneClick(phone.id)}>{phone.name}</h3>
                                <p className="phone-company">{phone.company}</p>
                                <p className="phone-price">${phone.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                <p className="phone-description">{phone.description}</p>
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(phone)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;