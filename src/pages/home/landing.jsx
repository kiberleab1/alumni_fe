import { Outlet } from "react-router-dom";

import PortfolioComponent from "src/views/custom-components/sections/portfolioComponent";

import img1 from "src/assets/images/portfolio/img1.jpg";
import img2 from "src/assets/images/portfolio/img2.jpg";
import img3 from "src/assets/images/portfolio/img3.jpg";
import img4 from "src/assets/images/portfolio/img4.jpg";
import img5 from "src/assets/images/portfolio/img5.jpg";
import img6 from "src/assets/images/portfolio/img6.jpg";
import TeamComponent from "src/views/custom-components/sections/teamComponent";
import TestimonialComponent from "src/views/custom-components/sections/testimonialComponent";
import FeatureComponent from "src/views/custom-components/sections/featureComponent";
import ContactComponent from "src/views/custom-components/sections/contactComponent";
import C2aComponent from "src/views/custom-components/sections/c2aComponent";
import BannerComponent from "src/views/custom-components/sections/bannerComponent";
function LandingPage() {
  const images = [img1, img2, img3, img4, img5, img6];
  return (
    <>
      {/* <div className="w-full bg-black h-[80vh]">
        <SlideShowComponent images={images} sliderControl={true} />
      </div> */}
      {/* This can be Profile */}
      <BannerComponent />
      <C2aComponent />

      <PortfolioComponent />
      <TeamComponent />
      <TestimonialComponent />
      <FeatureComponent />
      <ContactComponent />
      <Outlet />
    </>
  );
}

export default LandingPage;
