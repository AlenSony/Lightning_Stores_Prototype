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
          
          <div className="laptop">
            <div className="screen">
              <div className="header"></div>
              <div className="text">A complete digital space for tech enthusiasts to discover, buy, and sell their devices.</div>
            </div>
            <div className="keyboard"></div>
          </div>


          {/* Call to Action Button */}
          <div className="cta-container">
            <button className="cta" onClick={onExploreClick}>
              <span className="hover-underline-animation"> Shop now </span>
              <svg
                id="arrow-horizontal"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="10"
                viewBox="0 0 46 16"
              >
                <path
                  id="Path_10"
                  data-name="Path 10"
                  d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                  transform="translate(30)"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;