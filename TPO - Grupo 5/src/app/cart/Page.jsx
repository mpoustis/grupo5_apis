import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/Cart.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useCart } from "../../contexts/cart-contexts";
import { createOrder } from "../../services/ordersApi"; 

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
    const navigate = useNavigate();
    
    // **NUEVOS ESTADOS para el checkout**
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleQty = (id, delta) => {
        const item = items.find((i) => i.id === id);
        const next = (item?.quantity || 0) + delta;
        updateQuantity(id, next);
    };

    async function handleCheckout() {
        if (isProcessing || items.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {

            const createdOrder = await createOrder(items); 

            console.log("Orden creada exitosamente. ID:", createdOrder.id);
            
            clearCart(); 

            navigate(`/my-orders`); 
            
        } catch (e) {
            console.error("Error durante el checkout:", e);
            setError(e.message || "No se pudo completar la compra. Intente de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="cart-container headerFit emptycart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 17h-11v-14h-2" />
                        <path d="M6 5l14 1l-1 7h-13" />
                    </svg>
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
                    <button className="clear" onClick={clearCart} disabled={isProcessing}>Vaciar carrito</button>
                </section>

                <aside className="cart-summary">
                    <h3>Resumen</h3>
                    <div className="row">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                    </div>

                    {error && <p style={{ color: '#dc2626', margin: '10px 0', fontWeight: 'bold' }}>{error}</p>}

                    <button 
                        className="checkout" 
                        onClick={handleCheckout}
                        disabled={isProcessing || items.length === 0} 
                    >
                        {isProcessing ? "Procesando..." : "Comprar"}
                    </button>
                </aside>
            </main>
            <Footer />
        </div>
    );
}