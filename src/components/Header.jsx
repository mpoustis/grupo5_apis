import "../styles/Header.css"
import { Link } from 'react-router-dom';
import { useCart } from "../contexts/cart-contexts"

export function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          
          <div className="logo">
            <Link to="/"><h1>TiendaGrupo5</h1></Link> 
          </div>

          <nav className="nav">
            <Link to="/">Inicio</Link> 
            <Link to="/products">Productos</Link>
            <Link to="/my-products">Mis Productos</Link>
          </nav>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-hidden-sm">
              <svg fill="none" stroke="black" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="btn" aria-label="Ir al carrito">
              <Link to="/cart" className="cart-link">
                <svg fill="none" stroke="black" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0...-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            </button>
            <button className="btn btn-hidden-sm">
              <Link to="/login">
                <svg fill="none" stroke="black" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </button>
            <button className="btn btn-mobile-only">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
