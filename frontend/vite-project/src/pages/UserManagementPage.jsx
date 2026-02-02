import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      console.log('API response:', response.data);

      if (response.data && Array.isArray(response.data.rows)) {
        setUsers(response.data.rows);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Unexpected data format received from the server.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setError(null);
      await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setSuccessMessage(`User successfully updated to ${newRole}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(`Failed to update user: ${error.response?.data?.error || error.message}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'Admin') return theme.palette.custom.roleAdmin;
    if (role === 'Agent') return theme.palette.custom.roleAgent;
    return theme.palette.custom.roleUser;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, sm: 6 } }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <FadeInWrapper>
      <Container maxWidth="lg">
        <Box sx={{ mt: { xs: 2, sm: 4 }, mb: 3 }}>
          <Typography variant="h4">User Management</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        {users.length > 0 ? (
          isSmallScreen ? (
            <Grid container spacing={2}>
              {users.map((user, index) => (
                <Grid item xs={12} key={user.id}>
                  <Card
                    sx={{
                      animation: 'fadeInUp 500ms ease-in-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {`${user.firstName || ''} ${user.lastName || ''}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Email:</strong> {user.email || 'N/A'}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={user.role || 'N/A'}
                          size="small"
                          sx={{
                            backgroundColor: getRoleBadgeColor(user.role),
                            color: '#ffffff',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      {updatingUserId === user.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          {user.role === 'User' && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleUpdateRole(user.id, 'Agent')}
                            >
                              Upgrade to Agent
                            </Button>
                          )}
                          {user.role === 'Agent' && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => handleUpdateRole(user.id, 'Admin')}
                            >
                              Upgrade to Admin
                            </Button>
                          )}
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{`${user.firstName || ''} ${user.lastName || ''}`}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role || 'N/A'}
                          size="small"
                          sx={{
                            backgroundColor: getRoleBadgeColor(user.role),
                            color: '#ffffff',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {updatingUserId === user.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <>
                            {user.role === 'User' && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleUpdateRole(user.id, 'Agent')}
                                sx={{ mr: 1 }}
                              >
                                Upgrade to Agent
                              </Button>
                            )}
                            {user.role === 'Agent' && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => handleUpdateRole(user.id, 'Admin')}
                              >
                                Upgrade to Admin
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        ) : (
          <Typography>No users found.</Typography>
        )}
      </Container>
    </FadeInWrapper>
  );
};

export default withAdminProtection(UserManagementPage);
