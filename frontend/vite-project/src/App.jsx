import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TicketDetailsPage from './pages/TicketDetailsPage';
import TicketListPage from './pages/TicketListPage';
import UserManagementPage from './pages/UserManagementPage';
import SendCloseRequestPage from './pages/SendCloseRequestPage';
import AddCustomerPage from './pages/AddCustomerPage';
import EditCustomerPage from './pages/EditCustomerPage';
import CreateTicketPage from './pages/CreateTicketPage';
import withAdminProtection from './hoc/withAdminProtection';
import withAgentProtection from './hoc/withAgentProtection';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
              <Toolbar />
           {/** <main style={{ flexGrow: 1, padding: '20px' }}>*/} 
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tickets" element={<TicketListPage />} />
                <Route path="/new-ticket" element={<CreateTicketPage />} />
                <Route path="/customers" element={<CustomerManagementPage />} />
                <Route path="/add-customer" element={<AddCustomerPage />} />
                <Route path="/edit-customer/:id" element={<EditCustomerPage />} />
                <Route path="/ticket-details/:id" element={<TicketDetailsPage />} />
                <Route path="/user-management" element={<UserManagementPage />} />
                <Route path="/send-close-request" element={<SendCloseRequestPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            {/**</main> */}
            </Box>
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </Router>
  );
};

export default App;