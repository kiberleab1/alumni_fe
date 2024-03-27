import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';

import Home from './pages/Home';

const queryClient = new QueryClient();
console.log(import.meta.env.VITE_BASE_URL);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

export default App;
