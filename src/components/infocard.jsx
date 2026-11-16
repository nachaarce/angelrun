function InfoCard({ icon, title, children }) {
  return (
    <article className="info-card">
      <div className="info-card-icon">{icon}</div>
      <h3 className="info-card-title">{title}</h3>
      <p className="info-card-text">{children}</p>
    </article>
  );
}

export default InfoCard;
