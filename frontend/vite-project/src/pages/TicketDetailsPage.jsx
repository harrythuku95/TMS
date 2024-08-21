import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import axios from 'axios';
import withAgentProtection from '../hoc/withAgentProtection';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tickets/${id}`);
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  if (!ticket) {
    return <Typography>Loading ticket details...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Ticket Details
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Ticket ID:</Typography>
              <Typography>{ticket.ticket_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Subject:</Typography>
              <Typography>{ticket.subject}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Priority:</Typography>
              <Typography>{ticket.priority}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Status:</Typography>
              <Typography>{ticket.status}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Description:</Typography>
              <Typography>{ticket.description}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Customer:</Typography>
              <Typography>{ticket.customer?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Assignee:</Typography>
              <Typography>{ticket.assignee?.firstName} {ticket.assignee?.lastName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => window.history.back()}
              >
                Back to Tickets
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default withAgentProtection(TicketDetailsPage);
