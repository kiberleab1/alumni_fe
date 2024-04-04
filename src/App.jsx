import './assets/scss/style.scss';
import { createBrowserHistory } from 'history';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Components from './views/components/components.jsx';
import CustomComponents from './views/custom-components/custom-components.jsx';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import reportWebVitals from './reportWebVitals';
import DeparmentsPage from './pages/Departments.jsx';
import Header from './components/header/header.jsx';
import InstitutionsPage from './pages/Institutions';
// import Signin from './pages/signin';
import SignupPage from './pages/signup';

const hist = createBrowserHistory();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter history={hist}>
        <Header />
        <div className="mt-24">
          <Routes>
            <Route path="/custom-components" element={<CustomComponents />} />
            <Route path="/home" element={<Components />} />
            <Route path="/departments" element={<DeparmentsPage />} />
            <Route path="/institutions" element={<InstitutionsPage />} />
            {/* <Route path="/signin" element={<Signin />} /> */}
            <Route path="/signup" element={<SignupPage />} />
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
