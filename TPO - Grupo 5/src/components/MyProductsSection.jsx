import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyProducts.css";
import { listMyProducts, deleteProduct } from "../services/productsApi";

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <div className="my-product">
      <div className="my-product__thumb">
        <img src={product.image || "/api/placeholder/150/150"} alt={product.name} />
      </div>

      <div className="my-product__info">
        <h3 className="my-product__name">{product.name}</h3>
        <p className="my-product__desc">{product.description}</p>
      </div>

      <div className="my-product__price">${product.price}</div>
      <div className="my-product__stock">{product.stock}</div>

      <div className="my-product__actions">
        <button onClick={() => onEdit(product.id)} className="btn-secondary">Editar</button>
        <button onClick={() => onDelete(product.id)} className="btn-danger">Eliminar</button>
      </div>
    </div>
  );
}

export default function MyProductsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await listMyProducts();
      setProducts(data);
    } catch (e) {
      setErr(e.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (id) => navigate(`/my-products/${id}/edit`);
  const handleDelete = async (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    const prev = products;
    setProducts(products.filter((x) => x.id !== id));
    try { await deleteProduct(id); }
    catch (e) { alert("No se pudo eliminar. Se revierte."); setProducts(prev); }
  };

  return (
    <section className="my-products">
      <div className="my-products__container">
        <div className="my-products__header">
          <h1 className="my-products__name">Mis Productos</h1>
          <button className="btn-primary" onClick={() => navigate("/my-products/new")}>
            + Nuevo Producto
          </button>
        </div>

        <div className="my-products__list-header">
          <div className="my-products__col--img">Imagen</div>
          <div className="my-products__col--name">Título</div>
          <div className="my-products__col--price">Precio</div>
          <div className="my-products__col--stock">Stock</div>
          <div className="my-products__col--actions">Acciones</div>
        </div>

        {loading && <div className="my-product">Cargando…</div>}
        {err && <div className="my-product" style={{ color: "#dc2626" }}>{err}</div>}

        {!loading && !err && products.map((product) => (
          <ProductRow key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {!loading && !err && products.length === 0 && <div className="my-product">No hay productos.</div>}
      </div>
    </section>
  );
}
