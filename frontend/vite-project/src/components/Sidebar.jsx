import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Box, Typography, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = ({ isMobileOpen, handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['Admin', 'Agent', 'User'] },
    { title: 'My Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets', roles: ['Admin', 'Agent', 'User'] },
    { title: 'All Tickets', icon: <ConfirmationNumberIcon />, path: '/global-tickets', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Create Ticket', icon: <AddIcon />, path: '/new-ticket', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Add Customer', icon: <AddIcon />, path: '/add-customer', roles: ['Admin', 'Agent'] },
    { title: 'Customers', icon: <PeopleIcon />, path: '/customers', roles: ['Admin', 'Agent'] },
    { title: 'User Management', icon: <SupervisorAccountIcon />, path: '/user-management', roles: ['Admin'] },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, textAlign: 'left', mt: 1 }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: theme.palette.custom.sidebarText,
            paddingLeft: '8px',
            fontWeight: 700,
          }}
        >
          Thresh0ld TMS
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          user && item.roles.includes(user.role) && (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.title}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon sx={{ color: theme.palette.custom.sidebarText }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} sx={{ color: theme.palette.custom.sidebarText }} />
            </ListItem>
          )
        ))}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ px: 1, pb: 2 }}>
        {user ? (
          <>
            <ListItem button component={Link} to="/profile">
              <ListItemIcon sx={{ color: theme.palette.custom.sidebarText }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" sx={{ color: theme.palette.custom.sidebarText }} />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemIcon sx={{ color: theme.palette.custom.sidebarText }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: theme.palette.custom.sidebarText }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon sx={{ color: theme.palette.custom.sidebarText }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Login" sx={{ color: theme.palette.custom.sidebarText }} />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemIcon sx={{ color: theme.palette.custom.sidebarText }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Signup" sx={{ color: theme.palette.custom.sidebarText }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isMobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            top: 0,
            height: '100%',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;