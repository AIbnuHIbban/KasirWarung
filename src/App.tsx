import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<Menu />} />
            <Route path="transaksi" element={<Transactions />} />
            <Route path="laporan" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;