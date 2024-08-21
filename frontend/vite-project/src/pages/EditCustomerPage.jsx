import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';

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

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/customers/${id}`, {
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
      await axios.put(`http://localhost:8080/api/customers/${id}`, customer, {
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}
      >
        <Typography variant="h4">Edit Customer</Typography>
        <TextField
          label="Name"
          name="name"
          value={customer.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          required
        />
        <TextField
          label="Address"
          name="address"
          value={customer.address}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default withAdminProtection(EditCustomerPage);
