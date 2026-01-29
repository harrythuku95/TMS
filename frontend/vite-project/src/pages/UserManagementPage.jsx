import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';

const API_URL = import.meta.env.VITE_API_URL;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

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

  if (loading) {
    return (
      <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>User Management</Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }} onClose={() => setError(null)}>
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName || ''} ${user.lastName || ''}`}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      fontWeight: 'bold',
                      color: user.role === 'Admin' ? '#d32f2f' : user.role === 'Agent' ? '#1976d2' : '#757575'
                    }}
                  >
                    {user.role || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {updatingUserId === user.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      {user.role === 'User' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleUpdateRole(user.id, 'Agent')}
                          style={{ marginRight: '8px' }}
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
      ) : (
        <Typography>No users found.</Typography>
      )}
    </Container>
  );
};

export default withAdminProtection(UserManagementPage);