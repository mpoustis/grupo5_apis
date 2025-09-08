import React from "react";
import "../styles/ProductDetails.css"
import { useCart } from "../contexts/cart-contexts"; 

const ProductDetails = () => {
  const { addToCart } = useCart();

  const product = {
    id: 5,
    name: "Laptop Gaming Pro",
    price: 1299,
    originalPrice: 1699,
    image: "/gaming-laptop.png",
    rating: 4.9,
    reviews: 87,
    category: "laptops",
    brand: "GameForce",
    inStock: true,
    discount: 35,
    description: `Óleo Extraordinario Elvive x 100 ml. El Óleo Extraordinario transforma el pelo seco llenándolo de vida, luciendo sublime en todos sus aspectos. Su textura ligera enriquecida con extracto de 6 óleos de flores preciosas se funde en el pelo para revitalizar la estructura capilar, lograr un brillo extraordinario y una suavidad infinita. No genera efecto graso y tiene múltiples usos: antes del shampoo NUTRE intensamente; antes del peinado SUAVIZA y sirve como PROTECTOR TÉRMICO; como toque final da BRILLO y acción ANTI-FRIZZ.`,
    volume: "100 ml",
    priceWithoutTax: 9223.14,
    cuotas: 4,
    cuotasPrice: 2790,
  };

    const handleAddToCart = () => {
    addToCart(product);
    console.log(`${product.name} agregado al carrito ✅`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="bg-white border border-[#e8ecef] rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
        
        <div className="flex justify-center items-start">
          <div className="bg-[#f8f9fa] rounded-xl overflow-hidden w-full max-w-sm">
            <img
              src={product.image}
              alt={product.name}
              className="object-contain w-full h-auto max-h-[400px] transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="space-y-4 text-[#1a1a1a]">
          <p className="text-sm text-[#0066cc] uppercase font-semibold tracking-wide">
            {product.brand}
          </p>

          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex gap-[2px]">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${
                    i < product.rating ? "text-yellow-400" : "text-[#e0e0e0]"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.175L12 18.896l-7.336 3.858 1.402-8.175L.132 9.21l8.2-1.192z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-[#666] font-medium">
              ({product.reviews} calificaciones)
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1a1a1a]">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-base text-[#999] line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-[#ff3838]">
                -{product.discount}%
              </span>
            </div>
            <p className="text-sm text-[#333]">
              o hasta {product.cuotas} cuotas sin interés de ${product.cuotasPrice.toLocaleString()}
            </p>
            <p className="text-xs text-[#888]">
              Precio sin impuestos nacionales: ${product.priceWithoutTax.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <select className="border border-[#e1e5e9] rounded-md px-3 py-2 text-sm text-[#333] bg-white">
              <option>1 unidad</option>
              <option>2 unidades</option>
              <option>3 unidades</option>
            </select>

            <button 
              className="add-to-cart-btn available"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-sm text-[#444] whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
