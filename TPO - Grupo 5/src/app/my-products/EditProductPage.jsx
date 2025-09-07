import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import EditProductForm from "../../components/EditProductForm";
import "../../styles/MyProducts.css"; // para fondo gris y botones si querés reutilizar
import "../../styles/EditProduct.css"; // por si envolvés en .editp__page


export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;

    // TODO: reemplazar por fetch real
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("bad");
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        // Mock si no hay API
        setProduct({
          title: "Producto de prueba",
          price: 100,
          stock: 10,
          description: "Descripción del producto",
          image: "https://via.placeholder.com/300",
        });
        setLoading(false);
      });
  }, [id]);

  const handleCancel = () => navigate("/my-products");

  const handleSubmit = async (p) => {
    if (id) {
      // TODO: PUT real
      console.log("Actualizando producto:", { id, ...p });
      alert("Producto actualizado (mock)");
    } else {
      // TODO: POST real
      console.log("Creando producto:", p);
      alert("Producto creado (mock)");
    }
    navigate("/my-products");
  };

  return (
    <div className="editp__page">
      <Header />

      <main>
        <EditProductForm
          initialProduct={id ? product : { title: "", price: "", stock: "", description: "", image: "" }}
          loading={loading}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          mode={id ? "edit" : "create"}
        />
      </main>

      <Footer />
    </div>
  );
}
