import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Home from './pages/Home';
import Certify from './pages/Certify';
import Verify from './pages/Verify';
import MyCertificates from './pages/MyCertificates';
import CertificateDetail from './pages/CertificateDetail';
import Explorer from './pages/Explorer';
import Terms from './pages/Terms';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/certify" element={<Certify />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/my-certificates" element={<MyCertificates />} />
          <Route path="/certificate/:id" element={<CertificateDetail />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
