import PropTypes from "prop-types";

// core components
import Header from "../../components/header/header.jsx";
import HeaderBanner2 from "../../components/banner2/banner2.jsx";
import Footer from "../../components/footer/footer.jsx";

// sections for this page
import HeaderComponent from "./sections/headerComponent.jsx";
import BannerComponent from "./sections/bannerComponent.jsx";
import FormBannerComponent from "./sections/formBannerComponent.jsx";
import FeatureComponent from "./sections/featureComponent.jsx";
import PortfolioComponent from "./sections/portfolioComponent.jsx";
import PricingComponent from "./sections/pricingComponent.jsx";
import TeamComponent from "./sections/teamComponent.jsx";
import TestimonialComponent from "./sections/testimonialComponent.jsx";
// import ConentCatalogCompnent from "./sections/conentCatalogComponent.jsx";
import C2aComponent from "./sections/c2aComponent.jsx";
import ContactComponent from "./sections/contactComponent.jsx";
import ComingSoonComponent from "../../components/call-to-action/ComingSoonComponent.jsx";

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
