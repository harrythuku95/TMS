import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAdminProtection from '../hoc/withAdminProtection';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const AddCustomerPage = () => {
  console.log("AddCustomerPage is rendering");

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const customerData = {
      name,
      email,
      phone, 
      address,
    };
  
    try {
      const token = localStorage.getItem('authToken');
      console.log('Sending data:', customerData);
      console.log('Sending data:', { name, email, phone, address });  
      const response = await axios.post(`${API_URL}/customers`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', response.data);
      navigate('/customers');
    } catch (error) {
      console.error('Error adding customer:', error.response?.data?.error || error.message);
    }
  };

  return (
    <FadeInWrapper>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom align="center">Add Customer</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', mt: 2 }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                value={phone}  
                onChange={(e) => setPhone(e.target.value)} 
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={{ xs: true, sm: false }}
                size={isSmallScreen ? 'medium' : 'large'}
              >
                Add Customer
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </FadeInWrapper>
  );
};

export default withAdminProtection(AddCustomerPage);