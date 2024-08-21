import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import withAdminProtection from '../hoc/withAdminProtection';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/add-user')}
            >
              Add New User
            </Button>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={users} columns={columns} pageSize={5} />
          </div>
        </Paper>
      </Box>
    </Container>
  );
};

export default withAdminProtection(UserManagementPage);
