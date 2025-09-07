import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import './ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos nuestro hook para acceder a la función addToCart
  const { addToCart } = useCart();

  // useEffect para llamar a la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar los productos: {error}</p>;

  return (
    <div className="product-list-container">
      <h2>Productos Disponibles</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <img src={product.image} alt={product.title} className="product-image" />
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Añadir al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;