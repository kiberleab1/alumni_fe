import PropTypes from "prop-types";

// core components
import HeaderBanner from "../../components/banner/banner.jsx";
import Footer from "../../components/footer/footer.jsx";

// sections for this page
import ComingSoonComponent from "../../components/call-to-action/ComingSoonComponent.jsx";
import Breadcrumbs from "./sections/breadcrumbs.jsx";
import Buttons from "./sections/buttons.jsx";
import Cards from "./sections/cards.jsx";
import Dropdowns from "./sections/dropdowns.jsx";
import PageForm from "./sections/form.jsx";
import Images from "./sections/images.jsx";
import JsComponents from "./sections/js-components.jsx";
import Labels from "./sections/labels.jsx";
import Notification from "./sections/notification.jsx";
import PagePagination from "./sections/pagination.jsx";
import PageTable from "./sections/table.jsx";
import TooltipPopover from "./sections/tooltip-popover.jsx";
import Typography from "./sections/typography.jsx";

const Components = () => {
  return (
    <div id="main-wrapper">
      {/* <Header /> */}
      <div className="page-wrapper">
        <div className="container-fluid">
          <HeaderBanner />
          <Buttons />
          <Labels />
          <PagePagination />
          <Images />
          <Breadcrumbs />
          <Cards />
          <Dropdowns />
          <PageForm />
          <PageTable />
          <Notification />
          <TooltipPopover />
          <Typography />
          <JsComponents />
          <ComingSoonComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

Components.propTypes = {
  classes: PropTypes.object,
};

export default Components;
