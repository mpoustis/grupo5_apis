// App.jsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './app/Page'
import Products from './app/products/Page'
import ProductDetails  from './app/products/product/Page'
import MyProducts from "./app/my-products/Page.jsx"
import EditProductPage from "./app/my-products/EditProductPage.jsx"
import { CartProvider } from './contexts/cart-contexts'
import LoginPage from './app/login/Page.jsx'
import RegisPage from './app/register/Page.jsx'
import RecoverPage  from "./app/recover/Page.jsx"

function App() {
  return (
    <Router>
      <div className="App">
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisPage />} />
            <Route path="/recover" element={<RecoverPage />} />
          </Routes>
        </CartProvider>
        <Routes>
          <Route path="/my-products/:id/edit" element={<EditProductPage />} />
          <Route path="/my-products/new" element={<EditProductPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
