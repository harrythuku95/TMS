// src/hoc/withAgentProtection.jsx

import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const withAgentProtection = (Component) => {
  return (props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !user) {
        navigate('/login');
      }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    
    return user ? <Component {...props} /> : null;
  };
};

export default withAgentProtection;