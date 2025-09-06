// app/pages/Products.jsx
import { Header } from "../../components/Header";
import ProductsSection from "../../components/ProductsSection";
import { Footer } from "../../components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductsSection />
      </main>
      <Footer />
    </div>
  )
}
