import GlitchText from '../assets/GlitchText.jsx';

import '../Stylings/LandingPage.css';

function LandingPage({ onExploreClick }) {
  return (
    <>
      <div className="landing-hero-card">
        <div className="landing-content-wrapper">
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              N
            </GlitchText>
          </div>
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              O
            </GlitchText>
          </div>
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              V
            </GlitchText>
          </div>
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              A
            </GlitchText>
          </div>
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              R
            </GlitchText>
          </div>
          <div className="title">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={true}
              className='custom-class'
            >
              A
            </GlitchText>

          </div>

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
    </>
  );
}

export default LandingPage;