import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        padding: { xs: 2, sm: 2.5 },
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, md: 240 },
        width: { xs: '100%', md: 'calc(100% - 240px)' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: '0px -2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
        &copy; {new Date().getFullYear()} Ticket Management System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;