import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyOrders.css";
import { listMyOrders } from "../services/ordersApi";


function OrderItemRow({ order, onDetails }) {
    const totalItems = order.items
        ? order.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    const normalizedStatus = (order.status || '').toUpperCase();

    const formatStatus = (status) => {
        if (!status) return "Desconocido";
        const lower = status.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    return (
        <div className="my-order-row" onClick={() => onDetails && onDetails(order.id)} style={{cursor: 'pointer'}}>
            
            <div className="my-order-row__thumb">
                {normalizedStatus === "DELIVERED" && <span title="Entregado">✅</span>}
                {normalizedStatus === "SHIPPED" && <span title="Enviado">🚚</span>}
                {normalizedStatus === "PENDING" && <span title="Pendiente">⏳</span>}
                {!normalizedStatus && <span>📦</span>}
            </div>

            <div className="my-order-row__info">
                <h3 className="my-order-row__id">Orden <strong>#{order.id}</strong></h3>
                <p className="my-order-row__status">
                    Estado: <span style={{ fontWeight: 'bold' }}>{formatStatus(order.status)}</span>
                </p>
            </div>

            <div className="my-order-row__total-amount">
                $<strong>{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</strong>
            </div>

            <div className="my-order-row__total-items">
                <strong>{totalItems}</strong> art.
            </div>
            
            <div className="my-order-row__actions">
                <button onClick={(e) => { e.stopPropagation(); onDetails(order.id); }}>Ver Detalles</button>
            </div>

        </div>
    );
}

export default function MyOrdersSection() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await listMyOrders(); 
      setOrders(data); 
    } catch (e) {
      setErr(e.message || "Error cargando órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewDetails = (id) => navigate(`/my-orders/${id}`); 


  return (
    <section className="my-orders"> 
      <div className="my-orders__container">
        <div className="my-orders__header">
          <h1 className="my-orders__name"> Mis Órdenes</h1>
        </div>

        <div className="my-orders__list-header">
          <div className="my-orders__col--status">Estado</div>
          <div className="my-orders__col--id">Orden ID</div>
          <div className="my-orders__col--total">Monto Total</div>
          <div className="my-orders__col--items">Artículos</div>
          <div className="my-orders__col--actions">Acciones</div>
        </div>

        {loading && <div className="my-order-row">Cargando órdenes...</div>}
        {err && <div className="my-order-row" style={{ color: "#dc2626" }}>{err}</div>}

        {!loading && !err && orders.map((order) => (
          <OrderItemRow 
            key={order.id} 
            order={order} 
            onDetails={handleViewDetails}
          />
        ))}

        {!loading && !err && orders.length === 0 && <div className="my-order-row">No tienes órdenes aún.</div>}
      </div>
    </section>
  );
}