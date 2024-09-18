// src/hoc/withAgentProtection.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const withAgentProtection = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'Admin' && user.role !== 'Agent') {
        navigate('/profile');
      }
    }, [user, navigate]);

    if (user && (user.role === 'Admin' || user.role  === 'Agent')) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAgentProtection;