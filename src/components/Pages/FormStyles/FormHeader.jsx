import React from 'react';
import { AppBar, Toolbar, Box, Button} from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import HeaderStyles from './HeaderStyles'; // Import the new styles

const Header = () => {
  const classes = HeaderStyles();

  const handleHomeClick = () => 
  {
    console.log('Home button clicked');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Button component={Link} to="/" aria-label="home" className={classes.homeButton} onClick={handleHomeClick}>Home</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;