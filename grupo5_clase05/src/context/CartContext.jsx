import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Lógica para manejar el carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Si el producto ya existe, solo incrementamos la cantidad
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si no existe, lo agregamos con cantidad 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  //Exponer los valores y funciones a los componentes hijos
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    cartTotal: cartItems.reduce((total, item) => total + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para consumir el contexto fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};