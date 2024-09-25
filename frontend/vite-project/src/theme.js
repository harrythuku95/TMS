import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: 8,
  palette: {
    custom: {
      white: '#ffffff',
      grey: '#EBD3F8',
      light: '#AD49E1',
      purple: '#7A1CAC',
      dark: '#2E073F'
    },
    background: {
      default: '#EBD3F8', 
    },
    text: {
      primary: '#2E073F', 
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#AD49E1', 
          color: '#ffffff', 
          '&:hover': {
            backgroundColor: '#7A1CAC',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7A1CAC',
        },
      },
    },
  },
});

export default theme;
