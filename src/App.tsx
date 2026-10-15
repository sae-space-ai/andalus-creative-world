import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail, { ForgotPassword, ResetPassword } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import { 
  CinemaPage, CinemaPlusPage, CommunityPage, 
  FestivalsPage, RightsPage, TracePage, WalletPage 
} from './pages/Modules';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Module info pages (public) */}
              <Route path="/cinema" element={<CinemaPage />} />
              <Route path="/cinema-plus" element={<CinemaPlusPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/festivals" element={<FestivalsPage />} />
              <Route path="/rights" element={<RightsPage />} />
              <Route path="/trace" element={<TracePage />} />
              <Route path="/wallet" element={<WalletPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute><Projects /></ProtectedRoute>
              } />
              <Route path="/projects/new" element={
                <ProtectedRoute><Projects /></ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute><ProjectDetail /></ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute><Account /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
