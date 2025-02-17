import { createTheme } from '@mui/material/styles';

const magentaTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E100E6',
      light: '#FF33FF',
      dark: '#B000B3',
    },
    secondary: {
      main: 'rgb(88, 3, 60)',  
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '0px',
          background: 'linear-gradient(45deg, #1A1A1A 0%, #2D002E 100%)',
          borderBottom: '1px solid rgba(225, 0, 230, 0.2)',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1A1A1A 0%, #2D002E 100%)',
          borderBottom: '1px solid rgba(225, 0, 230, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '25px',
          background: 'linear-gradient(45deg, #1A1A1A 0%, #2D002E 100%)',
          borderBottom: '1px solid rgba(225, 0, 230, 0.2)',
          width: '500px'
        },
      },        
    },
    MuiInputLabel:{
      styleOverrides: {
        root: {
          fontSize: 16,
          marginTop: '0px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginTop: '25px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg,rgb(233, 10, 159) 0%, #C51162 100%)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(225, 0, 230, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          marginTop: '15px',
          marginLeft: '10px',
          marginRight: '10px',
          background: 'linear-gradient(45deg,rgba(165, 20, 117, 0.72) 0%, #C51162 100%)',
          border: '1px solid rgba(225, 0, 230, 0.1)',
          boxShadow: '0 8px 32px rgba(48, 46, 46, 0.56)',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      textAlign: 'center'
    },
    h4: {
      marginTop: '40px',
      marginLeft: '10px',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      textAlign: 'center'
    },
  },
});

export default magentaTheme;