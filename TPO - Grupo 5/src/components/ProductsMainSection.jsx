import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Heart } from 'lucide-react';
import { Link } from "react-router-dom";
import '../styles/ProductsMainSection.css';
import { useCart } from "../contexts/cart-contexts";
import { listProducts } from "../services/productsApi";

// 🔹 Datos de filtros
const categories = [
  { id: "smartphones", name: "Smartphones" },
  { id: "audio", name: "Audio" },
  { id: "wearables", name: "Wearables" },
  { id: "tablets", name: "Tablets" },
  { id: "laptops", name: "Laptops" },
  { id: "cameras", name: "Cámaras" },
  { id: "drones", name: "Drones" }
];

const brands = ["TechPro", "SoundMax", "TimeSync", "DigitalPro", "GameForce", "PhotoMax", "VoiceTech", "AirPro"];

const publicationStatus = [
  { value: true, label: "Público" },
  { value: false, label: "No público" }
];

const sortOptions = [
  { value: "price-low", label: "Precio: Menor a Mayor" },
  { value: "price-high", label: "Precio: Mayor a Menor" },
];

const priceRanges = [
  { id: "0-200", label: "$0 - $200", min: 0, max: 200 },
  { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { id: "500-1000", label: "$500 - $1000", min: 500, max: 1000 },
  { id: "1000+", label: "$1000+", min: 1000, max: 10000 }
];

// 🔹 Componente de tarjeta de producto
const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const discount = product.originalPrice > product.price 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image || "/api/placeholder/280/200"} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = "/api/placeholder/280/200";
            }}
          />
        </Link>

        <button 
          onClick={() => onToggleFavorite(product.id)}
          className={`favorite-btn ${isFavorite ? 'active' : 'inactive'}`}
          aria-label="Agregar a favoritos"
        >
          <Heart className="favorite-icon" fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}

        {!product.inStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-text">Sin Stock</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>

        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-rating">
          <div className="rating-stars-container">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`product-rating-star ${i < Math.floor(product.rating) ? "filled" : "empty"}`}
              />
            ))}
          </div>
          <span className="product-reviews">({product.reviews})</span>
        </div>

        <div className="product-pricing">
          <span className="product-price">${product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button 
          disabled={!product.inStock}
          onClick={() => onAddToCart(product)}
          className={`add-to-cart-btn ${product.inStock ? 'available' : 'unavailable'}`}
        >
          {product.inStock ? "Agregar al Carrito" : "Sin Stock"}
        </button>
      </div>
    </div>
  );
};

// 🔹 Sección de filtros colapsables
const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="filter-section">
    <button
      onClick={onToggle}
      className="filter-section-header"
      aria-expanded={isOpen}
    >
      {title}
      {isOpen ? <ChevronUp className="filter-section-icon" /> : <ChevronDown className="filter-section-icon" />}
    </button>
    {isOpen && <div className="filter-section-content">{children}</div>}
  </div>
);

// 🔹 Componente principal
export default function ProductsMainSection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedPublicationStatus, setSelectedPublicationStatus] = useState("true");
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
  const [sortBy, setSortBy] = useState("price-low");
  const [favorites, setFavorites] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState({
    categories: true,
    priceRange: true,
    brands: true,
    publicationStatus: false
  });

  // 🔹 Traer productos desde API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const opts = {
          onlyPublic: selectedPublicationStatus === "true", 
          categories: Array.from(selectedCategories),
          order: sortBy === "price-low" ? "asc" : sortBy === "price-high" ? "desc" : null
        };

        const data = await listProducts(opts);
        setProducts(data || []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(err.message || "Error al cargar productos");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategories, selectedPublicationStatus, sortBy]);

  // 🔹 Manejo de carrito y favoritos
  const handleAddToCart = (product) => {
    addToCart(product);
    console.log(`${product.name} agregado al carrito`);
  };

  const handlePublicationStatusChange = (value) => {
    setSelectedPublicationStatus(value.toString());
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  };

  const togglePriceRange = (rangeId) => {
    setSelectedPriceRanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rangeId)) {
        newSet.delete(rangeId);
      } else {
        newSet.add(rangeId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedPriceRanges(new Set());
    setSelectedPublicationStatus("true");    
    setSearchTerm("");
  };

  // 🔹 Filtrado y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchTerm.trim() || 
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(product.brand);
      
      let matchesPrice = selectedPriceRanges.size === 0;
      if (selectedPriceRanges.size > 0) {
        matchesPrice = Array.from(selectedPriceRanges).some(rangeId => {
          const range = priceRanges.find(r => r.id === rangeId);
          return range && product.price >= range.min && product.price <= range.max;
        });
      }
      
      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [products, searchTerm, selectedBrands, selectedPriceRanges]);

  // 🔹 Estados de carga
  if (loading) {
    return (
      <div className="products-container">
        <div className="products-wrapper">
          <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="products-wrapper">
          <div className="no-result">
            <h3>Error al cargar productos</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  const totalFilters = selectedCategories.size + selectedBrands.size + selectedPriceRanges.size + 
                       (searchTerm ? 1 : 0) + (selectedPublicationStatus !== "true" ? 1 : 0);

  return (
    <div className="products-container">
      <div className="products-wrapper">
        <div className="products-header-layout">
          <div className="sidebar-spacer"></div>
          <div className="header-content">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">Home</a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Productos</span>
            </nav>
          </div>
        </div>

        <div className="main-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="filters-container">
              <div className="filters-header">
                <h2 className="filters-title">Filtros</h2>
                {totalFilters > 0 && (
                  <button onClick={clearAllFilters} className="clear-filters-btn">
                    Limpiar ({totalFilters})
                  </button>
                )}
              </div>

              <div className="filters-sections">
                <FilterSection
                  title="Categorías"
                  isOpen={sidebarOpen.categories}
                  onToggle={() => setSidebarOpen(prev => ({ ...prev, categories: !prev.categories }))}
                >
                  <div className="filter-options">
                    {categories.map(category => (
                      <label key={category.id} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.has(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        <span className="filter-label">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Rango de Precio"
                  isOpen={sidebarOpen.priceRange}
                  onToggle={() => setSidebarOpen(prev => ({ ...prev, priceRange: !prev.priceRange }))}
                >
                  <div className="filter-options">
                    {priceRanges.map(range => (
                      <label key={range.id} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.has(range.id)}
                          onChange={() => togglePriceRange(range.id)}
                        />
                        <span className="filter-label">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Marcas"
                  isOpen={sidebarOpen.brands}
                  onToggle={() => setSidebarOpen(prev => ({ ...prev, brands: !prev.brands }))}
                >
                  <div className="filter-options">
                    {brands.map(brand => (
                      <label key={brand} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedBrands.has(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <span className="filter-label">{brand}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Estado de la publicación"
                  isOpen={sidebarOpen.publicationStatus}
                  onToggle={() => setSidebarOpen(prev => ({ ...prev, publicationStatus: !prev.publicationStatus }))}
                >
                  <div className="filter-options">
                    {publicationStatus.map(status => (
                      <label key={status.value.toString()} className="filter-option">
                        <input
                          type="radio"
                          name="publicationStatus"
                          checked={selectedPublicationStatus === status.value.toString()}
                          onChange={() => handlePublicationStatusChange(status.value)}
                          className="filter-radio"
                          disabled={loading}
                        />
                        <span className="filter-label">
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="search-sort-bar">
              <div className="search-sort-content">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="sort-controls">
                  <span className="products-count">
                    {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                  </span>
                  
                  <div className="sort-select-container">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="sort-select-icon" />
                  </div>
                </div>
              </div>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="products-grid">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-result">
                <Search className="no-result-icon svg" />
                <h3>No se encontraron productos</h3>
                <p>
                  {products.length === 0 
                    ? "No hay productos disponibles en este momento" 
                    : "Intenta ajustar tus filtros o términos de búsqueda"}
                </p>
                {totalFilters > 0 && (
                  <button onClick={clearAllFilters}>Limpiar Filtros</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}