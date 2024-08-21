// src/components/Footer.jsx

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        padding: 2,
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} Ticket Management System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
