// src/context/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const toggleCart = () => setIsOpen(open => !open);


  const addItem = product =>
    setItems(curr => {
      const idx = curr.findIndex(i => i.id === product.id);
      if (idx > -1) {
        const copy = [...curr];
        copy[idx].quantity++;
        return copy;
      }
      return [...curr, { ...product, quantity: 1 }];
    });

  const removeItem = productId =>
    setItems(curr => curr.filter(i => i.id !== productId));

  return (
    <CartContext.Provider value={{
      isOpen, toggleCart,
      items, addItem, removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
