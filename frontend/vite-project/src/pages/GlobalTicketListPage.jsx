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
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuthProtection from '../hoc/withAuthProtection';
import FadeInWrapper from '../components/FadeInWrapper';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const API_URL = import.meta.env.VITE_API_URL;

const GlobalTicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTickets();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTickets = async () => {
    try {
      const url = debouncedSearchTerm
        ? `${API_URL}/tickets?search=${encodeURIComponent(debouncedSearchTerm)}`
        : `${API_URL}/tickets`;
      const response = await axios.get(url);
      console.log('Tickets received:', response.data);
      setTickets(response.data.rows);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/global-tickets/${id}`);
  };

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>Ticket Name</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.name}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                {ticket.assignee
                  ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                  : 'Unassigned'}
              </TableCell>
              <TableCell>{ticket.customer ? ticket.customer.name : 'N/A'}</TableCell>
              <TableCell align="right">
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
      {tickets.map((ticket, index) => (
        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
          <Card
            sx={{
              animation: 'fadeInUp 500ms ease-in-out',
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>{ticket.name}</Typography>
              <Typography variant="body2" gutterBottom>
                {ticket.subject}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1, flexWrap: 'wrap' }}>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Assignee:</strong> {ticket.assignee
                  ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                  : 'Unassigned'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Customer:</strong> {ticket.customer ? ticket.customer.name : 'N/A'}
              </Typography>
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
    <FadeInWrapper>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom align="center">
            All Tickets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/new-ticket')}
            sx={{ mb: 3 }}
            size={isSmallScreen ? 'medium' : 'large'}
          >
            Create New Ticket
          </Button>
          <Box sx={{ width: '100%', mb: 3 }}>
            <TextField
              label="Search tickets"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket name or customer name"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {tickets.length === 0 && debouncedSearchTerm ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No tickets found matching your search.
            </Typography>
          ) : (
            isSmallScreen ? renderCardView() : renderTableView()
          )}
        </Box>
      </Container>
    </FadeInWrapper>
  );
};

export default withAuthProtection(GlobalTicketListPage);
