import { Header } from "../../components/Header";
import MyProductsSection from "../../components/MyProductsSection";
import { Footer } from "../../components/Footer";

export default function MyProducts() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <MyProductsSection />
      </main>
      <Footer />
    </div>
  );
}