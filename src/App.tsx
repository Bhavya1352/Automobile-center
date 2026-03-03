import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Home1 from './pages/Home1';
import Home2 from './pages/Home2';
import About from './pages/About';
import Contact from './pages/Contact';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Technicians from './pages/Technicians';
import Certifications from './pages/Certifications';
import Careers from './pages/Careers';
import GetStarted from './pages/GetStarted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home1" element={<Layout><Home1 /></Layout>} />
        <Route path="/home2" element={<Layout><Home2 /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/user-dashboard" element={<Layout><UserDashboard /></Layout>} />
        <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/technicians" element={<Layout><Technicians /></Layout>} />
        <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
        <Route path="/careers" element={<Layout><Careers /></Layout>} />
        <Route path="/get-started" element={<Layout showFooter={false}><GetStarted /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
