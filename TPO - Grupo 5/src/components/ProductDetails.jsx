import React from "react";
import "../styles/ProductDetails.css"
import { useCart } from "../contexts/cart-contexts"; 

const ProductDetails = () => {
  const { addToCart } = useCart();

  const product = {
    id: 5,
    name: "Laptop Gaming Pro",
    price: 1299,
    originalPrice: 1699,
    image: "/gaming-laptop.png",
    rating: 4.9,
    reviews: 156,
    cuotas: 9,
    cuotasPrice: "39",
    priceWithoutTax: "288",
    image: "/premium-smartwatch.png",
    category: "wearables",
    inStock: true,
    description: "El Smartwatch Elite de TimeSync combina estilo y funcionalidad en un dispositivo inteligente..."
  },
  {
    id: 4,
    name: "Tablet Ultra",
    brand: "DigitalPro",
    price: "599",
    originalPrice: "799",
    discount: 25,
    rating: 4.7,
    reviews: 203,
    cuotas: 12,
    cuotasPrice: "50",
    priceWithoutTax: "495",
    image: "/modern-tablet.png",
    category: "tablets",
    inStock: true,
    discount: 35,
    description: `Óleo Extraordinario Elvive x 100 ml. El Óleo Extraordinario transforma el pelo seco llenándolo de vida, luciendo sublime en todos sus aspectos. Su textura ligera enriquecida con extracto de 6 óleos de flores preciosas se funde en el pelo para revitalizar la estructura capilar, lograr un brillo extraordinario y una suavidad infinita. No genera efecto graso y tiene múltiples usos: antes del shampoo NUTRE intensamente; antes del peinado SUAVIZA y sirve como PROTECTOR TÉRMICO; como toque final da BRILLO y acción ANTI-FRIZZ.`,
    volume: "100 ml",
    priceWithoutTax: 9223.14,
    cuotas: 4,
    cuotasPrice: 2790,
  };

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
              src={product.image}
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
                  className={`star ${i < product.rating ? "filled" : "empty"}`}
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
                <span className="original-price">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="discount">
                  -{product.discount}%
                </span>
              )}
            </div>
            <p className="delivery">
              ¡Recíbelo gratis hoy mismo!
            </p>
            <p className="delivery">
              ¡Devolución gratuita!
            </p>
            <p className="installments-info">
              o hasta {product.cuotas} cuotas sin interés de ${product.cuotasPrice.toLocaleString()}
            </p>
            <p className="tax-info">
              Precio sin impuestos nacionales: ${product.priceWithoutTax.toLocaleString()}
            </p>
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