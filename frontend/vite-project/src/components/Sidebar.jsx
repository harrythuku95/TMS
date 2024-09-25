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
    { title: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Create Ticket', icon: <AddIcon />, path: '/new-ticket', roles: ['Admin', 'Agent', 'User'] },
    { title: 'Add Customer', icon: <AddIcon />, path: '/add-customer', roles: ['Admin', 'Agent'] },
    { title: 'Customers', icon: <PeopleIcon />, path: '/customers', roles: ['Admin', 'Agent'] },
    { title: 'User Management', icon: <SupervisorAccountIcon />, path: '/user-management', roles: ['Admin'] },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.palette.custom.dark }}>
      <Box sx={{ p: 2, textAlign: 'left' }}>
        <Typography variant="h4" component={Link} to="/" sx={{ textDecoration: 'none', color: theme.palette.custom.white, paddingLeft: '8px' }}>
          Thresh0ld TMS
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          user && item.roles.includes(user.role) && (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.title}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.custom.purple,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.custom.white }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} sx={{ color: theme.palette.custom.white }} />
            </ListItem>
          )
        ))}
      </List>
      <Divider sx={{ bgcolor: theme.palette.custom.light }} />
      <List>
        {user ? (
          <>
            <ListItem button component={Link} to="/profile" sx={{ '&:hover': { backgroundColor: theme.palette.custom.purple } }}>
              <ListItemIcon sx={{ color: theme.palette.custom.white }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" sx={{ color: theme.palette.custom.white }} />
            </ListItem>
            <ListItem button onClick={logout} sx={{ '&:hover': { backgroundColor: theme.palette.custom.purple } }}>
              <ListItemIcon sx={{ color: theme.palette.custom.white }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: theme.palette.custom.white }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" sx={{ '&:hover': { backgroundColor: theme.palette.custom.purple } }}>
              <ListItemIcon sx={{ color: theme.palette.custom.white }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Login" sx={{ color: theme.palette.custom.white }} />
            </ListItem>
            <ListItem button component={Link} to="/signup" sx={{ '&:hover': { backgroundColor: theme.palette.custom.purple } }}>
              <ListItemIcon sx={{ color: theme.palette.custom.white }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Signup" sx={{ color: theme.palette.custom.white }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' }, color: theme.palette.custom.white }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isMobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            top: 0,
            height: '100%',
            backgroundColor: theme.palette.custom.dark,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;