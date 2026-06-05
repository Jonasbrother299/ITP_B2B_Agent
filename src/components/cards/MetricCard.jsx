import { Link } from 'react-router-dom'

function MetricCard({ metric }) {
  return (
    <Link className={`metric-card metric-card--${metric.tone} metric-card--link`} to={metric.path}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <div>
        <em>{metric.change}</em>
      </div>
      {metric.miniBars && (
        <div className="metric-card__mini-chart" aria-hidden="true">
          {metric.miniBars.map((bar, index) => (
            <b key={`${bar}-${index}`} style={{ height: `${bar}%` }} />
          ))}
        </div>
      )}
      <small>
        <i style={{ width: `${metric.progress}%` }} />
      </small>
    </Link>
  )
}

export default MetricCard
