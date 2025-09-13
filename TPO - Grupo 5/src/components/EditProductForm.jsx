import { useEffect, useMemo, useState } from "react";
import "../styles/EditProduct.css";
import "../styles/MyProducts.css";

const EMPTY_PRODUCT = {
  id: "",
  ownerId: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  originalPrice: "",
  image: "",
  rating: "",
  reviews: "",
  category: "",
  brand: "",
  inStock: true,
  public: true,
  tax: 0.21,   // IVA por defecto 21%
  cuotas: 1,
  fee: 0       // interés por defecto 0
};

export default function EditProductForm({
  initialProduct,
  loading = false,
  onCancel,
  onSubmit,
  mode = "edit",
}) {
  const [product, setProduct] = useState(initialProduct ?? EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(initialProduct?.image || "");

  useEffect(() => {
    setProduct(initialProduct ?? EMPTY_PRODUCT);
    setPreview(initialProduct?.image || "");
  }, [initialProduct]);

  const isCreate = mode === "create";

  const validate = (p) => {
    const e = {};

    if (!p.name?.trim()) e.name = "El nombre es obligatorio.";

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

      // Casting final al shape requerido por backend
      const payload = {
        id: `${product.id ?? ""}`.trim() || undefined, // si está vacío, dejar que el backend lo asigne
        ownerId: product.ownerId === "" ? undefined : Number(product.ownerId),
        name: product.name.trim(),
        description: product.description?.trim() || "",
        price: Number(product.price),
        stock: Number(product.stock),
        originalPrice:
          product.originalPrice === "" ? undefined : Number(product.originalPrice),
        image: product.image || "",
        rating: product.rating === "" ? undefined : Number(product.rating),
        reviews: product.reviews === "" ? undefined : Number(product.reviews),
        category: product.category?.trim() || "",
        brand: product.brand?.trim() || "",
        inStock: Boolean(product.inStock),
        public: Boolean(product.public),
        tax: Number(product.tax),   // 0..1
        cuotas: Number(product.cuotas),
        fee: Number(product.fee),   // 0..1
      };

      await onSubmit?.(payload);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="editp__container">
        <div className="editp__card">Cargando…</div>
      </div>
    );
  }

  return (
    <form className="editp__container" onSubmit={handleSubmit} noValidate>
      <div className="editp__header">
        <h1 className="editp__name">
          {isCreate ? "Nuevo Producto" : "Editar Producto"}
        </h1>
      </div>

      <div className="editp__card">
        {/* Información general */}
        <section className="editp__section">
          <h2 className="editp__section-title">Información general</h2>

          <div className="editp__grid">
            <div className="editp__field">
              <label className="editp__label">Nombre</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className={`editp__input ${errors.name ? "editp__input--error" : ""}`}
                placeholder="Ej: Smartphone Pro Max"
              />
              {errors.name && <p className="editp__error">{errors.name}</p>}
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
              <label className="editp__label">Precio original (tachado)</label>
              <input
                type="number"
                step="0.01"
                name="originalPrice"
                value={product.originalPrice}
                onChange={handleChange}
                className={`editp__input ${errors.originalPrice ? "editp__input--error" : ""}`}
                placeholder="Ej: 1199"
              />
              {errors.originalPrice && (
                <p className="editp__error">{errors.originalPrice}</p>
              )}
            </div>

            <div className="editp__field">
              <label className="editp__label">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className={`editp__input ${errors.stock ? "editp__input--error" : ""}`}
                placeholder="Ej: 15"
              />
              {errors.stock && <p className="editp__error">{errors.stock}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Categoría</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="editp__input"
              >
                <option value="">Seleccione una categoría</option>
                <option value="smartphones">Smartphones</option>
                <option value="audio">Audio</option>
                <option value="wereables">Wereables</option>
                <option value="tablets">Tablets</option>
                <option value="laptops">Laptops</option>
                <option value="camaras">Cámaras</option>
                <option value="drones">Drones</option>
                <option value="otros">Otros...</option>
              </select>
            </div>

            <div className="editp__field">
              <label className="editp__label">Marca</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="editp__input"
                placeholder="Ej: TechPro"
              />
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
                <img src={preview} alt={product.name || "Vista previa"} />
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

        {/* Comercialización */}
        <section className="editp__section">
          <h2 className="editp__section-title">Comercialización</h2>

          <div className="editp__grid">
            <div className="editp__field">
              <label className="editp__label">Impuesto (tax)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                name="tax"
                value={product.tax}
                onChange={handleChange}
                className={`editp__input ${errors.tax ? "editp__input--error" : ""}`}
                placeholder="Ej: 0.21"
              />
              {errors.tax && <p className="editp__error">{errors.tax}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Cuotas</label>
              <input
                type="number"
                min="1"
                name="cuotas"
                value={product.cuotas}
                onChange={handleChange}
                className={`editp__input ${errors.cuotas ? "editp__input--error" : ""}`}
                placeholder="Ej: 12"
              />
              {errors.cuotas && <p className="editp__error">{errors.cuotas}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Interés (fee)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                name="fee"
                value={product.fee}
                onChange={handleChange}
                className={`editp__input ${errors.fee ? "editp__input--error" : ""}`}
                placeholder="Ej: 0.15"
              />
              {errors.fee && <p className="editp__error">{errors.fee}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Rating (0 a 5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={product.rating}
                onChange={handleChange}
                className={`editp__input ${errors.rating ? "editp__input--error" : ""}`}
                placeholder="Ej: 4.8"
              />
              {errors.rating && <p className="editp__error">{errors.rating}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">Reseñas</label>
              <input
                type="number"
                min="0"
                name="reviews"
                value={product.reviews}
                onChange={handleChange}
                className={`editp__input ${errors.reviews ? "editp__input--error" : ""}`}
                placeholder="Ej: 124"
              />
              {errors.reviews && <p className="editp__error">{errors.reviews}</p>}
            </div>

            <div className="editp__field">
              <label className="editp__label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={!!product.inStock}
                  onChange={handleChange}
                  className="editp__checkbox"
                />{" "}
                En stock
              </label>
            </div>

            <div className="editp__field">
              <label className="editp__label">
                <input
                  type="checkbox"
                  name="public"
                  checked={!!product.public}
                  onChange={handleChange}
                  className="editp__checkbox"
                />{" "}
                Público
              </label>
            </div>
          </div>
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
