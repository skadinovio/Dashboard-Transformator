import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import Data from './pages/data';
import Laporan from './pages/Laporan';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import ManageCompanies from './pages/ManageCompanies';
import ManageUsers from './pages/ManageUsers';
import NotFound from './pages/NotFound'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Data - semua role boleh */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin', 'teknisi', 'perusahaan']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/Data"
          element={
            <PrivateRoute allowedRoles={['admin', 'teknisi', 'perusahaan']}>
              <Data />
            </PrivateRoute>
          }
        />

        {/* Laporan - hanya admin dan teknisi */}
        <Route
          path="/laporan"
          element={
            <PrivateRoute allowedRoles={['admin', 'teknisi']}>
              <Laporan />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-companies"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageCompanies />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        
        {/* Catch-all untuk 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);