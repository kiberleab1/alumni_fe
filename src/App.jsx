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
import CreateStaff from "./pages/admin/staff/CreateStaff";
import Alumni_profile from "./pages/alumni_profile";
import Directory from "./pages/directory";
import LandingPage from "./pages/home/landing";
import PublicLayout from "./pages/public/PublicLayout";
import { EventDetailPage, EventsPage } from "./pages/public/EventsPages";
import { ArticlePage, JobDetailPage, JobsPage, NewsPage } from "./pages/public/NewsJobsPages";
import { AboutPage, ContactPage, GalleryPage, PodcastsPage, StoriesPage } from "./pages/public/InfoPages";
import { LegacyContentRedirect, PublicNotFound } from "./pages/public/misc";
import LoginPage from "./pages/login";
import RolePage from "./pages/Role";
import SideBar from "./pages/SideBar";
import SignupPage from "./pages/auth/SignupPage";
import UserSideBar from "./pages/UserSideBar";
import { Navigate } from "react-router-dom";
import NotFoundComponent from "./components/utils/notFound";
import Footer from "./views/custom-components/sections/footer";
import { AcceptInvitePage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from "./pages/auth/AuthPages";
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
const user = localStorage.getItem("userData");
function App() {
  const activeUrl = window.location.pathname.trim().toLowerCase();
  const pathsToDisableFooter = ["/landing", "/user", "/login", "/register", "/admin", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/accept-invite"];

  // "/" redirects to the public site, which has its own footer
  const activeUrlPath = activeUrl === "/" || pathsToDisableFooter.some((path) => activeUrl.includes(path));


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
            <Route
              path="/user/*"
              element={user ? <UserSideBar /> : <LoginPage />}
            />
            {/* <Route path="/signin" element={<Signin />} /> */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/alumni_profile" element={<Alumni_profile />} />
            <Route path="/asd" element={<CreateStaff />} />
            <Route path="/sdsds" element={<Directory />} />
            {/* public website: visitors can browse before signing in */}
            <Route path="/landing" element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:id" element={<ArticlePage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/:id" element={<JobDetailPage />} />
              <Route path="stories" element={<StoriesPage />} />
              <Route path="podcasts" element={<PodcastsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contact" element={<ContactPage />} />
              {/* old addresses (menus, emails, bookmarks) */}
              <Route path="content" element={<LegacyContentRedirect />} />
              <Route path="aboutus" element={<Navigate to="/landing/about" replace />} />
              <Route path="aboutus/contact" element={<Navigate to="/landing/contact" replace />} />
              <Route path="aboutus/directory" element={<Navigate to="/landing/about" replace />} />
              <Route path="aboutus/gallery" element={<Navigate to="/landing/gallery" replace />} />
              <Route path="aboutus/news" element={<Navigate to="/landing/news" replace />} />
              <Route path="events/news" element={<Navigate to="/landing/news" replace />} />
              <Route path="program" element={<Navigate to="/landing/events" replace />} />
              <Route path="program/members" element={<Navigate to="/landing/about" replace />} />
              <Route path="program/profile" element={<Navigate to="/landing/about" replace />} />
              <Route path="program/login" element={<Navigate to="/login" replace />} />
              <Route path="program/register" element={<Navigate to="/signup" replace />} />
              <Route path="alumni" element={<Navigate to="/landing/stories" replace />} />
              <Route path="alumni/podcast" element={<Navigate to="/landing/podcasts" replace />} />
              <Route path="career" element={<Navigate to="/landing/jobs" replace />} />
              <Route path="career/apply" element={<Navigate to="/landing/jobs" replace />} />
              <Route path="*" element={<PublicNotFound />} />
            </Route>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
          {!activeUrlPath && <Footer />}
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
