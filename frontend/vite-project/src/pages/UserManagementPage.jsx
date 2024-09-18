import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/users', {
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

  const handleUpgradeToAgent = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/role`, { role: 'Agent' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error upgrading user to agent:', error);
      setError('Failed to upgrade user. Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>User Management</Typography>
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
                <TableCell>{user.role || 'N/A'}</TableCell>
                <TableCell>
                  {user.role === 'User' && (
                    <Button onClick={() => handleUpgradeToAgent(user.id)}>
                      Upgrade to Agent
                    </Button>
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