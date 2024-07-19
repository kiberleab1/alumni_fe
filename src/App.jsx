import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/scss/style.scss";
import NotFoundComponent from "./components/utils/notFound";
import LandingLayout from "./LandingLayout";
import CreateStaff from "./pages/admin/staff/CreateStaff";
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
import LandingEventsPage from "./pages/home/program/events";
import LandingMembersPage from "./pages/home/program/members";
import LandingProfile from "./pages/home/program/profile";
import LoginPage from "./pages/login";
import RolePage from "./pages/Role";
import SideBar from "./pages/SideBar";
import SignupPage from "./pages/signup";
import UserSideBar from "./pages/UserSideBar";
import reportWebVitals from "./reportWebVitals";
import CustomComponents from "./views/custom-components/custom-components.jsx";

import "./i18n";
import { Suspense } from "react";

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
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="w-full min-w-full ">
            <Routes>
              <Route path="/custom-components" element={<CustomComponents />} />
              <Route path="/roles" element={<RolePage />} />
              <Route path="/admin/*" element={<SideBar />} />
              <Route path="/user/*" element={<UserSideBar />} />
              <Route path="/asd" element={<CreateStaff />} />
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
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
}

reportWebVitals();

export default App;
