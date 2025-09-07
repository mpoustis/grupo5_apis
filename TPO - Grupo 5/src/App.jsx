// App.jsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './app/Page'
import Products from './app/products/Page'
import ProductDetails from './app/products/product/Page'

// 👇 importá el provider
import { CartProvider } from './contexts/cart-contexts'

function App() {
  return (
    <CartProvider> {/* 👈 envolver toda la app */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
