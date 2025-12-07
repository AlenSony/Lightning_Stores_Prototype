import GlitchText from '../assets/GlitchText.jsx';
import ScrambledText from '../assets/ScrambledText.jsx';

import '../Stylings/LandingPage.css';

function LandingPage({ onExploreClick }) {
  return (
    <>
      {/* Aurora动态背景 */}
      <div className="landing-hero-card">
        <div className="landing-content-wrapper">
        {/* 标题部分 */}
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              NOVARA 
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
            Novara is where innovation meets elegance. A modern tech store crafted for those who appreciate both performance and aesthetics, Novara curates cutting-edge gadgets, smart devices, and digital essentials with a minimalist, futuristic touch. Every product reflects precision, quality, and forward-thinking design—because technology should not only function brilliantly, but feel inspiring to use.
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