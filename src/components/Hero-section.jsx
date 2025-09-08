import "../styles/Hero-section.css"

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Descubre la Nueva Colección</h1>
            <p className="hero-subtitle">
              Productos de calidad premium con diseños únicos que transformarán tu estilo de vida.
            </p>
            <div className="hero-buttons">
              <a href="/products" className="btn-primary">
                Explorar Productos
                <svg className="ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#" className="btn-secondary">
                Ver Ofertas
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="./modern-smartphone.png" alt="Producto destacado" />
          </div>
        </div>
      </div>
    </section>
  )
}
