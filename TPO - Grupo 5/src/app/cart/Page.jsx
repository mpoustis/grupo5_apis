import "../../styles/Cart.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useCart } from "../../contexts/cart-contexts";
import { getProduct, updateProduct } from "../../services/productsApi";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  const handleQty = (id, delta) => {
    const item = items.find((i) => i.id === id);
    const next = (item?.quantity || 0) + delta;
    updateQuantity(id, next);
  };

  async function handleCheckout() {
    // Validar stock
    for (const item of items) {
      const p = await getProduct(item.id);
      if (!p || p.stock < item.quantity) {
        alert(`Sin stock suficiente para: ${item.title || item.name}`);
        return;
      }
    }
    // Descontar stock
    for (const item of items) {
      const p = await getProduct(item.id);
      await updateProduct(item.id, { stock: p.stock - item.quantity });
    }
    alert("Checkout exitoso. El stock fue actualizado.");
    clearCart();
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="cart-container headerFit">
          <h2>Tu carrito está vacío</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="cart-container headerFit">
        <section className="cart-items">
          {items.map((it) => (
            <article className="cart-item" key={it.id}>
              <img src={it.image} alt={it.title || it.name} />
              <div className="info">
                <h3>{it.title || it.name}</h3>
                <p>Precio: ${Number(it.price).toFixed(2)}</p>
                <div className="qty">
                  <button onClick={() => handleQty(it.id, -1)}>-</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => handleQty(it.id, +1)}>+</button>
                </div>
                <button className="remove" onClick={() => removeFromCart(it.id)}>Eliminar</button>
              </div>
              <div className="subtotal">${(Number(it.price) * it.quantity).toFixed(2)}</div>
            </article>
          ))}
          <button className="clear" onClick={clearCart}>Vaciar carrito</button>
        </section>

        <aside className="cart-summary">
          <h3>Resumen</h3>
          <div className="row">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <button className="checkout" onClick={handleCheckout}>Comprar</button>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
