import React, { useState } from 'react';
import { Button,Container,Nav,Navbar as NavbarBs} from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useShoppingCart } from '../../context/ShoppingCartContext.tsx';
import  makeStyles, { summarybuttonStyle } from '../StoreComponents/Navbar_styles.js';
import '../Minigame/Minigame.css'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';

const Navbar = () =>
{
    const classes = makeStyles();
    const { openCart, cartQuantity } = useShoppingCart()
    
    const navigate = useNavigate();
    // const [isCartOpen, setIsCartOpen] = useState(false);

    const handleLogout = async () => 
    {
      try 
      {
        // Make a POST request to the logout endpoint
        const response = await fetch('http://localhost:4000/api/user/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
  
        // Check if logout was successful
        if (response.ok) 
        {
          localStorage.removeItem('access_token');  // Clear user data from local storage
          navigate('/');                            // Redirect to the homepage
        } 
        else 
        {
          console.error('Logout failed:', response.statusText);
        }
  
      } 
      catch (error) 
      {
        console.error('Error during logout:', error);
      }
    };

    return (
    <>
    <NavbarBs sticky="top" className = {classes.navbar}>
        <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Nav className= "me-auto">
                <Nav.Link to="/" as={NavLink}>
                    <Button className = {classes.button}>
                    Home
                    </Button>
                </Nav.Link>

                {/* <Nav.Link to="/store" as={NavLink}>
                    <Button className = {classes.button}>
                    Store
                    </Button>
                </Nav.Link> */}

                <Nav.Link to="/transport-tickets" as={NavLink}>
                    <Button className = {classes.button}>
                    Buy Transport Tickets
                    </Button>
                </Nav.Link>

                <Nav.Link to="/dashboard" as={NavLink}>
                    <Button className = {classes.button}>
                    Dashboard
                    </Button>
                </Nav.Link>
              
                <Button onClick={handleLogout} style={{ color: 'white', backgroundColor: 'transparent', boxShadow: 'none' }}> <ExitToAppIcon /> </Button>
      </Nav>
                {cartQuantity > 0 && (
                            // <Button onClick={openCart} style={{color: 'black', backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <Button onClick={openCart} style={{...summarybuttonStyle}}><AddShoppingCart />{cartQuantity}</Button>
                        )}
        </div>                
                       
        </Container>
    </NavbarBs>
    {/* <ShoppingCart isOpen={isCartOpen} /> */}
    </>
    );
}

export default Navbar;