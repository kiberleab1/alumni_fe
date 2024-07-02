import "./assets/scss/style.scss";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Components from "./views/components/components.jsx";
import CustomComponents from "./views/custom-components/custom-components.jsx";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import reportWebVitals from "./reportWebVitals";
import DeparmentsPage from "./pages/Departments.jsx";
// import Header from './components/header/header.jsx';
import Navbar from "./components/header/header";

import InstitutionsPage from "./pages/Institutions";
import ComposeEmail from "./pages/emails/compose";
// import Signin from './pages/signin';
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import RolePage from "./pages/Role";
import LandingPage from "./pages/home/landing";
import SideBar from "./pages/SideBar";
import Alumni_profile from "./pages/alumni_profile";
import AboutUsPage from "./pages/home/aboutus/aboutPage";
import ContactUsPage from "./pages/home/aboutus/contactUsPage";
import NewsPage from "./pages/home/aboutus/newsPage";
import DirectoryPage from "./pages/home/aboutus/directoryPage";
import GalleryPage from "./pages/home/aboutus/galleryPage";
import CareerPage from "./pages/home/career/careerPage";
import ApplyForJobsPage from "./pages/home/career/applyForJobs";
import ContentPage from "./pages/content/contentPage";

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
  const navbarPaths = ["/landing"];
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <Header /> */}
        {/* <Navbar /> */}
        {navbarPaths.includes(window.location.pathname) && <Navbar />}

        <div className="w-full min-w-full ">
          <Routes>
            <Route path="/custom-components" element={<CustomComponents />} />
            <Route path="/home" element={<Components />} />
            <Route path="/departments" element={<DeparmentsPage />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/admin" element={<SideBar />} />
            <Route path="/institutions" element={<InstitutionsPage />} />
            <Route path="/admin/email/compose" element={<ComposeEmail />} />
            {/* <Route path="/signin" element={<Signin />} /> */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/alumni_profile" element={<Alumni_profile />} />
            <Route path="/landing">
              <Route path="content" element={<ContentPage />} />
              <Route index element={<LandingPage />} />
              <Route path="aboutus">
                <Route index element={<AboutUsPage />} />
                <Route path="contact" element={<ContactUsPage />} />
                <Route path="directory" element={<DirectoryPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="news" element={<NewsPage />} />
              </Route>
              <Route path="career">
                <Route index element={<CareerPage />} />
                <Route path="apply" element={<ApplyForJobsPage />} />
              </Route>
            </Route>
          </Routes>
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
