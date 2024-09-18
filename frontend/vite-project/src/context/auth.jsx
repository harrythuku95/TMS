import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const signup = async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        firstName,
        lastName
      });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      if (response.data.user.role === 'Admin') {
        navigate('/');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error.response?.data?.error || 'Signup failed. Please try again.';
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin/local`, { email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.error || 'Login failed. Please try again.';
    }
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};