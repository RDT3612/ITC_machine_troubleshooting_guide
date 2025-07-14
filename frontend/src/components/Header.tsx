import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <BuildIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Machine Troubleshooting Guide
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Troubleshoot
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/upload"
            variant={location.pathname === '/upload' ? 'outlined' : 'text'}
          >
            Upload Manual
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
