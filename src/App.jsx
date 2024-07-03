import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/scss/style.scss";
import reportWebVitals from "./reportWebVitals";
import Components from "./views/components/components.jsx";
import CustomComponents from "./views/custom-components/custom-components.jsx";
// import Header from './components/header/header.jsx';
import Navbar from "./components/header/header";

import ComposeEmail from "./pages/admin/emails/compose";
// import Signin from './pages/signin';
import Alumni_profile from "./pages/alumni_profile";
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
            <Route path="/roles" element={<RolePage />} />
            <Route path="/admin" element={<SideBar />} />
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
