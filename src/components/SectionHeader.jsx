function SectionHeader({ title, eyebrow }) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  )
}

export default SectionHeader
