import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import RouteView  from './pages/RouteView';
import BinDetail  from './pages/BinDetail';
import Completed  from './pages/Completed';
import NavBar     from './components/NavBar';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background:'#1E293B', color:'#F1F5F9', border:'1px solid #334155' }
      }}/>
      <Routes>
        <Route path="/"        element={<Dashboard />} />
        <Route path="/route"   element={<RouteView />} />
        <Route path="/bin/:id" element={<BinDetail />} />
        <Route path="/done"    element={<Completed />} />
      </Routes>
      <NavBar />
    </BrowserRouter>
  );
}