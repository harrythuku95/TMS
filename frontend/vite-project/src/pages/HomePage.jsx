import React, { useEffect, useState } from 'react';
import { Alert, Container, Typography, Box, Grid, Paper, Button, useTheme } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import FadeInWrapper from '../components/FadeInWrapper';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';

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

  const statCards = [
    {
      title: 'Open Tickets',
      value: ticketStats.open,
      icon: <ConfirmationNumberIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
    },
    {
      title: 'Closed Tickets',
      value: ticketStats.closed,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Pending Tickets',
      value: ticketStats.pending,
      icon: <PendingIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Customers',
      value: customerCount,
      icon: <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
  ];

  return (
    <FadeInWrapper>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
            Dashboard
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeInUp 500ms ease-in-out',
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both',
                    transition: 'all 300ms ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: { xs: 4, sm: 6 }, width: '100%' }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm="auto">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewTicket}
                  size="large"
                  fullWidth
                  sx={{
                    minWidth: { xs: '100%', sm: 200 },
                  }}
                >
                  Create New Ticket
                </Button>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCustomerManagement}
                  size="large"
                  fullWidth
                  sx={{
                    minWidth: { xs: '100%', sm: 200 },
                  }}
                >
                  Manage Customers
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </FadeInWrapper>
  );
};

export default HomePage;
