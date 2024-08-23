import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { BrowserRouter as Router } from 'react-router-dom';
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
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets" element={withAgentProtection(<TicketListPage />)} />
            <Route path="/new-ticket" element={withAgentProtection(<CreateTicketPage />)} />
            <Route path="/customers" element={withAdminProtection(<CustomerManagementPage />)} />
            <Route path="/add-customer" element={withAdminProtection(<AddCustomerPage />)} />
            <Route path="/edit-customer/:id" element={withAdminProtection(<EditCustomerPage />)} />
            <Route path="/ticket-details/:id" element={withAgentProtection(<TicketDetailsPage />)} />
            <Route path="/user-management" element={withAdminProtection(<UserManagementPage />)} />
            <Route path="/send-close-request" element={withAgentProtection(<SendCloseRequestPage />)} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
    </AuthProvider>
    </Router>
  );
};

export default App;
