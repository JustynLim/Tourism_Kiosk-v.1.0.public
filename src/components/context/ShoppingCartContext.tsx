// Cart summary tab
import React from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../PageComponents/StoreComponents/ShoppingCart.tsx";
import {SelectedPlaceContext} from '../PlaceDetails/SelectedPlaceContext.js';

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
  type: string; // Add a type property to distinguish between different item types
  selectedPlace: string; // Add any other common properties for all item types
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number, type: string) => number; // Add the 'type' parameter
  IncreaseCartQuantity: (id: number, type: string, selectedPlace: string) => void; // Add the 'type' parameter
  DecreaseCartQuantity: (id: number, type: string, selectedPlace: string) => void; // Add the 'type' parameter
  removeFromCart: (id: number, type: string, selectedPlace: string) => void; // Add the 'type' parameter
  clearCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number, type: string) {
    return cartItems
      .filter((item) => item.type === type)
      .find((item) => item.id === id)?.quantity || 0;
  }

  function IncreaseCartQuantity(id: number, type: string, selectedPlace: string) {
    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id && item.type === type);

      if (!existingItem) {
        // If the item doesn't exist in the cart, add it with quantity 1
        return [...currItems, { id, quantity: 1, type, selectedPlace }];
      } else {
        // If the item already exists, increase its quantity
        console.log('Selected place:', selectedPlace); //Checking whether place name is passed down
        return currItems.map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    });
  }

  function DecreaseCartQuantity(id: number, type: string, selectedPlace: string) {
    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id && item.type === type);

      if (existingItem && existingItem.quantity === 1) {
        // If the item exists with quantity 1, remove it from the cart
        return currItems.filter((item) => !(item.id === id && item.type === type));
      } else {
        // If the item exists with quantity > 1, decrease its quantity
        return currItems.map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  }

  function removeFromCart(id: number, type: string, selectedPlace: string) {
    setCartItems((currItems) =>
      currItems.filter((item) => !(item.id === id && item.type === type))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        IncreaseCartQuantity,
        DecreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        clearCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
 export default ShoppingCartProvider;