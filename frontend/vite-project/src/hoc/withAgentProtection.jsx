import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const withAgentProtection = (Component) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || (user.role !== 'Agent' && user.role !== 'Admin')) {
        navigate('/login');
      }
    }, [user, navigate]);

    return user && (user.role === 'Agent' || user.role === 'Admin') ? <Component {...props} /> : null;
  };
};

export default withAgentProtection;