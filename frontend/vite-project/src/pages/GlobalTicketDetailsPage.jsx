import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAuthProtection from '../hoc/withAuthProtection';
import FadeInWrapper from '../components/FadeInWrapper';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const API_URL = import.meta.env.VITE_API_URL;

const GlobalTicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const isAdminOrAgent = user?.role === 'Admin' || user?.role === 'Agent';

  useEffect(() => {
    fetchTicketDetails();
    if (isAdminOrAgent && user.role === 'Admin') {
      fetchAssignees();
    }
  }, [id, user.role]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tickets/${id}`);
      console.log("Fetched ticket details:", response.data);
      setTicket(response.data);
      setSelectedAssignee(response.data.assignee || null);
      setError(null);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(`${API_URL}/users?role=Agent`);
      setAssignees(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching assignees:', error);
      setError('Failed to load assignees. Please try again.');
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedAssignee) {
      console.log("No assignee selected");
      return;
    }
    try {
      console.log("Sending assign request for ticket:", id, "to assignee:", selectedAssignee.id);
      const response = await axios.put(`${API_URL}/tickets/${id}`,
        { assigneeId: selectedAssignee.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      console.log("Assign response:", response.data);
      fetchTicketDetails();
    } catch (error) {
      console.error('Error assigning ticket:', error.response || error);
      setError(error.response?.data?.error || 'Failed to assign ticket. Please try again.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/tickets/${id}`, { status: newStatus });
      fetchTicketDetails();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError('Failed to update ticket status. Please try again.');
    }
  };

  const memoizedAssignees = useMemo(() => assignees, [assignees]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Typography variant="h6">Ticket not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
      <FadeInWrapper>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom align="center">
            Ticket Details
          </Typography>
          <Paper sx={{ p: 3, width: '100%' }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">Ticket ID:</Typography>
              <Typography variant="body1">{ticket.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">Created At:</Typography>
              <Typography variant="body1">
                {new Date(ticket.createdAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">Status:</Typography>
              <StatusBadge status={ticket.status} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Subject:</Typography>
              <Typography variant="body1">{ticket.subject}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Priority:</Typography>
              <PriorityBadge priority={ticket.priority} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Assignee:</Typography>
              <Typography variant="body1">
                {ticket.assignee
                  ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                  : 'Unassigned'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Description:</Typography>
              <Typography variant="body1">{ticket.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Customer:</Typography>
              <Typography variant="body1">
                {ticket.customer
                  ? `${ticket.customer.name} (${ticket.customer.email})`
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Status Timeline */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Status Timeline</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {ticket.pendingAt && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Pending:</strong> {new Date(ticket.pendingAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
              {ticket.openedAt && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Opened:</strong> {new Date(ticket.openedAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
              {ticket.closedAt && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Closed:</strong> {new Date(ticket.closedAt).toLocaleString()}
                    {ticket.closedBy && (
                      <> by {ticket.closedBy.firstName} {ticket.closedBy.lastName}</>
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Role-based UI: Only show controls for Admin/Agent */}
          {isAdminOrAgent && (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Update Status</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {['open', 'in_progress', 'closed'].map((status) => (
                    <Grid item xs={12} sm={4} key={status}>
                      <Button
                        onClick={() => handleStatusChange(status)}
                        variant="outlined"
                        fullWidth
                        size={isSmallScreen ? 'medium' : 'large'}
                      >
                        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {user.role === 'Admin' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Assign Ticket</Typography>
                  {memoizedAssignees.length > 0 ? (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={8} md={9}>
                        <Autocomplete
                          options={memoizedAssignees}
                          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                          value={selectedAssignee}
                          onChange={(event, newValue) => {
                            setSelectedAssignee(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} label="Select Assignee" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={3}>
                        <Button
                          onClick={handleAssignTicket}
                          variant="contained"
                          disabled={!selectedAssignee}
                          fullWidth
                          size={isSmallScreen ? 'medium' : 'large'}
                        >
                          Assign
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography>No assignees available</Typography>
                  )}
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/global-tickets')}
              fullWidth={isSmallScreen}
              size={isSmallScreen ? 'medium' : 'large'}
            >
              Back to All Tickets
            </Button>
          </Box>
        </Paper>
      </Box>
      </FadeInWrapper>
    </Container>
  );
};

export default withAuthProtection(GlobalTicketDetailsPage);
