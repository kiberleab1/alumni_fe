import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/scss/style.scss";
import reportWebVitals from "./reportWebVitals";
import Components from "./views/components/components.jsx";
import CustomComponents from "./views/custom-components/custom-components.jsx";
// import Header from './components/header/header.jsx';

import ComposeEmail from "./pages/admin/emails/compose";
// import Signin from './pages/signin';
import LandingLayout from "./LandingLayout";
import CreateStaff from "./pages/admin/staff/CreateStaff";
import Alumni_profile from "./pages/alumni_profile";
import Directory from "./pages/directory";
import AboutUsPage from "./pages/home/aboutus/aboutPage";
import ContactUsPage from "./pages/home/aboutus/contactUsPage";
import DirectoryPage from "./pages/home/aboutus/directoryPage";
import GalleryPage from "./pages/home/aboutus/galleryPage";
import NewsPage from "./pages/home/aboutus/newsPage";
import ApplyForJobsPage from "./pages/home/career/applyForJobs";
import CareerPage from "./pages/home/career/careerPage";
import ContentPage from "./pages/home/content/contentPage";
import LandingPage from "./pages/home/landing";
import LoginPage from "./pages/login";
import RolePage from "./pages/Role";
import SideBar from "./pages/SideBar";
import SignupPage from "./pages/signup";
import UserSideBar from "./pages/UserSideBar";
import LandingEventsPage from "./pages/home/program/events";
import LandingProfile from "./pages/home/program/profile";
import LandingMembersPage from "./pages/home/program/members";
import { Navigate } from "react-router-dom";
import NotFoundComponent from "./components/utils/notFound";
import { useLocation } from "react-router-dom";
import Footer from "./views/custom-components/sections/footer";
import { useState } from "react";
import AlumniPodcast from "./pages/home/podcast/AlumniPodcast";
// const hist = createBrowserHistory();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour in ms
      cacheTime: 1000 * 60 * 60, // 1 hour in ms
      refetchOnWindowFocus: false, // Disables automatic refetching when browser window is focused.
    },
  },
});

function App() {
  const [url, seturl] = useState(false);
  const activeUrl = window.location.pathname;

  console.log(window.location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* {!shouldHideHeader && <Header />} */}

        {/* <Header /> */}
        {/* <Navbar /> */}
        {/* {navbarPaths.includes(window.location.pathname) && <Navbar />} */}

        <div className="w-full min-w-full ">
          <Routes>
            <Route path="/custom-components" element={<CustomComponents />} />
            <Route path="/home" element={<Components />} />
            <Route path="/roles" element={<RolePage />} />

            <Route path="/admin/email/compose" element={<ComposeEmail />} />
            <Route path="/admin/*" element={<SideBar />} />
            <Route path="/user/*" element={<UserSideBar />} />
            {/* <Route path="/signin" element={<Signin />} /> */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/alumni_profile" element={<Alumni_profile />} />
            <Route path="/asd" element={<CreateStaff />} />
            <Route path="/sdsds" element={<Directory />} />
            <Route path="/landing" element={<LandingLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="aboutus">
                <Route index element={<AboutUsPage />} />
                <Route path="contact" element={<ContactUsPage />} />
                <Route path="directory" element={<DirectoryPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="news" element={<NewsPage />} />
              </Route>
              <Route path="events">
                <Route index element={<LandingEventsPage />} />
                <Route path="news" element={<NewsPage />} />
              </Route>
              <Route path="program">
                <Route index element={<LandingEventsPage />} />
                <Route path="profile" element={<Alumni_profile />} />
                <Route path="members" element={<LandingMembersPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<SignupPage />} />
              </Route>
              <Route path="alumni">
                <Route index element={<LandingProfile />} />
                <Route path="podcast" element={<AlumniPodcast />} />
              </Route>
              <Route path="career">
                <Route index element={<CareerPage />} />
                <Route path="apply" element={<ApplyForJobsPage />} />
              </Route>
              <Route path="*" element={<NotFoundComponent />} />
            </Route>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
          {activeUrl != "/user" && <Footer />}
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

reportWebVitals();

export default App;
// name: joi.string().required(),
// description: joi.string().required(),
// address_id: joi.string().required(),
// starting_year: joi.date().required(),
// contact_info: joi.string()

// userId: {
//   type: Sequelize.STRING,
//   allowNull: false
// },
// status: {
//   type: Sequelize.STRING,
//   allowNull: true
// },
// title: {
//   type: Sequelize.STRING,
//   allowNull: true
// },
// description: {
//   type: Sequelize.STRING,
//   allowNull: true
// },
// component: {
//   type: Sequelize.STRING,
//   allowNull: true
// },
// image: {
//   type: Sequelize.STRING,
//   allowNull: true
// }
// });
