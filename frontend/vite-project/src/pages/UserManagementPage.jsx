import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setUsers(response.data.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
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
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>User Management</Typography>
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
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
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
    </Container>
  );
};

export default withAdminProtection(UserManagementPage);