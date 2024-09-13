import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Create Ticket', icon: <AddIcon />, path: '/new-ticket', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Add Customer', icon: <AddIcon />, path: '/add-customer', roles: ['Admin', 'Agent'] },
    { title: 'Customers', icon: <PeopleIcon />, path: '/customers', roles: ['Admin', 'Agent'] },
    { title: 'User Management', icon: <SupervisorAccountIcon />, path: '/user-management', roles: ['Admin'] },
  ];

  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          item.roles.includes(user.role) && (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.title}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          )
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;