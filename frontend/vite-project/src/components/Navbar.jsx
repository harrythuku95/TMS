import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { xs: '100%', sm: '100%', md: 'calc(100% - 240px)', lg: 'calc(100% - 240px)', xl: 'calc(100% - 240px)' },
        ml: { xs: 0, sm: 0, md: '240px', lg: '240px', xl: '240px' },
        backgroundColor: theme.palette.custom.purple,
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/user-management"
                sx={{ 
                  backgroundColor: 'transparent', 
                  '&:hover': { backgroundColor: theme.palette.custom.dark }
                }}
              >
                Profile
              </Button>
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{ 
                  backgroundColor: 'transparent', 
                  '&:hover': { backgroundColor: theme.palette.custom.dark }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  backgroundColor: 'transparent', 
                  '&:hover': { backgroundColor: theme.palette.custom.dark }
                }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/signup"
                sx={{ 
                  backgroundColor: 'transparent', 
                  '&:hover': { backgroundColor: theme.palette.custom.dark }
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;