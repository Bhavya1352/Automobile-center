import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LazySpinner from './components/LazySpinner';
import ScrollToTop from './components/ScrollToTop';
import { InventoryProvider } from './context/InventoryProvider';
import { ToastProvider } from './context/ToastProvider';
import { WorkshopProvider } from './context/WorkshopProvider';

/**
 * Each route is loaded on demand with React.lazy(), so the initial
 * bundle carries only the shell and the homepage.
 */
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Technicians = lazy(() => import('./pages/Technicians'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Careers = lazy(() => import('./pages/Careers'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Inventory = lazy(() => import('./pages/Inventory'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const Comparison = lazy(() => import('./pages/Comparison'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Legal = lazy(() => import('./pages/Legal'));

function App() {
  // The stylesheet's prefers-reduced-motion block only neuters CSS
  // transitions; Framer Motion animates in JS and ignored it entirely.
  // reducedMotion="user" makes every motion component honour the setting.
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <InventoryProvider>
          <ToastProvider>
            <ErrorBoundary>
              <ScrollToTop />
              <Suspense fallback={<LazySpinner />}>
                <Routes>
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  {/* The two theme homepages are retired; keep the old
                      paths working rather than breaking saved links. */}
                  <Route path="/home1" element={<Navigate to="/" replace />} />
                  <Route path="/home2" element={<Navigate to="/" replace />} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  {/* The workshop provider wraps the two dashboards rather
                      than the whole app: a visitor who never opens one
                      should not pay for its fetch. */}
                  <Route path="/user-dashboard" element={
                    <Layout showFooter={false}>
                      <WorkshopProvider><UserDashboard /></WorkshopProvider>
                    </Layout>
                  } />
                  <Route path="/admin-dashboard" element={
                    <Layout showFooter={false}>
                      <WorkshopProvider><AdminDashboard /></WorkshopProvider>
                    </Layout>
                  } />
                  <Route path="/technicians" element={<Layout><Technicians /></Layout>} />
                  <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
                  <Route path="/careers" element={<Layout><Careers /></Layout>} />
                  <Route path="/get-started" element={<Layout><GetStarted /></Layout>} />
                  <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
                  <Route path="/car-details/:id" element={<Layout><CarDetails /></Layout>} />
                  <Route path="/compare" element={<Layout><Comparison /></Layout>} />
                  <Route path="/privacy" element={<Layout><Legal doc="privacy" /></Layout>} />
                  <Route path="/terms" element={<Layout><Legal doc="terms" /></Layout>} />
                  <Route path="/cookies" element={<Layout><Legal doc="cookies" /></Layout>} />
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </ToastProvider>
        </InventoryProvider>
      </Router>
    </MotionConfig>
  );
}

export default App;
