import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetails.css";
import { useCart } from "../contexts/cart-contexts"; 
import { getProduct } from "../services/productsApi"; 

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id); 
        setProduct(data);
      } catch (err) {
        console.error("Error cargando producto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>Producto no encontrado ❌</p>;

  const handleAddToCart = () => {
    addToCart(product);
    console.log(`${product.name} agregado al carrito ✅`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 font-sans headerFit">
      <div className="bg-white border border-[#e8ecef] rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
        
        <div className="image-container">
          <div className="image-wrapper">
            <img
              src={product.image || "/api/placeholder/280/200"}
              alt={product.name}
              className="product-image"
            />
          </div>
        </div>

        <div className="product-info">
          <p className="brand-label">
            {product.brand}
          </p>

          <h1 className="product-title">
            {product.name}
          </h1>

          <div className="rating-section">
            <div className="stars-container">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${i < product.rating ? "text-yellow-400" : "text-[#e0e0e0]"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.175L12 18.896l-7.336 3.858 1.402-8.175L.132 9.21l8.2-1.192z" />
                </svg>
              ))}
            </div>
            <p className="reviews-count">
              ({product.reviews} calificaciones)
            </p>
          </div>

          <div className="price-section">
            <div className="price-row">
              <span className="current-price">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#999] line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="text-sm font-semibold text-[#ff3838]">
                  -{product.discount}%
                </span>
              )}
            </div>
            {product.cuotas && (
              <p className="text-sm text-[#333]">
                o hasta {product.cuotas} cuotas sin interés
              </p>
            )}
            {product.tax && (
              <p className="text-xs text-[#888]">
                Precio sin impuestos nacionales: ${(product.price / (1 + product.tax)).toFixed(2)}
              </p>
            )}
          </div>

          <div className="purchase-section">
            <select className="quantity-select">
              <option>1 unidad</option>
              <option>2 unidades</option>
              <option>3 unidades</option>
            </select>

            <button 
              className="add-to-cart-btn available"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          </div>

          <div className="description-section">
            <h3 className="description-title">Descripción</h3>
            <p className="description-text">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="suggested-products">
        <h2 className="suggested-title">Productos relacionados</h2>
        <div className="products-grid">
          {suggestedProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`} 
              className="product-link"
            >
              <ProductCard
                product={product}
                showDiscount={true}
              />
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ProductDetails;