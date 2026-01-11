import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin, isAdmin } from '../lib/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { seedVehicles } from '../lib/seed';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInAdmin(email, password);
      // Check if actually admin
      const adminStatus = await isAdmin(userCredential.user.uid);
      
      if (!adminStatus) {
        await signOut(auth);
        throw new Error("Access Denied: You are not an administrator.");
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async (e) => {
    if(window.confirm("This will add sample vehicles to the database. Continue?")) {
      await seedVehicles();
    }
  };

  return (
    <div className="container login-container">
      <h2>Admin Login</h2>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={handleSeed}>
           Seed Database (Dev Only)
        </button>
      </div>
    </div>
  );
}
