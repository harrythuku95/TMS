import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Box, Grid, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import useStyles from './styles';
import Widget from '../../components/Widget/Widget';

const Dashboard = () => {
  const classes = useStyles();
  const [ticketsCount, setTicketsCount] = useState(0);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Low', // Example ticket attribute
  });

  const currentUser = {}; // Replace with your logic to get the current user

  const loadData = async () => {
    try {
      const responseTickets = await axios.get('/tickets/count');
      setTicketsCount(responseTickets.data.count);
      // Add additional data fetching as needed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      // Make a request to create a new ticket
      await axios.post('/tickets', {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        // Include other ticket attributes as needed
      });

      // Reload data after ticket creation
      loadData();
      // Reset the new ticket form
      setNewTicket({
        title: '',
        description: '',
        priority: 'Low',
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  useEffect(() => {
    // Load data on component mount
    loadData();
  }, []);

  if (!currentUser) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" className={classes.pageTitle}>
        Welcome, {currentUser.firstName}!
      </Typography>
      <Typography variant="subtitle1">
        Your role is {currentUser.role}
      </Typography>

      <Grid container spacing={3}>
        {/* Existing Widgets */}
        {hasPermission(currentUser, 'READ_USERS') && (
          <Grid item xs={12} sm={6} md={4}>
            {/* Widget Component */}
          </Grid>
        )}

        {/* ... Add other widgets based on permissions ... */}

        {/* Ticket Creation Form */}
        {hasPermission(currentUser, 'CREATE_TICKET') && (
          <Grid item xs={12} md={6}>
            <Widget title="Create Ticket">
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
              <TextField
                label="Priority"
                variant="outlined"
                select
                fullWidth
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTicket}
                disabled={!newTicket.title || !newTicket.description}
              >
                Create Ticket
              </Button>
            </Widget>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Dashboard;
