import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ToursSection from './components/sections/ToursSection';
import ShuttleSection from './components/sections/ShuttleSection';
import BookingSection from './components/sections/BookingSection';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ToursManagement from './components/admin/ToursManagement';
import BookingsManagement from './components/admin/BookingsManagement';
import ShuttleManagement from './components/admin/ShuttleManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique */}
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ToursSection />
            <ShuttleSection />
            <BookingSection />
            <Footer />
          </div>
        } />
        
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
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
                <p className="mt-2 text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;