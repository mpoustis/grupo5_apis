import { CartProvider } from './context/CartContext';
import ProductList from './ProductList';
import Cart from './Cart';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <header>
          <h1>Mi Tienda en React</h1>
        </header>
        <main>
          <ProductList />
          <Cart />
        </main>
      </div>
    </CartProvider>
  );
}

export default App;