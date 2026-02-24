import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const VendorManagement = lazy(() => import('./pages/admin/VendorManagement'));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans'));
const MySubscriptions = lazy(() => import('./pages/MySubscriptions'));
const Products = lazy(() => import('./pages/Products'));

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-50 text-indigo-600 font-bold">Loading...</div>}>
          <Routes>
          {/* Public Routes without Layout */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Routes with Shared Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/my-subscriptions" 
              element={
                <ProtectedRoute>
                  <MySubscriptions />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin/vendors" 
              element={
                <ProtectedRoute role="admin">
                  <VendorManagement />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/vendors/:vendorId/plans" 
              element={
                <ProtectedRoute role="admin">
                  <AdminPlans />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
  );
}

export default App;

