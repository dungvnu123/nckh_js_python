import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './api/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Khoa from './pages/Khoa';
import BoMon from './pages/BoMon';
import SinhVien from './pages/SinhVien';
import GiangVien from './pages/GiangVien';
import DeTai from './pages/DeTai';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/detai" 
          element={
            <PrivateRoute>
              <DeTai />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/khoa" 
          element={
            <PrivateRoute>
              <Khoa />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/bomon" 
          element={
            <PrivateRoute>
              <BoMon />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/sinhvien" 
          element={
            <PrivateRoute>
              <SinhVien />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/giangvien" 
          element={
            <PrivateRoute>
              <GiangVien />
            </PrivateRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
