// src/context/auth.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:8080/api/auth/user');
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin/local', { email, password });
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  const signup = async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', { email, password, firstName, lastName });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };


const logout = async () => {
  try {
    await axios.post('http://localhost:8080/api/auth/logout');
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  } catch (error) {
    console.error('Error logging out:', error);
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }
};

  const value = {
    user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>} {/* Display loading indicator if loading */}
    </AuthContext.Provider>
  );
};
