import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery, ThemeProvider} from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TicketDetailsPage from './pages/TicketDetailsPage';
import TicketListPage from './pages/TicketListPage';
import GlobalTicketListPage from './pages/GlobalTicketListPage';
import GlobalTicketDetailsPage from './pages/GlobalTicketDetailsPage';
import UserManagementPage from './pages/UserManagementPage';
import SendCloseRequestPage from './pages/SendCloseRequestPage';
import AddCustomerPage from './pages/AddCustomerPage';
import EditCustomerPage from './pages/EditCustomerPage';
import CreateTicketPage from './pages/CreateTicketPage';
import ProfilePage from './pages/ProfilePage';
import theme from './theme'; 

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Box sx={{ display: 'flex', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <CssBaseline />
            <Navbar handleDrawerToggle={handleDrawerToggle} />
            <Sidebar isMobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 2, sm: 3 },
                width: { xs: '100%', sm: '100%', md: 'calc(100% - 240px)' },
                marginLeft: { xs: 0, sm: 0, md: '240px' },
                marginTop: { xs: '56px', sm: '64px' },
                marginBottom: '80px',
                backgroundColor: theme.palette.background.default,
              }}
            >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tickets" element={<TicketListPage />} />
              <Route path="/global-tickets" element={<GlobalTicketListPage />} />
              <Route path="/new-ticket" element={<CreateTicketPage />} />
              <Route path="/customers" element={<CustomerManagementPage />} />
              <Route path="/add-customer" element={<AddCustomerPage />} />
              <Route path="/edit-customer/:id" element={<EditCustomerPage />} />
              <Route path="/ticket-details/:id" element={<TicketDetailsPage />} />
              <Route path="/global-tickets/:id" element={<GlobalTicketDetailsPage />} />
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/send-close-request" element={<SendCloseRequestPage />} />
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;