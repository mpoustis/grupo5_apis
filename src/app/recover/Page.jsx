import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { RecoverForm } from "@/components/Recover-form";

export default function RecoverPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex items-center justify-center p-4 min-h-120">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Recuperar Contraseña</h1>
            <p className="text-emerald-700">Ingresa tu correo electrónico para recuperar tu contraseña</p>
          </div>
          <RecoverForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
