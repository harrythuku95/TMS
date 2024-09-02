// src/pages/UserManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpgradeToAgent = async (userId) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/role`, { role: 'Agent' });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error upgrading user to agent:', error);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
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
    </div>
  );
};

export default UserManagementPage;