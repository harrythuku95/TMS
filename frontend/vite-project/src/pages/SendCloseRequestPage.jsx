import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendCloseRequestPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/close-request', {
        ticketId,
        reason,
      });

      if (response.status === 200) {
        setSuccess('Close request sent successfully');
        setTimeout(() => {
          navigate('/tickets');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to send close request');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Send Close Request
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <TextField
          label="Ticket ID"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          fullWidth
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Request
        </Button>
      </Box>
    </Container>
  );
};

export default SendCloseRequestPage;
