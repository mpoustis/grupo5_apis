import { useCart } from './context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <div className="cart-container">
      <h2>Tu Carrito ({cartTotal})</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <span>{item.title}</span>
                <span>Cantidad: {item.quantity}</span>
              </div>
              <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;