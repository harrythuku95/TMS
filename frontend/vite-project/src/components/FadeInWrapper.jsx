import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeInWrapper = ({ children, delay = 0 }) => {
  return (
    <Box
      sx={{
        animation: `${fadeInUp} 500ms ease-in-out`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </Box>
  );
};

export default FadeInWrapper;
