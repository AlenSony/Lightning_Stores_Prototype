import { useEffect, useState } from 'react';
import Aurora from '../assets/Aurora.jsx';
import NavBar from '../assets/Navbar.jsx';
import '../Stylings/MainPage.css';

function MainPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
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
            image: "/newreleases/newreleases001.jpg",
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
            image: "/newreleases/newreleases002.png",
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
            image: "/newreleases/newreleases003.webp",
            alt: "Nothing Phone-3"
        }
    ];

    // Phone cards data
    const phoneCards = [
        // iPhone models
        {
            name: "iPhone 16",
            price: 799,
            image: "/iphone/iphone-16.webp"
        },
        {
            name: "iPhone 16 Plus",
            price: 899,
            image: "/iphone/iphone-16-plus.webp"
        },
        {
            name: "iPhone 16 Pro",
            price: 999,
            image: "/iphone/iphone-16-pro.jpg"
        },
        {
            name: "iPhone 17",
            price: 899,
            image: "/iphone/iphone-17.webp"
        },
        {
            name: "iPhone 17 Pro",
            price: 1099,
            image: "/iphone/iphone-17-pro.webp"
        },
        {
            name: "iPhone 17 Pro Max",
            price: 1199,
            image: "/iphone/iphone-17-pro-max.webp"
        },
        // Samsung models
        {
            name: "Samsung S25",
            price: 799,
            image: "/samsung/samsung-s25.png"
        },
        {
            name: "Samsung S25 Plus",
            price: 999,
            image: "/samsung/samsung-s25-plus.png"
        },
        {
            name: "Samsung S25 Ultra",
            price: 1199,
            image: "/samsung/samsung-s25-ultra.png"
        },
        {
            name: "Samsung S25 Edge",
            price: 1099,
            image: "/samsung/samsung-s25-edge.jpg"
        },
        {
            name: "Samsung Z Flip 7",
            price: 999,
            image: "/samsung/samsung-z-flip-7.png"
        },
        // Nothing models
        {
            name: "Nothing Phone 3",
            price: 699,
            image: "/nothing/nothing-phone-3.webp"
        },
        {
            name: "Nothing Phone 3 Black",
            price: 699,
            image: "/nothing/nothing-phone-3-black.webp"
        },
        {
            name: "Nothing Phone 3a Pro",
            price: 499,
            image: "/nothing/nothing-phone-3a-pro.jpg"
        },
        // Vivo models
        {
            name: "Vivo X200",
            price: 699,
            image: "/vivo/vivo-x200.webp"
        },
        {
            name: "Vivo X200 Pro",
            price: 899,
            image: "/vivo/vivo-x200-pro.jpg"
        },
        {
            name: "Vivo X200 FE",
            price: 599,
            image: "/vivo/vivo-x200-fe.webp"
        }
    ];

    return (
        <div className="container">
            <Aurora
                colorStops={["#1F75FE", "#FFFFF3", "#1F75FE"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            <NavBar />
            <div className="new-releases-container">
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
                <div className="phone-cards-grid">
                    {phoneCards.map((phone, index) => (
                        <div key={index} className="phone-card">
                            <div className="phone-card-image">
                                <img src={phone.image} alt={phone.name} />
                            </div>
                            <div className="phone-card-info">
                                <h3>{phone.name}</h3>
                                <p className="phone-price">${phone.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainPage;
