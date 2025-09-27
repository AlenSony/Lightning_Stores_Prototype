import Aurora from '../assets/Aurora';
import GlitchText from '../assets/GlitchText';
import ScrambledText from '../assets/ScrambledText';
import { useNavigate } from 'react-router-dom';
import '../Stylings/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/main');
  };
  return (
    <div className="login-page-container">
      {/* Aurora动态背景 */}
      <Aurora 
        colorStops={['#5227FF', '#00C6FF', '#7cff67']} 
        amplitude={1.2} 
        blend={0.6}
      />
      
      <div className="container">
        {/* 标题部分 */}
        <div className="title">
          <GlitchText
            speed={1}
            enableShadows={true}
            enableOnHover={true}
            className='custom-class'
          >
            LIGHTNING STORES
          </GlitchText>
        </div>
        
        {/* 内容部分 */}
        <div className="landing-page-content">
          <ScrambledText
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            radius={200}
          >
            Step into a world where technology meets convenience. At Lightning Stores, we bring you the latest and most reliable electronic gadgets and accessories, all in one place. From high-performance laptops, smartphones, and tablets to smart home devices, wearables, and audio gear, every product is carefully curated to deliver quality, innovation, and value.
          </ScrambledText>
          
          {/* Call to Action Button */}
          <div className="cta-container">
            <button 
              className="cta-button"
              onClick={handleExploreClick}
            >
              Explore Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;