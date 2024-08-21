import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import withAdminProtection from '../hoc/withAdminProtection';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/customers', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCustomers(response.data.rows);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:8080/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        fetchCustomers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleAddCustomer = () => {
    navigate('/add-customer');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Customer Management</Typography>
        <Button variant="contained" color="primary" onClick={handleAddCustomer}>
          Add Customer
        </Button>
      </Box>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell align="right">Actions</TableCell>
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
