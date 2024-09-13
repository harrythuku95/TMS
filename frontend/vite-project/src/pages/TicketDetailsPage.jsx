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
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAgentProtection from '../hoc/withAgentProtection';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTicketDetails();
    if (user.role === 'Admin') {
      fetchAssignees();
    }
  }, [id, user.role]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching ticket details for ID:', id);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`);
      console.log('Ticket details response:', response.data);
      setTicket(response.data);
      setLabels(response.data.labels || []);
      setSelectedAssignee(response.data.assignee || null);
      setError(null);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError(`Failed to load ticket details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users?role=Agent`);
      console.log('Assignees response:', response.data);
      setAssignees(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching assignees:', error);
      setError('Failed to load assignees. Please try again.');
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/labels`, { label: newLabel });
      setLabels([...labels, newLabel]);
      setNewLabel('');
    } catch (error) {
      console.error('Error adding label:', error);
      setError('Failed to add label. Please try again.');
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedAssignee) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/assign`, { assigneeId: selectedAssignee.id });
      fetchTicketDetails();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      setError('Failed to assign ticket. Please try again.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, { status: newStatus });
      fetchTicketDetails();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError('Failed to update ticket status. Please try again.');
    }
  };

  const memoizedAssignees = useMemo(() => assignees, [assignees]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mt: 4 }}>Ticket not found</Typography>
      </Container>
    );
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
            <Typography variant="subtitle1">Ticket ID:</Typography>
            <Typography variant="body1">{ticket?.id || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Created At:</Typography>
            <Typography variant="body1">
              {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Subject:</Typography>
            <Typography variant="body1">{ticket?.subject || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Priority:</Typography>
            <Typography variant="body1">{ticket?.priority || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Status:</Typography>
            <Typography variant="body1">{ticket?.status || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Description:</Typography>
            <Typography variant="body1">{ticket?.description || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Assignee:</Typography>
            <Typography variant="body1">
              {selectedAssignee ? `${selectedAssignee.firstName} ${selectedAssignee.lastName}` : 'Unassigned'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Customer:</Typography>
            <Typography variant="body1">{ticket?.customer?.name || 'N/A'}</Typography>
          </Grid>
        </Grid>

          <Divider sx={{ my: 2 }} />

          {(user.role === 'Admin' || user.role === 'Agent') && (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Labels</Typography>
                {labels.map((label) => (
                  <Chip key={label} label={label} sx={{ mr: 1, mb: 1 }} />
                ))}
                <TextField
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="New label"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Button onClick={handleAddLabel} variant="contained" size="small">Add Label</Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Update Status</Typography>
                <Button onClick={() => handleStatusChange('open')} variant="outlined" sx={{ mr: 1 }}>Open</Button>
                <Button onClick={() => handleStatusChange('in_progress')} variant="outlined" sx={{ mr: 1 }}>In Progress</Button>
                <Button onClick={() => handleStatusChange('closed')} variant="outlined">Closed</Button>
              </Box>
              
              {user.role === 'Admin' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Assign Ticket</Typography>
                  {memoizedAssignees.length > 0 ? (
                    <Autocomplete
                      options={memoizedAssignees}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                      value={selectedAssignee}
                      onChange={(event, newValue) => {
                        setSelectedAssignee(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label="Select Assignee" />}
                      sx={{ mb: 1 }}
                    />
                  ) : (
                    <Typography>No assignees available</Typography>
                  )}
                  <Button onClick={handleAssignTicket} variant="contained" disabled={!selectedAssignee}>
                    Assign
                  </Button>
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/tickets')}>Back to Tickets</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default withAgentProtection(TicketDetailsPage);