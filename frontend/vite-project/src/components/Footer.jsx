import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.custom.purple,
        color: theme.palette.custom.white,
        padding: 2,
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, sm: 0, md: 240, lg: 240, xl: 240 },
        width: { xs: '100%', sm: '100%', md: 'calc(100% - 240px)', lg: 'calc(100% - 240px)', xl: 'calc(100% - 240px)' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">
        &copy; {new Date().getFullYear()} Ticket Management System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;