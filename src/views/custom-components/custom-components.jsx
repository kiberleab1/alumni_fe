import PropTypes from "prop-types";

// core components
import HeaderBanner2 from "../../components/banner2/banner2.jsx";
import Footer from "../../components/footer/footer.jsx";

// sections for this page
import BannerComponent from "./sections/bannerComponent.jsx";
import FeatureComponent from "./sections/featureComponent.jsx";
import FormBannerComponent from "./sections/formBannerComponent.jsx";
import HeaderComponent from "./sections/headerComponent.jsx";
import PortfolioComponent from "./sections/portfolioComponent.jsx";
import PricingComponent from "./sections/pricingComponent.jsx";
import TeamComponent from "./sections/teamComponent.jsx";
import TestimonialComponent from "./sections/testimonialComponent.jsx";
// import ConentCatalogCompnent from "./sections/conentCatalogComponent.jsx";
import ComingSoonComponent from "../../components/call-to-action/ComingSoonComponent.jsx";
import C2aComponent from "./sections/footer.jsx";
import ContactComponent from "./sections/contactComponent.jsx";

const CustomComponents = () => {
  return (
    <div id="main-wrapper">
      {/* <Header /> */}
      <div className="page-wrapper">
        <div className="container-fluid">
          <HeaderBanner2 />
          <HeaderComponent />
          <BannerComponent />
          <FormBannerComponent />
          <FeatureComponent />
          <PortfolioComponent />
          <PricingComponent />
          <TeamComponent />
          <TestimonialComponent />
          {/* <ConentCatalogCompnent /> */}
          <C2aComponent />
          <ContactComponent />
          <ComingSoonComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

CustomComponents.propTypes = {
  classes: PropTypes.object,
};

export default CustomComponents;
