import './assets/scss/style.scss';
import { createBrowserHistory } from 'history';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Components from './views/components/components.jsx';
import CustomComponents from './views/custom-components/custom-components.jsx';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import reportWebVitals from './reportWebVitals';
// const root = ReactDOM.createRoot(document.getElementById('root'));
//
var hist = createBrowserHistory();
const queryClient = new QueryClient();
console.log(import.meta.env.VITE_BASE_URL);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter history={hist}>
        <Routes>
          <Route path="/custom-components" element={<CustomComponents />} />
          <Route path="/" element={<Components />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
reportWebVitals();
export default App;
