import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const withAdminProtection = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || user.role !== 'Admin') {
        navigate('/login');
      }
    }, [user, navigate]);

    if (!user || user.role !== 'Admin') {
      return null; // or return a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminProtection;