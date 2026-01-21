// src/hoc/withAuthProtection.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const withAuthProtection = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    if (user) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuthProtection;
