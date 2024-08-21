// src/hoc/withAgentProtection.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const withAgentProtection = (Component) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || user.app_role.name !== 'agent') {
        navigate('/login');
      }
    }, [user, navigate]);

    return user && user.app_role.name === 'agent' ? <Component {...props} /> : null;
  };
};

export default withAgentProtection;
