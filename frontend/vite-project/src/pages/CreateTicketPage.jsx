// src/pages/CreateTicketPage.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography, Box, MenuItem, Select, InputLabel, FormControl, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';

const CreateTicketPage = () => {
  const [ticketName, setTicketName] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('pending');
  const [files, setFiles] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user.role === 'Admin' || user.role === 'Agent') {
      fetchCustomers();
    }
  }, [user.role]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/customers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setCustomerOptions(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ticketName', ticketName);
    formData.append('subject', subject);
    formData.append('priority', priority);
    formData.append('description', description);
    
    // Only append customer and status if user is Admin or Agent
    if (user.role === 'Admin' || user.role === 'Agent') {
      formData.append('customer', customer);
      formData.append('status', status);
    } else {
      formData.append('status', 'pending');
    }

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8080/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.status === 200) {
        alert('Ticket created successfully!');
        navigate('/tickets');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating ticket.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom align="center">Create Ticket</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', mt: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Ticket Name"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {(user.role === 'Admin' || user.role === 'Agent') && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={customerOptions}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer"
                        required
                        fullWidth
                      />
                    )}
                    onChange={(event, newValue) => {
                      setCustomer(newValue ? newValue.id : '');
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Ticket
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateTicketPage;