import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const EditCustomerPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/customers/${id}`, customer, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      alert('Customer updated successfully!');
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer.');
    }
  };

  return (
    <FadeInWrapper>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom align="center">Edit Customer</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', mt: 2 }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={customer.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={customer.address}
                onChange={handleChange}
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
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </FadeInWrapper>
  );
};

export default withAdminProtection(EditCustomerPage);
