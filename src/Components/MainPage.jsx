import { useEffect, useState } from 'react';
import CardComponent from '../assets/ComponentCard.jsx';
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
            company: "Apple",
            price: 799,
            description: "6.1-inch Super Retina XDR display with ProMotion, A18 chip, 48MP camera system",
            ram: "6GB",
            storage: "128GB",
            image: "/iphone/iphone-16.webp"
        },
        {
            name: "iPhone 16 Plus",
            company: "Apple",
            price: 899,
            description: "6.7-inch Super Retina XDR display with ProMotion, A18 chip, 48MP camera system",
            ram: "6GB",
            storage: "128GB",
            image: "/iphone/iphone-16-plus.webp"
        },
        {
            name: "iPhone 16 Pro",
            company: "Apple",
            price: 999,
            description: "6.1-inch Super Retina XDR display with ProMotion, A18 Pro chip, 48MP Pro camera system",
            ram: "8GB",
            storage: "256GB",
            image: "/iphone/iphone-16-pro.jpg"
        },
        {
            name: "iPhone 17",
            company: "Apple",
            price: 899,
            description: "6.1-inch Super Retina XDR display with ProMotion, A19 chip, 48MP camera system",
            ram: "6GB",
            storage: "128GB",
            image: "/iphone/iphone-17.webp"
        },
        {
            name: "iPhone 17 Pro",
            company: "Apple",
            price: 1099,
            description: "6.1-inch Super Retina XDR display with ProMotion, A19 Pro chip, 48MP Pro camera system",
            ram: "8GB",
            storage: "256GB",
            image: "/iphone/iphone-17-pro.webp"
        },
        {
            name: "iPhone 17 Pro Max",
            company: "Apple",
            price: 1199,
            description: "6.7-inch Super Retina XDR display with ProMotion, A19 Pro chip, 48MP Pro camera system",
            ram: "8GB",
            storage: "256GB",
            image: "/iphone/iphone-17-pro-max.webp"
        },
        // Samsung models
        {
            name: "Samsung S25",
            company: "Samsung",
            price: 799,
            description: "6.4-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite, 200MP camera",
            ram: "8GB",
            storage: "256GB",
            image: "/samsung/samsung-s25.png"
        },
        {
            name: "Samsung S25 Plus",
            company: "Samsung",
            price: 999,
            description: "6.6-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite, 200MP camera",
            ram: "12GB",
            storage: "256GB",
            image: "/samsung/samsung-s25-plus.png"
        },
        {
            name: "Samsung S25 Ultra",
            company: "Samsung",
            price: 1199,
            description: "6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite, 200MP camera system",
            ram: "16GB",
            storage: "512GB",
            image: "/samsung/samsung-s25-ultra.png"
        },
        {
            name: "Samsung S25 Edge",
            company: "Samsung",
            price: 1099,
            description: "6.7-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite, curved edge design",
            ram: "12GB",
            storage: "256GB",
            image: "/samsung/samsung_s25_edge.png",
        },
        {
            name: "Samsung Z Flip 7",
            company: "Samsung",
            price: 999,
            description: "Foldable dynamic AMOLED display, Snapdragon 8 Elite, 12MP dual camera",
            ram: "12GB",
            storage: "256GB",
            image: "/samsung/samsung-z-flip-7.png"
        },
        // Nothing models
        {
            name: "Nothing Phone 3",
            company: "Nothing",
            price: 699,
            description: "6.67-inch AMOLED display, Snapdragon 8s Gen 4, 50MP triple camera",
            ram: "12GB",
            storage: "256GB",
            image: "/nothing/nothing-phone-3.webp"
        },
        {
            name: "Nothing Phone 3 Black",
            company: "Nothing",
            price: 699,
            description: "6.67-inch AMOLED display, Snapdragon 8s Gen 4, 50MP triple camera",
            ram: "12GB",
            storage: "256GB",
            image: "/nothing/nothing-phone-3-black.webp"
        },
        {
            name: "Nothing Phone 3a Pro",
            company: "Nothing",
            price: 499,
            description: "Mid-range smartphone with AMOLED display, 50MP camera system",
            ram: "8GB",
            storage: "128GB",
            image: "/nothing/nothing-phone-3a-pro.jpg"
        },
        // Vivo models
        {
            name: "Vivo X200",
            company: "Vivo",
            price: 699,
            description: "6.78-inch AMOLED display, Dimensity 9300 chipset, 50MP camera system",
            ram: "12GB",
            storage: "256GB",
            image: "/vivo/vivo-x200.webp"
        },
        {
            name: "Vivo X200 Pro",
            company: "Vivo",
            price: 899,
            description: "6.78-inch AMOLED display, Dimensity 9300+ chipset, 64MP camera system",
            ram: "16GB",
            storage: "512GB",
            image: "/vivo/vivo-x200-pro.jpg"
        },
        {
            name: "Vivo X200 FE",
            company: "Vivo",
            price: 599,
            description: "Fan edition with AMOLED display, Dimensity 8300 chipset",
            ram: "8GB",
            storage: "128GB",
            image: "/vivo/vivo-x200-fe.webp"
        }
    ];

    return (
        <div className="container">
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
                        <CardComponent
                            key={index}
                            name={phone.name}
                            company={phone.company}
                            price={phone.price}
                            description={phone.description}
                            ram={phone.ram}
                            storage={phone.storage}
                            image={phone.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainPage;
