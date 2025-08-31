// app/pages/Products.jsx
import { Header } from "../../../components/Header";
import ProductDetails from "../../../components/ProductDetails";
import { Footer } from "../../../components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetails />
      </main>
      <Footer />
    </div>
  )
}
