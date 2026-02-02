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
        width: { xs: '100%', md: 'calc(100% - 240px)' },
        ml: { xs: 0, md: '240px' },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          {user ? (
            <>
              <Button
                component={Link}
                to="/profile"
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                Profile
              </Button>
              <Button
                onClick={logout}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
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