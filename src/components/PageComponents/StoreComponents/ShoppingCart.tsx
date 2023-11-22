import React from 'react'
import { Stack, Button } from "react-bootstrap";
import { useShoppingCart } from "../../context/ShoppingCartContext.tsx";
import { CartItem } from "./CartItem.tsx";
import { formatCurrency } from "../../utilities/formatCurrency.ts";
import storeItems from "../../data/items.json"
import transportItems from "../../data/TransportItems.json";
import { Link } from 'react-router-dom';
import MinimizeIcon from '@material-ui/icons/Minimize';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart'

type ShoppingCartProps = {
    isOpen: boolean
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen }) => {
    const { closeCart, cartItems, clearCart } = useShoppingCart();
    const storeTotal = cartItems
    .filter((item) => item.type === "store") // Filter store items
    .reduce((total, cartItem) => {
      const item = storeItems.find((i) => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);

  const transportTotal = cartItems
    .filter((item) => item.type === "transport") // Filter transport tickets
    .reduce((total, cartItem) => {
      const item = transportItems.find((i) => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);

  const total = storeTotal + transportTotal;

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '30%',
      height: '100%',
      backgroundColor: '#fff',
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      overflowY: 'auto',
      zIndex: 1000,
      transition: 'transform 0.3s ease-in-out',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    }}>
      <Button onClick={closeCart} style={{ color: 'blue', backgroundColor: 'transparent', boxShadow: 'none' }}> <MinimizeIcon/> </Button>
      <Stack gap={3}>
        {cartItems.map(item => (
            <CartItem key= {item.id} {...item} />
        ))}
        <div className="ms-auto fw-bold fs-5">
        Total {formatCurrency(total)}
        </div>
      </Stack>
      <Button onClick={clearCart} style={{ color: 'blue', backgroundColor: 'transparent', boxShadow: 'none' }}> <RemoveShoppingCart/> </Button>
      <div></div>
      <Link to="/checkout" onClick={closeCart}>
          <button>Checkout</button>
      </Link>
    </div>
  );
}

export default ShoppingCart;
