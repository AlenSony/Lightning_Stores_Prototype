import { useEffect, useState } from 'react';
import CardComponent from '../assets/ComponentCard.jsx';
import NavBar from '../assets/Navbar.jsx';
import '../Stylings/MainPage.css';
import LandingPage from './LandingPage.jsx';

function MainPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [devices, setDevices] = useState([]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const totalSlides = 3;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoadingDevices(true);
                const res = await fetch('http://localhost:5000/api/product', {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                console.log('API Response:', res);
                if (!res.ok) {
                    if (res.status === 401) {
                        console.error('Authentication required. Please log in first.');
                        // Redirect to login page if not authenticated
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error('Failed to fetch products');
                }
                
                const data = await res.json();
                console.log('Fetched devices:', data);
                setDevices(data || []);
            } catch (e) {
                console.error('Failed to load devices:', e);
                setDevices([]);
            } finally {
                setLoadingDevices(false);
            }
        };
        
        fetchDevices();
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    const scrollToNewReleases = () => {
        const newReleasesElement = document.getElementById('new-releases-section');
        if (newReleasesElement) {
            newReleasesElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const slides = [
        {
            title: "Iphone 17 Series",
            content: [
                "Ultra-thin iPhone 17 Air",
                "120Hz ProMotion on all models",
                "A19 / A19 Pro chips",
                "48MP rear + 24MP front cameras",
                "Next-gen Wi-Fi 7 connectivity"
            ],
            image: "https://static.toiimg.com/thumb/msid-114421054,width-1280,height-720,resizemode-4/114421054.jpg",
            alt: "iPhone 17"
        },
        {
            title: "Samsung S25 Edge",
            content: [
                "6.7-inch Dynamic AMOLED 2X display, 1-120Hz adaptive refresh rate",
                "200MP main + 12MP ultra-wide rear cameras, 12MP front camera",
                "Slim 5.8mm titanium frame, ~163g weight",
                "3900mAh battery, 25W wired & wireless charging, Wireless PowerShare",
                "Snapdragon 8 Elite (3nm), 12GB RAM, up to 512GB storage",
                "2600 nits peak brightness",
                "Android 15 with One UI 7 and Galaxy AI features"
            ],
            image: "https://cdn.shopify.com/s/files/1/0470/5393/0645/files/Samsung_Galaxy_S25_Edge_vs_S25_and_S25_Ultra_What_Are_the_Differences.jpg?v=1747290978",
            alt: "Samsung S25 Edge"
        },
        {
            title: "Nothing Phone-3",
            content: [
                "6.67-inch AMOLED display, 1.5K (1260 × 2800), 30-120Hz adaptive refresh rate, HDR10+, 4500-nits peak brightness",
                "Snapdragon 8s Gen 4 chipset, up to 16GB RAM, up to 512GB storage",
                "Triple 50MP rear cameras (main w/ OIS, periscope telephoto 3× optical zoom, ultra-wide) + 50MP front camera",
                "5500mAh battery (India) / ~5150mAh global variant, 65W wired charging, 15W wireless, reverse charging",
            ],
            image: "https://i.gadgets360cdn.com/products/large/Nothing-Phone-3-press-1200x675-1751391432.jpg?downsize=*:360",
            alt: "Nothing Phone-3"
        }
    ];

    // Phone cards data
    

    return (
        <div className="container">
            {/* Always show NavBar at the top */}
            <NavBar />
            
            {/* Landing Page Section - First section visible when page loads */}
            <div className="landing-page-container">
                <LandingPage onExploreClick={scrollToNewReleases} />
            </div>
            
            {/* New Releases Section - Can be scrolled to or accessed via Explore button */}
            <div id="new-releases-section" className="new-releases-section">
                {slides.map((slide, index) => (
                    <div key={index} className={`content-container ${currentSlide === index ? 'active' : ''}`}>
                        <div className="content-title">
                            <h2>{slide.title}</h2>
                        </div>
                        <div className="slide-content-wrapper">
                            <div className="text-content-side">
                                <div className="content">
                                    <ul>
                                        {slide.content.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="image-container">
                                <img src={slide.image} alt={slide.alt} />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="slideshow-controls">
                    <div className="dots">
                        {slides.map((_, index) => (
                            <span 
                                key={index} 
                                className={`dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Phone Cards Section */}
            <div className="phone-cards-container">
                <h2 className="section-title">New Releases</h2>
                {loadingDevices ? (
                    <div style={{ color: 'white', padding: '16px' }}>Loading products...</div>
                ) : (
                    <div className="phone-cards-grid">
                        {devices.map((d, index) => (
                            <CardComponent
                                key={d._id || index}
                                _id={d._id}
                                name={d.name}
                                company={d.company}
                                price={Number(d.expected_price)}
                                description={d.description}
                                ram={d.ram}
                                storage={d.storage}
                                image={d.image_url || d.image}
                            />
                        ))}
                        {devices.length === 0 && (
                            <div style={{ color: 'white', padding: '16px' }}>No products found.</div>
                        )}
                    </div>
                )}
            </div>
    </div>
    )
}

export default MainPage;
