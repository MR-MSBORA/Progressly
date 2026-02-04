// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from '../components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;