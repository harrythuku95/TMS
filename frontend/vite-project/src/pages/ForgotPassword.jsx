import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FadeInWrapper from '../components/FadeInWrapper';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 4, sm: 6, md: 8 },
        mb: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <FadeInWrapper>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                Forgot Password
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                sx={{ mb: 3 }}
              >
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    width: '100%',
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  If an account exists with this email, a password reset link has been sent. Please check your inbox.
                </Alert>
              )}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: '100%' }}
              >
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      autoFocus
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 300ms ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 4px 8px rgba(25, 118, 210, 0.15)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size={isMobile ? 'medium' : 'large'}
                      disabled={loading}
                      sx={{
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9375rem', sm: '1rem' },
                        fontWeight: 600,
                        mt: 1,
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Link
                        onClick={() => navigate('/login')}
                        sx={{
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Back to Login
                      </Link>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </FadeInWrapper>
    </Container>
  );
};

export default ForgotPassword;
