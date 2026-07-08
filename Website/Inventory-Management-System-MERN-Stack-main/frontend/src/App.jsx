import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

const PrivateRoute = ({ children }) => {
  const token = useSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/signin" replace />;
};

const AdminRoute = ({ children }) => {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  if (!token) return <Navigate to="/signin" replace />;
  if (user?.role !== 'admin') return <Navigate to="/statistics" replace />;
  return children;
};

export default function App() {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  const isAuthRoute = ['/signin', '/signup'].includes(location.pathname);

  if (!token || isAuthRoute) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/products"   element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
            <Route path="/orders"     element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/inventory"  element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
            <Route path="/statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
            <Route path="/users"      element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/statistics" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
