import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/MyProducts.css";

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <div className="my-product">
      <div className="my-product__thumb">
        <img
          src={product.image || "/api/placeholder/150/150"}
          alt={product.title}
        />
      </div>

      <div className="my-product__info">
        <h3 className="my-product__title">{product.title}</h3>
        <p className="my-product__desc">{product.description}</p>
      </div>

      <div className="my-product__price">${product.price}</div>
      <div className="my-product__stock">{product.stock}</div>

      <div className="my-product__actions">
        <button onClick={() => onEdit(product.id)} className="btn-secondary">
          Editar
        </button>
        <button onClick={() => onDelete(product.id)} className="btn-danger">
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default function MyProductsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([
      { id: 1, title: "Smartphone", price: 899, stock: 10, description: "Teléfono de alta gama", image: "/modern-smartphone.png" },
      { id: 2, title: "Laptop", price: 1299, stock: 5, description: "Laptop gaming", image: "/gaming-laptop.png" },
    ]);
  }, []);

  const handleEdit = (id) => navigate(`/my-products/${id}/edit`);
  const handleDelete = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <section className="my-products">
      <div className="my-products__container">
        <div className="my-products__header">
          <h1 className="my-products__title">Mis Productos</h1>
          <button className="btn-primary" onClick={() => navigate("/my-products/new")}>
            + Nuevo Producto
          </button>
        </div>

        {/* Encabezado */}
        <div className="my-products__list-header">
          <div className="my-products__col--img">Imagen</div>
          <div className="my-products__col--title">Título</div>
          <div className="my-products__col--price">Precio</div>
          <div className="my-products__col--stock">Stock</div>
          <div className="my-products__col--actions">Acciones</div>
        </div>

        {/* Filas */}
        <div>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
