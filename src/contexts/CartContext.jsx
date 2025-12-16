// If you have a cart system.

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCartItems, addToCartAPI, removeFromCartAPI } from "../services/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems().then((res) => setCartItems(res.data.cart));
  }, []);

  const addToCart = async (item) => {
    const res = await addToCartAPI(item);
    setCartItems((prev) => [...prev, res.data]);
  };

  const removeFromCart = async (id) => {
    await removeFromCartAPI(id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
