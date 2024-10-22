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
  TableContainer,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAgentProtection from '../hoc/withAgentProtection';

const API_URL = process.env.REACT_APP_BASE_URL;

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/tickets`);
      console.log('Tickets received:', response.data);
      setTickets(response.data.rows);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/ticket-details/${id}`);
  };

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>
                {ticket.assignee 
                  ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                  : 'Unassigned'}
              </TableCell>
              <TableCell>{ticket.customer ? ticket.customer.name : 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(ticket.id)}
                  size="small"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {tickets.map((ticket) => (
        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{ticket.subject}</Typography>
              <Typography variant="body2" color="textSecondary">ID: {ticket.id}</Typography>
              <Typography variant="body2">Priority: {ticket.priority}</Typography>
              <Typography variant="body2">Status: {ticket.status}</Typography>
              <Typography variant="body2">
                Assignee: {ticket.assignee 
                  ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                  : 'Unassigned'}
              </Typography>
              <TableCell>
                {ticket.customer ? ticket.customer.name : 'N/A'}
              </TableCell>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(ticket.id)}
                  size="small"
                  fullWidth
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom align="center">
          Tickets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/new-ticket')}
          sx={{ mb: 3 }}
        >
          Create New Ticket
        </Button>
        {isSmallScreen ? renderCardView() : renderTableView()}
      </Box>
    </Container>
  );
};

export default withAgentProtection(TicketListPage);