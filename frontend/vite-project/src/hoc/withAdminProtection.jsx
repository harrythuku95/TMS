import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';



const withAdminProtection = (WrappedComponent) => {
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

    if (!user || user.role !== 'Admin') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminProtection;