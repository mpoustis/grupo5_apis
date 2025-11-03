import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import EditProductForm from "../../components/EditProductForm";
import { getProduct, createProduct, updateProduct } from "../../services/productsApi";
import { getCurrentToken } from "../../services/auth";
import "../../styles/MyProducts.css";
import "../../styles/EditProduct.css";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        const { id: me } = getCurrentToken();

        if (data.ownerId !== me) {
          alert("No podés editar un producto que no te pertenece.");
          navigate("/my-products");
          return;
        }
        setProduct(data);
      } catch {
        alert("No se pudo cargar el producto.");
        navigate("/my-products");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleCancel = () => navigate("/my-products");

  const handleSubmit = async (product) => {
    try {
      if (isEdit) {
        await updateProduct(id, product);           // PATCH
        alert("Producto actualizado");
      } else {
        await createProduct(product);               // POST
        alert("Producto creado");
      }
      navigate("/my-products");
    } catch (e) {
      alert(e.message || "Error guardando producto");
    }
  };

  return (
    <div className="editp__page">
      <Header />
      <main>
        <EditProductForm
          initialProduct={isEdit ? product : { name: "", price: "", stock: "", description: "", category:"", image: [] }}
          loading={loading}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          mode={isEdit ? "edit" : "create"}
        />
      </main>
      <Footer />
    </div>
  );
}
