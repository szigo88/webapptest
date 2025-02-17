import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ 
      backgroundColor: 'black',
      padding: '0.1rem', 
      textAlign: 'center', 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
      borderTop: '1px solid #e0e0e0' 
    }}>
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} WebAppTeszt @ Szigeti T
      </Typography>
    </Box>
  );
};

export default Footer;
