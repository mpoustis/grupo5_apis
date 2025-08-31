// app/pages/Products.jsx
import { Header } from "../../components/Header";
import ProductsMainSection from "../../components/ProductsMainSection";
import { Footer } from "../../components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductsMainSection />
      </main>
      <Footer />
    </div>
  )
}
