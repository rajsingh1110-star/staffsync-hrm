import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: 'General',
    position: 'Staff'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegistering 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await axios.post(endpoint, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      onLoginSuccess(response.data.user || response.data);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-[#0e1626] border border-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isRegistering ? 'Create Account' : 'StaffSync HRM Login'}
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {isRegistering ? 'Register to access your portal' : 'Sign in to your account'}
        </p>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
              className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Position</label>
                  <input 
                    type="text" 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full bg-[#090d16] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-400 hover:underline"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}