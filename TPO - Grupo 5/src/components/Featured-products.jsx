import "../styles/Featured-products.css"

const products = [
  {
    id: 1,
    name: "Smartphone Pro Max",
    price: "$899",
    originalPrice: "$1,199",
    image: "/modern-smartphone.png",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Auriculares Inalámbricos",
    price: "$199",
    originalPrice: "$299",
    image: "/wireless-headphones.png",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Smartwatch Elite",
    price: "$349",
    originalPrice: "$449",
    image: "/premium-smartwatch.png",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: "$599",
    originalPrice: "$799",
    image: "/modern-tablet.png",
    rating: 4.7,
    reviews: 203,
  },
]

export function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title">Productos Destacados</h2>
          <p className="featured-subtitle">
            Descubre nuestra selección de productos más populares con ofertas especiales
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
                <button className="favorite-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <div className="product-badge">-25%</div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

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
                  <span className="reviews-count">({product.reviews})</span>
                </div>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="current-price">{product.price}</span>
                    <span className="original-price">{product.originalPrice}</span>
                  </div>
                </div>

                <button className="add-to-cart">Agregar al Carrito</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
