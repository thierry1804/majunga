import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ToursSection from './components/sections/ToursSection';
import ShuttleSection from './components/sections/ShuttleSection';
import BookingSection from './components/sections/BookingSection';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ToursManagement from './components/admin/ToursManagement';
import BookingsManagement from './components/admin/BookingsManagement';
import ShuttleManagement from './components/admin/ShuttleManagement';
import SettingsManagement from './components/admin/SettingsManagement';
import MaintenancePage from './components/MaintenancePage';
import { useMaintenanceMode } from './hooks/useMaintenanceMode';
import TrustBar from './components/sections/TrustBar';
import SectionDivider from './components/motion/SectionDivider';
import SkipLink from './components/layout/SkipLink';
import ScrollProgress from './components/motion/ScrollProgress';

function AppContent() {
  const { isMaintenanceMode, loading, maintenanceMessage } = useMaintenanceMode();
  const location = useLocation();

  // Afficher la page de maintenance si le mode est activé (sauf pour les routes admin)
  if (!loading && isMaintenanceMode && !location.pathname.startsWith('/admin')) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={
        <div className="min-h-screen bg-sand-50">
          <SkipLink />
          <ScrollProgress />
          <div className="grain-overlay" aria-hidden="true" />
          <Navbar />
          <main id="main-content">
            <HeroSection />
            <SectionDivider tone="hero-to-sand" />
            <TrustBar />
            <AboutSection />
            <SectionDivider tone="sand-to-white" />
            <ToursSection />
            <SectionDivider tone="sand-to-sand-light" />
            <ShuttleSection />
            <SectionDivider tone="sand-light-to-white" />
            <BookingSection />
          </main>
          <Footer />
        </div>
      } />

        {/* Route de réinitialisation de mot de passe */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Routes admin */}
        <Route path="/admin" element={
          <ProtectedRoute requireEditor>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tours" element={
          <ProtectedRoute requireEditor>
            <AdminLayout>
              <ToursManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute requireEditor>
            <AdminLayout>
              <BookingsManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/shuttles" element={
          <ProtectedRoute requireEditor>
            <AdminLayout>
              <ShuttleManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                <p className="mt-2 text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
            <SettingsManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;