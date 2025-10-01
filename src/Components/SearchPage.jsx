import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../assets/Toast.jsx';
import "../Stylings/SearchPage.css";
import { addToCart } from '../utils/cartUtils.js';

function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const searchQuery = location.state?.query || '';
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products based on search query
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Get token if available, but don't redirect if missing
                const token = localStorage.getItem('token');
                
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                // Only add Authorization header if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const res = await fetch(`http://localhost:5000/api/product/search?query=${searchQuery}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers
                });
                
                if (!res.ok) {
                    if (res.status === 401) {
                        console.error('Authentication required. Please log in first.');
                        return;
                    }
                    throw new Error('Failed to fetch products');
                }
                
                const products = await res.json();
                console.log('Fetched products:', products);
                
                // Filter results client-side as well if search query exists
                let filteredResults = products || [];
                if (searchQuery && Array.isArray(filteredResults)) {
                    const query = searchQuery.toLowerCase();
                    filteredResults = filteredResults.filter(product => 
                        product.name?.toLowerCase().includes(query) || 
                        product.description?.toLowerCase().includes(query) ||
                        product.company?.toLowerCase().includes(query)
                    );
                }
                
                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, navigate]);

    const handleAddToCart = async (product) => {
        try {
            // Use the API-based addToCart function
            const result = await addToCart(product);
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Failed to add item to cart', 'error');
        }
    };

    const handlePhoneClick = (phone) => {
        navigate('/item', { state: phone });
    };

    return (
        <div className="search-page">
            <h1>Search Results for: "{searchQuery}"</h1>
            
            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading results...</p>
                </div>
            ) : searchResults.length === 0 ? (
                <div className="no-results">
                    <h2>No products found</h2>
                    <p>Try a different search term or browse our catalog</p>
                    <button className="browse-btn" onClick={() => navigate('/main')}>
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="search-results-container">
                    <div className="results-count">
                        Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    <div className="search-results-grid">
                        {searchResults.map((phone) => (
                            <div key={phone._id} className="phone-card">
                                <div 
                                    className="phone-image-container" 
                                    onClick={() => handlePhoneClick(phone)}
                                >
                                    {phone.image_url ? (
                                        <img src={phone.image_url} alt={phone.name} />
                                    ) : (
                                        <div className="no-image">No Image Available</div>
                                    )}
                                    {phone.inStock === false && (
                                        <div className="out-of-stock-badge">Out of Stock</div>
                                    )}
                                </div>
                                <div className="phone-info">
                                    <h3 onClick={() => handlePhoneClick(phone)}>{phone.name}</h3>
                                    <p className="phone-company">{phone.company}</p>
                                    <p className="phone-price">${phone.expected_price ? phone.expected_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}</p>
                                    <p className="phone-description">{phone.description}</p>
                                    <button 
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(phone)}
                                        disabled={phone.inStock === false}
                                    >
                                        {phone.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchPage;