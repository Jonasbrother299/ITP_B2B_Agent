function InfoCard({ title, text, value }) {
  return (
    <article className="info-card">
      <span>{title.slice(0, 1)}</span>
      <h2>{title}</h2>
      {value && <strong>{value}</strong>}
      {text && <p>{text}</p>}
    </article>
  )
}

export default InfoCard
