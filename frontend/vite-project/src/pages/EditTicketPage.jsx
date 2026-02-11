import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/auth';
import withAgentProtection from '../hoc/withAgentProtection';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['pending', 'open', 'in_progress', 'closed'];

const EditTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(null);

  // Options
  const [customers, setCustomers] = useState([]);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    fetchTicketDetails();
    fetchCustomers();
    if (user.role === 'Admin') {
      fetchAssignees();
    }
  }, [id, user.role]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      const ticket = response.data;

      setSubject(ticket.subject || '');
      setDescription(ticket.description || '');
      setPriority(ticket.priority || '');
      setStatus(ticket.status || '');
      setSelectedCustomer(ticket.customer || null);
      setSelectedAssignee(ticket.assignee || null);
      setError(null);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setCustomers(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(`${API_URL}/users?role=Agent`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setAssignees(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching assignees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!priority) {
      setError('Priority is required');
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        subject: subject.trim(),
        description: description.trim(),
        priority,
        status,
      };

      if (selectedCustomer) {
        updateData.customer = selectedCustomer.id;
      }

      if (user.role === 'Admin' && selectedAssignee) {
        updateData.assigneeId = selectedAssignee.id;
      }

      await axios.put(`${API_URL}/tickets/${id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/ticket-details/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error.response?.data?.error || 'Failed to update ticket. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
      <FadeInWrapper>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom align="center">
            Edit Ticket
          </Typography>
          <Paper sx={{ p: 3, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Ticket updated successfully! Redirecting...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Subject */}
                <Grid item xs={12}>
                  <TextField
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    fullWidth
                    disabled={saving}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    disabled={saving}
                  />
                </Grid>

                {/* Priority */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={saving}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      label="Priority"
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={saving}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.replace('_', ' ').charAt(0).toUpperCase() +
                           option.replace('_', ' ').slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Customer */}
                <Grid item xs={12} sm={user.role === 'Admin' ? 6 : 12}>
                  <Autocomplete
                    options={customers}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={selectedCustomer}
                    onChange={(event, newValue) => setSelectedCustomer(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Customer" />
                    )}
                    disabled={saving}
                    fullWidth
                  />
                </Grid>

                {/* Assignee (Admin only) */}
                {user.role === 'Admin' && (
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={assignees}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                      value={selectedAssignee}
                      onChange={(event, newValue) => setSelectedAssignee(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Assignee (Agent)" />
                      )}
                      disabled={saving}
                      fullWidth
                    />
                  </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/ticket-details/${id}`)}
                      disabled={saving}
                      size={isSmallScreen ? 'medium' : 'large'}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      size={isSmallScreen ? 'medium' : 'large'}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </FadeInWrapper>
    </Container>
  );
};

export default withAgentProtection(EditTicketPage);
