function SectionHeader({ title, eyebrow }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <span>{eyebrow}</span>
    </div>
  )
}

export default SectionHeader
