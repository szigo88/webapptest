import { useState } from 'react'
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({  }) => ({
    background: 'linear-gradient(45deg,rgba(182, 27, 135, 0.99) 0%,rgb(61, 38, 50) 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  }));
  
  const NavButton = styled(Button)<{ component: typeof Link; to: string }>({
      color: 'white',
      fontWeight: 750,
      margin: '0 20px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        background: 'rgba(255,255,255,0.1)',
      },
    });
  
  const NavBar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
    return (
      <StyledAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            letterSpacing: '0px',
            background: 'linear-gradient(45deg, #fff 30%,rgb(253, 254, 255) 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            WEBAPP
          </Typography>
  
          {isMobile ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MenuIcon sx={{ color: 'white' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    background: 'rgba(44,62,80,0.97)',
                    minWidth: '200px',
                  }
                }}
              >
                <MenuItem 
                  component={Link} 
                  to="/"
                  sx={{ color: 'white', '&:hover': { background: 'rgb(255, 255, 255)' } }}
                >
                </MenuItem>
                {/* További menüpontok... */}
              </Menu>
            </>
          ) : (
            <div>
              <NavButton component={Link} to="/">Prémium Vállalatok</NavButton>
              <NavButton component={Link} to="/add-device">Eszközök hozzáadása</NavButton>
              <NavButton component={Link} to="/update-class">Besorolás Módosítás</NavButton>
            </div>
          )}
        </Toolbar>
      </StyledAppBar>
    );
  };
  
  export default NavBar