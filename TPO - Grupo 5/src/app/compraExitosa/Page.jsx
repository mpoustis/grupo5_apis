import React from 'react';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const CompraExitosa = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 headerFit">
        
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full transform transition duration-500 hover:scale-[1.01]">
          
          <div className="text-6xl text-green-600 mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
            ¡Compra Exitosa!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 text-center">
            Tu orden ha sido confirmado. Hemos enviado un correo electrónico con los detalles completos y la factura a tu dirección.
          </p>

          <div className="flex justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Ver Detalles tus ordenes
            </button>
          </div>

        </div>

      </main>
      
      <Footer />
    </div>
  )
};

export default CompraExitosa;