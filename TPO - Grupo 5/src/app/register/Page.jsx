import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { RegisForm } from "@/components/Regis-form";

export default function RegisPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Bienvenido</h1>
            <p className="text-emerald-700">Ingresa tus datos para registrarte</p>
          </div>
          <RegisForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
