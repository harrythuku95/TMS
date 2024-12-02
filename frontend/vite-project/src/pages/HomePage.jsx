import.meta.env.VITE_API_URL
import React, { useEffect, useState } from 'react';
import { Alert, Container, Typography, Box, Grid, Paper, Button, useTheme } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {

  const [ticketStats, setTicketStats] = useState({ open: 0, closed: 0, pending: 0 });
  const [customerCount, setCustomerCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const theme = useTheme();


  useEffect(() => {
    console.log("Testing Fetch Stats");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data. Please try again later.');
    }
  };

  const handleNewTicket = () => {
    navigate('/new-ticket');
  };

  const handleCustomerManagement = () => {
    navigate('/customers');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="h3" gutterBottom align="center" sx={{ color: theme.palette.custom.dark }}>
          Dashboard
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: theme.palette.custom.white }}>
              <Typography variant="h6" sx={{ color: theme.palette.custom.dark }}>Open Tickets</Typography>
              <Typography variant="h4" sx={{ color: theme.palette.custom.light }}>
                {ticketStats.open}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: theme.palette.custom.white }}>
              <Typography variant="h6" sx={{ color: theme.palette.custom.dark }}>Closed Tickets</Typography>
              <Typography variant="h4" sx={{ color: theme.palette.custom.light }}>
                {ticketStats.closed}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: theme.palette.custom.white }}>
              <Typography variant="h6" sx={{ color: theme.palette.custom.dark }}>Pending Tickets</Typography>
              <Typography variant="h4" sx={{ color: theme.palette.custom.light }}>
                {ticketStats.pending}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: theme.palette.custom.white }}>
              <Typography variant="h6" sx={{ color: theme.palette.custom.dark }}>Customers</Typography>
              <Typography variant="h4" sx={{ color: theme.palette.custom.light }}>
                {customerCount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: theme.palette.custom.dark }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button 
                variant="contained" 
                onClick={handleNewTicket}
                sx={{ 
                  backgroundColor: theme.palette.custom.light,
                  color: theme.palette.custom.white,
                  '&:hover': {
                    backgroundColor: theme.palette.custom.purple,
                  }
                }}
              >
                Create New Ticket
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                onClick={handleCustomerManagement}
                sx={{ 
                  backgroundColor: theme.palette.custom.light,
                  color: theme.palette.custom.white,
                  '&:hover': {
                    backgroundColor: theme.palette.custom.purple,
                  }
                }}
              >
                Manage Customers
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
