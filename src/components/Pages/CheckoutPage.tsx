// Checkout page
import React, {useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext.tsx';
import { CartItem } from '../PageComponents/StoreComponents/CartItem.tsx';
import { formatCurrency } from '../utilities/formatCurrency.ts';
import storeItems from '../data/items.json';
import transportItems from '../data/TransportItems.json';
import { Button, Modal } from 'react-bootstrap';
import Navbar from '../PageComponents/DashboardComponents/Navbar.tsx'
import { checkUserAuthentication } from '../utilities/authUtils.js';
import axios from 'axios';
import { SelectedPlaceContext } from "../PlaceDetails/SelectedPlaceContext.js";

const Checkout = () => {
  const { cartItems, clearCart } = useShoppingCart(); // Added clearCart function to clear the cart after successful payment
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const selectedPlace = useContext(SelectedPlaceContext);
  
  const handlePayment = async () => {
    const isAuthenticated = checkUserAuthentication();

    if (!isAuthenticated) {
      // Redirect to the login page
      navigate('/login');
      return;
    }

    try {
      console.log('Selected place:', selectedPlace); //Checking whether place name is passed down
      const response = await axios.post(
        'http://localhost:4000/checkout/',
        { 
          cart_items: cartItems, 
          place_name: selectedPlace.selectedPlace,
        }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
    
      // Handle the response as needed
      console.log('Checkout response:', response.data);

      selectedPlace.setPlace('Transport ticket')
      console.log('Latest ticket state:',selectedPlace)

      // Clear the cart after successful payment
      clearCart();

      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };
  

  return (
    <div >
      <Navbar />
      <h1></h1>
      {cartItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(1.5)', marginTop: '100px' }}>
          <div>
            {cartItems.map((item) => (
              <CartItem key={item.id} quantity={item.quantity} id={item.id} type={item.type} />
              ))}
          </div>
          <div className="ms-auto fw-bold fs-5">
            Total {formatCurrency(
            cartItems.reduce((total, cartItem) => {
              const item = cartItem.type === 'store'
                ? storeItems.find((i) => i.id === cartItem.id)
                : transportItems.find((i) => i.id === cartItem.id);

              return total + (item?.price || 0) * cartItem.quantity;
            }, 0)
          )}
          </div>
          <Button
            onClick={handlePayment}
            style={{ width: "6rem", height: "2.5rem" }}
            variant="primary"
          >
            Pay
          </Button>
        </div>
      ) : (
        <p></p>
        // <p>Your cart is empty.</p>
      )}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        {/* <Modal.Header closeButton>
          <Modal.Title>Payment Successful!</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          Payment successfull. Thank you for your purchase!
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Return to dashboard
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to homepage
        </Button>
          {/* <Button variant="primary" onClick={handleClosePaymentModal}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;