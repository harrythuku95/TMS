import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAdminProtection from '../hoc/withAdminProtection';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      console.log('Customers fetched:', response.data);
      setCustomers(response.data.rows);
    } catch (error) {
      console.error('Error fetching customers:', error.response?.data || error.message);
    }
  };

  const handleAddCustomer = () => {
    navigate('/add-customer');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Customer Management</Typography>
        {(user.role === 'Admin' || user.role === 'Agent') && (
          <Button variant="contained" color="primary" onClick={handleAddCustomer}>
            Add Customer
          </Button>
        )}
      </Box>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => handleEdit(customer.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(customer.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default withAdminProtection(CustomerManagementPage);
