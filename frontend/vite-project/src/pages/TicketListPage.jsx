import React, { useEffect, useState } from 'react';
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
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAgentProtection from '../hoc/withAgentProtection';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tickets');
      setTickets(response.data.rows);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/ticket-details/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Tickets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/new-ticket')}
          sx={{ mb: 2 }}
        >
          Create New Ticket
        </Button>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assignee</TableCell> {/* New column */}
                <TableCell>Customer</TableCell> {/* New column */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.ticket_id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.assignee.firstName} {ticket.assignee.lastName}</TableCell> {/* Display assignee */}
                  <TableCell>{ticket.customer.name}</TableCell> {/* Display customer */}
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(ticket.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default withAgentProtection(TicketListPage);
