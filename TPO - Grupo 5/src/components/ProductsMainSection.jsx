import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, ChevronDown, ChevronUp, Star, Heart, X } from 'lucide-react';
import { Link } from "react-router-dom";
import '../styles/ProductsMainSection.css';

// Datos de productos expandidos para la demostración
const allProducts = [
  {
    id: 1,
    name: "Smartphone Pro Max",
    price: 899,
    originalPrice: 1199,
    image: "/modern-smartphone.png",
    rating: 4.8,
    reviews: 124,
    category: "smartphones",
    brand: "TechPro",
    inStock: true
  },
  {
    id: 2,
    name: "Auriculares Inalámbricos",
    price: 199,
    originalPrice: 299,
    image: "/wireless-headphones.png",
    rating: 4.6,
    reviews: 89,
    category: "audio",
    brand: "SoundMax",
    inStock: true
  },
  {
    id: 3,
    name: "Smartwatch Elite",
    price: 349,
    originalPrice: 449,
    image: "/premium-smartwatch.png",
    rating: 4.9,
    reviews: 156,
    category: "wearables",
    brand: "TimeSync",
    inStock: true
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 599,
    originalPrice: 799,
    image: "/modern-tablet.png",
    rating: 4.7,
    reviews: 203,
    category: "tablets",
    brand: "DigitalPro",
    inStock: false
  },
  {
    id: 5,
    name: "Laptop Gaming Pro",
    price: 1299,
    originalPrice: 1699,
    image: "/gaming-laptop.png",
    rating: 4.9,
    reviews: 87,
    category: "laptops",
    brand: "GameForce",
    inStock: true
  },
  {
    id: 6,
    name: "Cámara Digital 4K",
    price: 799,
    originalPrice: 999,
    image: "/digital-camera.png",
    rating: 4.5,
    reviews: 145,
    category: "cameras",
    brand: "PhotoMax",
    inStock: true
  },
  {
    id: 7,
    name: "Smart Speaker",
    price: 149,
    originalPrice: 199,
    image: "/smart-speaker.png",
    rating: 4.4,
    reviews: 234,
    category: "audio",
    brand: "VoiceTech",
    inStock: true
  },
  {
    id: 8,
    name: "Drone Professional",
    price: 899,
    originalPrice: 1199,
    image: "/professional-drone.png",
    rating: 4.7,
    reviews: 76,
    category: "drones",
    brand: "AirPro",
    inStock: true
  }
];

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

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "price-low", label: "Precio: Menor a..." },
  { value: "price-high", label: "Precio: Mayor a..." },
  { value: "rating", label: "Mejor Valorados" },
  { value: "newest", label: "Más Nuevos" }
];

const priceRanges = [
  { id: "0-200", label: "$0 - $200", min: 0, max: 200 },
  { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { id: "500-1000", label: "$500 - $1000", min: 500, max: 1000 },
  { id: "1000+", label: "$1000+", min: 1000, max: 10000 }
];

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="product-card">
      {/* Imagen + Overlay + Link al detalle */}
      <div className="product-image-container">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image || "/api/placeholder/280/200"} 
            alt={product.name}
            className="product-image"
          />
        </Link>

        <button 
          onClick={() => onToggleFavorite(product.id)}
          className={`favorite-btn ${isFavorite ? 'active' : 'inactive'}`}
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

        {/* Nombre del producto con link */}
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
          <span className="product-price">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">${product.originalPrice}</span>
          )}
        </div>

        <button 
          disabled={!product.inStock}
          className={`add-to-cart-btn ${product.inStock ? 'available' : 'unavailable'}`}
        >
          {product.inStock ? "Agregar al Carrito" : "Sin Stock"}
        </button>
      </div>
    </div>
  );
};

const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="filter-section">
    <button
      onClick={onToggle}
      className="filter-section-header"
    >
      {title}
      {isOpen ? <ChevronUp className="filter-section-icon" /> : <ChevronDown className="filter-section-icon" />}
    </button>
    {isOpen && <div className="filter-section-content">{children}</div>}
  </div>
);

export default function ProductsMainSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState({
    categories: true,
    priceRange: true,
    brands: true,
    ratings: false
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.category);
      
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(product.brand);
      
      let matchesPrice = selectedPriceRanges.size === 0;
      if (selectedPriceRanges.size > 0) {
        matchesPrice = Array.from(selectedPriceRanges).some(rangeId => {
          const range = priceRanges.find(r => r.id === rangeId);
          return range && product.price >= range.min && product.price <= range.max;
        });
      }
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Ordenar productos
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategories, selectedBrands, selectedPriceRanges, sortBy]);

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

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedPriceRanges(new Set());
    setSearchTerm("");
  };

  const totalFilters = selectedCategories.size + selectedBrands.size + selectedPriceRanges.size;

  return (
    <div className="products-container">
      <div className="products-wrapper">
        <div className="products-header-layout">
          {/* Sidebar space placeholder for alignment */}
          <div className="sidebar-spacer">
            {/* Empty space to align with sidebar */}
          </div>
          
          {/* Header aligned with main content */}
          <div className="header-content">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Home</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Productos</span>
            </nav>

            {/* Header */}
            <div className="page-title">
              <h1>Productos</h1>
            </div>
          </div>
        </div>

        <div className="main-layout">
          {/* Sidebar - Filtros */}
          <div className="sidebar">
            <div className="filters-container">
              <div className="filters-header">
                <h2 className="filters-title">Filtros</h2>
                {totalFilters > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="clear-filters-btn"
                  >
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
                          className="filter-checkbox"
                        />
                        <span className="filter-label">
                          {category.name}
                        </span>
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
                          className="filter-checkbox"
                        />
                        <span className="filter-label">
                          {range.label}
                        </span>
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
                          className="filter-checkbox"
                        />
                        <span className="filter-label">
                          {brand}
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
            {/* Search and Sort Bar */}
            <div className=".search-sort-bar">
              <div className="search-sort-content">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="sort-controls">
                  <span className="products-count">
                    {filteredAndSortedProducts.length} productos
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

            {/* Products Grid */}
            <div className="products-grid">
              {filteredAndSortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="no-result">
                <div className="no-result-icon">
                  <Search className="no-result-icon svg" />
                </div>
                <h3 className="no-result-text">
                  No se encontraron productos
                </h3>
                <p className="no-result-text">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <button
                  onClick={clearAllFilters}
                  className="no-result-btn"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="load-more">
                <button className="load-more-btn">
                  Cargar más productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}