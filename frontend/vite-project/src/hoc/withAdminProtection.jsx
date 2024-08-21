// src/hoc/withAdminProtection.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const withAdminProtection = (Component) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || user.app_role.name !== 'admin') {
        navigate('/login');
      }
    }, [user, navigate]);

    return user && user.app_role.name === 'admin' ? <Component {...props} /> : null;
  };
};

export default withAdminProtection;
