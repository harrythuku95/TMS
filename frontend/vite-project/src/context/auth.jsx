import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

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
      console.log('Making signup request to:', `${API_URL}/auth/signup`);
      console.log('With data:', { email, firstName, lastName }); // Don't log password
      
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        firstName,
        lastName
      });

      console.log('Signup successful:', response.data);
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
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      throw error.response?.data?.error || 'Signup failed. Please try again.';
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Making login request to:', `${API_URL}/auth/signin/local`);
      console.log('With email:', email); // Don't log password

      const response = await axios.post(`${API_URL}/auth/signin/local`, { 
        email, 
        password 
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
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