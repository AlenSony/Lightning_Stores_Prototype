import GlitchText from '../assets/GlitchText.jsx';
import ScrambledText from '../assets/ScrambledText.jsx';

import '../Stylings/LandingPage.css';

function LandingPage({ onExploreClick }) {
  return (
    <>
      {/* Aurora动态背景 */}
      <div className="landing-page-container">
        <div className="container">
        {/* 标题部分 */}
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              LIGHTNING
            </GlitchText>
          </div>
        
        {/* 内容部分 */}
        <div className="landing-page-content">
          <ScrambledText
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            radius={100}
          >
            Step into a world where technology meets convenience. At LIGHTNING, we bring you the latest and most reliable electronic gadgets and accessories, all in one place. From high-performance laptops, smartphones, and tablets to smart home devices, wearables, and audio gear, every product is carefully curated to deliver quality, innovation, and value.
          </ScrambledText>
          
          {/* Call to Action Button */}
          <div className="cta-container">
            <button 
              className="cta-button"
              onClick={onExploreClick}
            >
              Explore Store
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default LandingPage;