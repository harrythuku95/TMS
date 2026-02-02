import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: 8,

  // Enterprise Blue-Grey Palette
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    // Semantic colors for ticket system
    custom: {
      // Priority colors
      priorityHigh: '#d32f2f',
      priorityMedium: '#ed6c02',
      priorityLow: '#2e7d32',
      // Status colors
      statusPending: '#ed6c02',
      statusInProgress: '#1976d2',
      statusResolved: '#2e7d32',
      statusClosed: '#757575',
      // Role colors
      roleAdmin: '#d32f2f',
      roleAgent: '#1976d2',
      roleUser: '#757575',
      // Dark sidebar
      sidebarBg: '#1e1e1e',
      sidebarText: '#e0e0e0',
      sidebarActive: '#1976d2',
    },
  },

  // Responsive Typography System
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '0.9375rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  // Transitions Configuration
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  // Shadows - Softer and more subtle
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 14px 28px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.2)',
    '0px 18px 36px rgba(0,0,0,0.22)',
    '0px 20px 40px rgba(0,0,0,0.24)',
    '0px 22px 44px rgba(0,0,0,0.26)',
    '0px 24px 48px rgba(0,0,0,0.28)',
    '0px 26px 52px rgba(0,0,0,0.3)',
    '0px 28px 56px rgba(0,0,0,0.32)',
    '0px 30px 60px rgba(0,0,0,0.34)',
    '0px 32px 64px rgba(0,0,0,0.36)',
    '0px 34px 68px rgba(0,0,0,0.38)',
    '0px 36px 72px rgba(0,0,0,0.4)',
    '0px 38px 76px rgba(0,0,0,0.42)',
    '0px 40px 80px rgba(0,0,0,0.44)',
    '0px 42px 84px rgba(0,0,0,0.46)',
    '0px 44px 88px rgba(0,0,0,0.48)',
    '0px 46px 92px rgba(0,0,0,0.5)',
    '0px 48px 96px rgba(0,0,0,0.52)',
  ],

  // Component Overrides
  components: {
    // Button Styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.3)',
          },
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
        },
      },
    },

    // Card Styling
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },

    // Paper Styling
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
        },
      },
    },

    // AppBar Styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#212121',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },

    // Drawer (Sidebar) Styling
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
          color: '#e0e0e0',
          borderRight: 'none',
        },
      },
    },

    // List Item Styling (for sidebar)
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            borderLeft: '4px solid #1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.25)',
            },
          },
        },
      },
    },

    // List Item Button
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            borderLeft: '4px solid #1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.25)',
            },
          },
        },
      },
    },

    // Table Styling
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#212121',
          borderBottom: '2px solid #e0e0e0',
        },
        root: {
          borderBottom: '1px solid #f0f0f0',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 200ms ease-in-out',
          '&:hover': {
            backgroundColor: '#fafafa',
          },
        },
      },
    },

    // TextField Styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 300ms ease-in-out',
            '&:hover': {
              '& > fieldset': {
                borderColor: '#1976d2',
              },
            },
            '&.Mui-focused': {
              '& > fieldset': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    // Chip Styling (for badges)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        filled: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },

    // Icon Button Styling
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },

    // TableContainer for responsive scroll
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&::-webkit-scrollbar': {
            height: 8,
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#9e9e9e',
            },
          },
        },
      },
    },
  },
});

export default theme;
