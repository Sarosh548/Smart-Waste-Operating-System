import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar    from './components/Sidebar';
import Overview   from './pages/Overview';
import Trucks     from './pages/Trucks';
import Bins       from './pages/Bins';
import Alerts     from './pages/Alerts';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style:{ background:'#1E293B', color:'#F1F5F9', border:'1px solid #334155' }
      }}/>
      <div style={{ display:'flex', minHeight:'100vh' }}>
        <Sidebar />
        <main style={{ flex:1, padding:'32px', overflowY:'auto' }}>
          <Routes>
            <Route path="/"       element={<Overview />} />
            <Route path="/trucks" element={<Trucks />}   />
            <Route path="/bins"   element={<Bins />}     />
            <Route path="/alerts" element={<Alerts />}   />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}