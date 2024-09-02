import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const withAdminProtection = (Component) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'Admin') {
        navigate('/');
      }
    }, [user, navigate]);

    return user && user.role === 'Admin' ? <Component {...props} /> : null;
  };
};

export default withAdminProtection;