import.meta.env.VITE_API_URL
import React, { useEffect, useState } from 'react';
import { Alert, Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAgentProtection from '../hoc/withAgentProtection';
import { useAuth } from '../context/auth';

const HomePage = () => {

  const [ticketStats, setTicketStats] = useState({ open: 0, closed: 0, pending: 0 });
  const [customerCount, setCustomerCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the auth context to get the user


  useEffect(() => {
    console.log("Testing Fetch Stats");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      console.log("test log");
      const authToken = localStorage.getItem('authToken');

      const [ticketResponse, customerResponse] = await Promise.all([
        axios.get(`${API_URL}/tickets/stats`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get(`${API_URL}/customers/count`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);
      setTicketStats(ticketResponse.data);
      setCustomerCount(customerResponse.data.count);
      setError(null);
      console.log("test log");
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.log("test error");
      if (error.response && error.response.status === 401) {
      } else {
        setError('Failed to load dashboard data. Please try again later.');
      }
    }
  };

  const handleNewTicket = () => {
    navigate('/new-ticket');
  };

  const handleCustomerManagement = () => {
    navigate('/customers');
  };

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Open Tickets</Typography>
            <Typography variant="h4" color="primary">
              {ticketStats.open}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Closed Tickets</Typography>
            <Typography variant="h4" color="primary">
              {ticketStats.closed}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Pending Tickets</Typography>
            <Typography variant="h4" color="primary">
              {ticketStats.pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Customers</Typography>
            <Typography variant="h4" color="primary">
              {customerCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Quick Actions</Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleNewTicket}>
              Create New Ticket
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleCustomerManagement}>
              Manage Customers
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default withAgentProtection(HomePage);
