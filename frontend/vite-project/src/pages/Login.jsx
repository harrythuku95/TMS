import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Grid, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import FadeInWrapper from '../components/FadeInWrapper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 4, sm: 6, md: 8 },
        mb: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 }
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
              p: { xs: 3, sm: 4, md: 5 }
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
                  mb: 3,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                Login
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
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.trim())}
                      required
                      fullWidth
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
                      sx={{
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9375rem', sm: '1rem' },
                        fontWeight: 600,
                        mt: 1,
                      }}
                    >
                      Login
                    </Button>
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

export default Login;