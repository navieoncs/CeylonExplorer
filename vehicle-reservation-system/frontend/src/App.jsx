import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Destinations from './pages/Destinations';
import BookVehicle from './pages/BookVehicle';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOnlyRoute from './components/AdminOnlyRoute';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fleet" element={<Vehicles />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/book" element={<BookVehicle />} />
        <Route path="/book/:vehicleId" element={<BookVehicle />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminOnlyRoute>
              <AdminDashboard />
            </AdminOnlyRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
