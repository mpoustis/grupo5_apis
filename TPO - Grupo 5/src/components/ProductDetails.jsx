import {Link, useParams } from 'react-router-dom';
import ProductCard from './productCard';
import '../styles/ProductDetails.css';

const mockProducts = [
  {
    id: 1,
    name: "Smartphone Pro Max",
    brand: "TechPro",
    price: "899",
    originalPrice: "1199",
    discount: 25,
    rating: 4.8,
    reviews: 124,
    cuotas: 12,
    cuotasPrice: "75", 
    priceWithoutTax: "742", 
    image: "/modern-smartphone.png",
    category: "smartphones",
    inStock: true,
    description: "El Smartphone Pro Max de TechPro representa la última innovación en tecnología móvil..."
  },
  {
    id: 2,
    name: "Auriculares Inalámbricos",
    brand: "SoundMax",
    price: "199",
    originalPrice: "299",
    discount: 33,
    rating: 4.6,
    reviews: 89,
    cuotas: 6,
    cuotasPrice: "33",
    priceWithoutTax: "164",
    image: "/wireless-headphones.png",
    category: "audio",
    inStock: true,
    description: "Los Auriculares Inalámbricos SoundMax ofrecen una experiencia de audio premium..."
  },
  {
    id: 3,
    name: "Smartwatch Elite",
    brand: "TimeSync",
    price: "349",
    originalPrice: "449",
    discount: 22,
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
    description: "La Tablet Ultra de DigitalPro redefine la productividad móvil con su potente rendimiento..."
  }
];




const ProductDetails = () => {
  const { id } = useParams();
  
  // Buscar el producto por ID
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  const suggestedProducts = mockProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  // Si no encuentra el producto, mostrar mensaje de error
  if (!product) {
    return (
      <section className="product-details">
        <div className="product-not-found">
          <h1 className="not-found-title">
            Producto no encontrado
          </h1>
          <p className="not-found-text">
            El producto seleccionado no existe.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-details">
      <div className="product-card">
        
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

            <button className="add-to-cart-btn">
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