import { useEffect, useMemo, useState } from "react";
import "../styles/EditProduct.css";
import "../styles/MyProducts.css";


export default function EditProductForm({
  initialProduct,
  loading = false,
  onCancel,
  onSubmit,
  mode = "edit",
}) {
  const [product, setProduct] = useState(
    initialProduct ?? { title: "", price: "", stock: "", description: "", image: "" }
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(initialProduct?.image || "");

  useEffect(() => {
    setProduct(
      initialProduct ?? { title: "", price: "", stock: "", description: "", image: "" }
    );
    setPreview(initialProduct?.image || "");
  }, [initialProduct]);

  const isCreate = mode === "create";

  const validate = (p) => {
    const e = {};
    if (!p.title?.trim()) e.title = "El título es obligatorio.";
    // Convertir a número en validación (si viene string)
    const priceNum = Number(p.price);
    if (Number.isNaN(priceNum) || priceNum < 0) e.price = "Precio inválido.";
    const stockNum = Number(p.stock);
    if (!Number.isInteger(stockNum) || stockNum < 0) e.stock = "Stock inválido.";
    if (p.description?.length > 500) e.description = "Máximo 500 caracteres.";
    // URL simple (opcional)
    if (p.image && !/^https?:\/\/|^\/|^data:image\//i.test(p.image)) {
      e.image = "Debe ser una URL válida, ruta local (/img.png) o data URI.";
    }
    return e;
  };

  const canSubmit = useMemo(() => {
    const e = validate(product);
    return Object.keys(e).length === 0;
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (name === "image") {
      setPreview(value);
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO reemplazar con el upload a servidor
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProduct((prev) => ({ ...prev, image: dataUrl }));
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(product);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      setSubmitting(true);
      await onSubmit?.({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="editp__container"><div className="editp__card">Cargando…</div></div>;
  }

  return (
    <form className="editp__container" onSubmit={handleSubmit} noValidate>
      <div className="editp__header">
        <h1 className="editp__title">{isCreate ? "Nuevo Producto" : "Editar Producto"}</h1>
      </div>

      <div className="editp__card">
        {/* Información general */}
        <section className="editp__section">
          <h2 className="editp__section-title">Información general</h2>

          <div className="editp__grid">
            <div className="editp__field">
              <label className="editp__label">Título</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className={`editp__input ${errors.title ? "editp__input--error" : ""}`}
                placeholder="Ej: Smartphone Pro Max"
              />
              {errors.title && <p className="editp__error">{errors.title}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Precio</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={product.price}
                onChange={handleChange}
                className={`editp__input ${errors.price ? "editp__input--error" : ""}`}
                placeholder="Ej: 899.99"
              />
              {errors.price && <p className="editp__error">{errors.price}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className={`editp__input ${errors.stock ? "editp__input--error" : ""}`}
                placeholder="Ej: 10"
              />
              {errors.stock && <p className="editp__error">{errors.stock}</p>}
            </div>

            <div className="editp__field editp__field--full">
              <label className="editp__label">Descripción</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className={`editp__textarea ${errors.description ? "editp__input--error" : ""}`}
                placeholder="Breve detalle del producto (máx. 500 caracteres)"
                rows={4}
                maxLength={500}
              />
              <div className="editp__hint">
                {product.description?.length || 0}/500
              </div>
              {errors.description && <p className="editp__error">{errors.description}</p>}
            </div>
          </div>
        </section>

        {/* Imagen */}
        <section className="editp__section">
          <h2 className="editp__section-title">Imagen</h2>

          <div className="editp__image-row">
            <div className="editp__thumb">
              {preview ? (
                <img src={preview} alt={product.title || "Vista previa"} />
              ) : (
                <div className="editp__thumb--placeholder">Sin imagen</div>
              )}
            </div>

            <div className="editp__image-actions">
              <label className="btn-secondary editp__file-btn">
                Subir archivo
                <input type="file" accept="image/*" onChange={handleImageFile} hidden />
              </label>

              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className={`editp__input ${errors.image ? "editp__input--error" : ""}`}
                placeholder="URL de imagen o pegar data:image/…"
              />
              {errors.image && <p className="editp__error">{errors.image}</p>}
            </div>
          </div>
        </section>

        {/* Futuro */}
        <section className="editp__section">
          <h2 className="editp__section-title">Otras opciones</h2>
          <p className="editp__muted">
            Próximamente: videos, opciones de pago, variantes, etc.
          </p>
        </section>

        {/* Acciones */}
        <div className="editp__actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={!canSubmit || submitting}>
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}
