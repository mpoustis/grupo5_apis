import { Header } from "../../components/Header";
import MyOrdersSection from "../../components/MyOrdersSection";
import { Footer } from "../../components/Footer";

export default function MyProducts() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <MyOrdersSection />
      </main>
      <Footer />
    </div>
  );
}