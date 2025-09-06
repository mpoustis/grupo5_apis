import React from 'react';
import { Heart } from 'lucide-react';
import "../styles/Featured-products.css"

const ProductCard = ({ 
  product, 
  isFavorite = false, 
  onToggleFavorite, 
  onAddToCart,
  showDiscount = false 
}) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Calcular descuento si hay precio original
  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name}
        />
        
        <button 
          className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`heart-icon ${isFavorite ? 'heart-filled' : ''}`}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        
        {(showDiscount && discountPercentage > 0) && (
          <div className="product-badge">-{discountPercentage}%</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {product.rating && (
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`star ${i < Math.floor(product.rating) ? "star-filled" : "star-empty"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {product.reviews && (
              <span className="reviews-count">({product.reviews})</span>
            )}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">
              {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
            </span>
            {product.originalPrice && (
              <span className="original-price">
                {typeof product.originalPrice === 'number' ? `$${product.originalPrice.toFixed(2)}` : product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button 
          className="add-to-cart"
          onClick={handleAddToCart}
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;