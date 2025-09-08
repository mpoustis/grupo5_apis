import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from './app/Page'
import Products from './app/products/Page'
import ProductDetails from './app/products/product/Page'
import MyProducts from './app/my-products/Page.jsx'
import EditProductPage from './app/my-products/EditProductPage.jsx'
import LoginPage from './app/login/Page.jsx'
import RegisPage from './app/register/Page.jsx'
import RecoverPage from './app/recover/Page.jsx'
import CartPage from './app/cart/Page.jsx'

import { CartProvider } from './contexts/cart-contexts'

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Carrito */}
          <Route path="/cart" element={<CartPage />} />

          {/* Gestión de productos */}
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/my-products/:id/edit" element={<EditProductPage />} />
          <Route path="/my-products/new" element={<EditProductPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisPage />} />
          <Route path="/recover" element={<RecoverPage />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </CartProvider>
    </Router>
  )
}

export default App
