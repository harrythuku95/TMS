import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, TextField, Autocomplete, Chip } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAgentProtection from '../hoc/withAgentProtection';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTicketDetails();
    fetchAssignees();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setTicket(response.data);
      setLabels(response.data.labels || []);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users?role=Agent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setAssignees(response.data.rows);
    } catch (error) {
      console.error('Error fetching assignees:', error);
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      const updatedLabels = [...labels, newLabel];
      await axios.put(`http://localhost:8080/api/ticket_labels/ticket/${id}`, 
        { labels: updatedLabels },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
      );
      setLabels(updatedLabels);
      setNewLabel('');
    } catch (error) {
      console.error('Error adding label:', error);
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedAssignee) return;
    try {
      await axios.put(`http://localhost:8080/api/tickets/${id}/assign`, { assigneeId: selectedAssignee.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      fetchTicketDetails();
    } catch (error) {
      console.error('Error assigning ticket:', error);
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
          </Grid>
          
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
              
              {user.role === 'Admin' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Assign Ticket</Typography>
                  <Autocomplete
                    options={assignees}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    value={selectedAssignee}
                    onChange={(event, newValue) => {
                      setSelectedAssignee(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Assignee" />}
                    sx={{ mb: 1 }}
                  />
                  <Button onClick={handleAssignTicket} variant="contained">Assign</Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default withAgentProtection(TicketDetailsPage);