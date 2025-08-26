import './Card.css';

export default function Card({
  title,
  description,
  image,
  onAction,
  children,
}) {
  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>

        <div className="card-children">{children}</div>

        <button onClick={onAction} className="card-button">
          Acción
        </button>
      </div>
    </div>
  );
}
