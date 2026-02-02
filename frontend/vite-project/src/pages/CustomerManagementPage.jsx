import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAdminProtection from '../hoc/withAdminProtection';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      console.log('Fetched customers:', response.data.rows);
      setCustomers(response.data.rows);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleAddCustomer = () => {
    navigate('/add-customer');
  };

  const handleEdit = (customerId) => {
    navigate(`/edit-customer/${customerId}`);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${API_URL}/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <FadeInWrapper>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: { xs: 2, sm: 4 }, mb: 3 }}>
          <Typography variant="h4">Customer Management</Typography>
          {(user.role === 'Admin' || user.role === 'Agent') && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCustomer}
              size={isSmallScreen ? 'medium' : 'large'}
            >
              Add Customer
            </Button>
          )}
        </Box>

        {isSmallScreen ? (
          <Grid container spacing={2}>
            {customers.map((customer, index) => (
              <Grid item xs={12} key={customer.id}>
                <Card
                  sx={{
                    animation: 'fadeInUp 500ms ease-in-out',
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Email:</strong> {customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Phone:</strong> {customer.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {customer.address}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton color="primary" onClick={() => handleEdit(customer.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(customer.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer>
            <Table>
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
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(customer.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(customer.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </FadeInWrapper>
  );
};

export default withAdminProtection(CustomerManagementPage);
