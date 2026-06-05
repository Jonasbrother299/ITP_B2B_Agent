function MetricCard({ metric }) {
  return (
    <article className="metric-card">
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <div>
        <em>{metric.change}</em>
        <small>{metric.detail}</small>
      </div>
    </article>
  )
}

export default MetricCard
