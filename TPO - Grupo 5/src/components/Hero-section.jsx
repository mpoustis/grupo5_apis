import "../styles/Hero-section.css"
import { Link } from 'react-router-dom';

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
              <Link to="/products" className="btn-primary">Explorar Productos</Link>
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
