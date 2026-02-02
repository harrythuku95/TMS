import React, { useState, useEffect } from 'react';
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
  TableContainer,
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';
import FadeInWrapper from '../components/FadeInWrapper';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const [userTickets, setUserTickets] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user && user.id) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/tickets?createdBy=${user.id}`);
      console.log('User tickets response:', response);
      setUserTickets(response.data.rows);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/ticket-details/${id}`);
  };

  return (
    <FadeInWrapper>
      <Container maxWidth="lg">
        <Box sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom>User Profile</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={logout}
              sx={{ mt: 2 }}
              size={isSmallScreen ? 'medium' : 'large'}
            >
              Logout
            </Button>
          </Card>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Your Tickets
          </Typography>

          {isSmallScreen ? (
            <Grid container spacing={2}>
              {userTickets.map((ticket, index) => (
                <Grid item xs={12} key={ticket.id}>
                  <Card
                    sx={{
                      animation: 'fadeInUp 500ms ease-in-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {ticket.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(ticket.id)}
                        size="small"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewDetails(ticket.id)}
                          size="small"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </FadeInWrapper>
  );
};

export default ProfilePage;
