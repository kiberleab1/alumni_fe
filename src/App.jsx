import './assets/scss/style.scss';
import { createBrowserHistory } from 'history';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Components from './views/components/components.jsx';
import CustomComponents from './views/custom-components/custom-components.jsx';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import reportWebVitals from './reportWebVitals';
import DeparmentsPage from './pages/Departments.jsx';
// import Header from './components/header/header.jsx';
import Navbar from './components/header/header';

import InstitutionsPage from './pages/Institutions';
// import Signin from './pages/signin';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import RolePage from './pages/Role';
import LandingPage from './pages/Landing';
import SideBar from './pages/SideBar';

const hist = createBrowserHistory();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter history={hist}>
        {/* <Header /> */}
        <Navbar />
        
        <div className="w-full min-w-full ">
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/custom-components" element={<CustomComponents />} />
            <Route path="/home" element={<Components />} />
            <Route path="/departments" element={<DeparmentsPage />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/admin" element={<SideBar />} />
            <Route path="/institutions" element={<InstitutionsPage />} />
            {/* <Route path="/signin" element={<Signin />} /> */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
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
