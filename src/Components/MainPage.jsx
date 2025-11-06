import { useEffect, useState } from 'react';
import CardComponent from '../assets/ComponentCard.jsx';
import NavBar from '../assets/Navbar.jsx';
import '../Stylings/MainPage.css';
import LandingPage from './LandingPage.jsx';

function MainPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [devices, setDevices] = useState([]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState('all');
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
                
                
                if (!res.ok) {
                    // Don't redirect to login, just log the error
                    console.error('Failed to fetch products:', res.status);
                    throw new Error('Failed to fetch products');
                }
                
                const data = await res.json();
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

    // Predefined list of major companies
    const predefinedCompanies = [
        'Apple',
        'Samsung',
        'Vivo',
        'iQOO',
        'OnePlus',
        'Xiaomi',
        'Redmi',
        'Realme',
        'Oppo',
        'Nothing',
        'Google',
        'Motorola',
        'Nokia',
        'Sony',
        'Asus',
        'Honor'
    ];

    // Get unique companies from devices and merge with predefined list
    const deviceCompanies = new Set(devices.map(d => d.company).filter(Boolean));
    const allCompanies = ['all', ...predefinedCompanies, ...deviceCompanies].filter((value, index, self) => 
        self.indexOf(value) === index
    ).sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return a.localeCompare(b);
    });

    // Brand-specific keywords mapping for better matching
    const brandKeywords = {
        'apple': ['iphone', 'ipad', 'ipod', 'macbook', 'imac', 'apple'],
        'samsung': ['galaxy', 'samsung', 'note', 's series', 'z fold', 'z flip'],
        'vivo': ['vivo', 'x series', 'y series', 'v series'],
        'iqoo': ['iqoo', 'neo', 'z series'],
        'oneplus': ['oneplus', 'nord'],
        'xiaomi': ['xiaomi', 'mi ', 'redmi note', 'poco'],
        'redmi': ['redmi', 'note'],
        'realme': ['realme', 'gt', 'narzo'],
        'oppo': ['oppo', 'reno', 'find x'],
        'nothing': ['nothing', 'phone'],
        'google': ['pixel', 'google'],
        'motorola': ['motorola', 'moto', 'edge', 'razr'],
        'nokia': ['nokia'],
        'sony': ['sony', 'xperia'],
        'asus': ['asus', 'zenfone', 'rog phone'],
        'honor': ['honor', 'magic', 'view']
    };

    // Helper function to check if device matches company (case-insensitive, checks both company field and device name)
    const deviceMatchesCompany = (device, companyName) => {
        if (!companyName || companyName === 'all') return true;
        
        const companyLower = companyName.toLowerCase();
        const deviceCompany = (device.company || '').toLowerCase();
        const deviceName = (device.name || '').toLowerCase();
        
        // First check exact match in company field
        if (deviceCompany === companyLower || deviceCompany.includes(companyLower)) {
            return true;
        }
        
        // Check if company name appears in device name
        if (deviceName.includes(companyLower)) {
            return true;
        }
        
        // Check brand-specific keywords
        const keywords = brandKeywords[companyLower] || [];
        for (const keyword of keywords) {
            if (deviceName.includes(keyword) || deviceCompany.includes(keyword)) {
                return true;
            }
        }
        
        return false;
    };

    // Filter and sort devices based on selected company
    const filteredDevices = (selectedCompany === 'all' 
        ? devices 
        : devices.filter(d => deviceMatchesCompany(d, selectedCompany))
    ).sort((a, b) => {
        // Sort by company name first (alphabetically)
        const companyA = (a.company || '').toLowerCase();
        const companyB = (b.company || '').toLowerCase();
        
        if (companyA < companyB) return -1;
        if (companyA > companyB) return 1;
        
        // If same company, sort by device name
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

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
                <div className="section-header">
                    <h2 className="section-title">New Releases</h2>
                    {!loadingDevices && devices.length > 0 && (
                        <div className="company-filter">
                            <label htmlFor="company-select" className="filter-label">Filter by Company:</label>
                            <select 
                                id="company-select"
                                className="company-select"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                {allCompanies.map(company => (
                                    <option key={company} value={company}>
                                        {company === 'all' ? 'All Companies' : company}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                {loadingDevices ? (
                    <div style={{ color: 'white', padding: '16px' }}>Loading products...</div>
                ) : (
                    <div className="phone-cards-grid">
                        {filteredDevices.map((d, index) => (
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
                        {filteredDevices.length === 0 && (
                            <div style={{ color: 'white', padding: '16px' }}>
                                {devices.length === 0 
                                    ? 'No products found.' 
                                    : `No products found for ${selectedCompany === 'all' ? 'selected company' : selectedCompany}.`}
                            </div>
                        )}
                    </div>
                )}
            </div>
    </div>
    )
}

export default MainPage;
