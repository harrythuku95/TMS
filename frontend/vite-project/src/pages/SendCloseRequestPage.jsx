import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Grid, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const SendCloseRequestPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/close-request`, {
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
    <FadeInWrapper>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Send Close Request
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Ticket ID"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={{ xs: true, sm: false }}
                size={isSmallScreen ? 'medium' : 'large'}
              >
                Send Request
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </FadeInWrapper>
  );
};

export default SendCloseRequestPage;