import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home as HomeIcon, List as ListIcon, People as PeopleIcon, Add as AddIcon, ExitToApp as ExitToAppIcon, PersonAdd as PersonAddIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/tickets">
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Tickets" />
        </ListItem>
        {user && user.role === 'Admin' && (
          <>
            <ListItem button component={Link} to="/customers">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button component={Link} to="/add-customer">
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Add Customer" />
            </ListItem>
            <ListItem button component={Link} to="/user-management">
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
          </>
        )}
        {!user ? (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon><LockOpenIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Signup" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
