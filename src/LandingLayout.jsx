import { Outlet } from "react-router-dom";
import Header from "src/components/header/header";

const LandingLayout = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);

export default LandingLayout;
