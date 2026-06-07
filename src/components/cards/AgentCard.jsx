import { Link } from 'react-router-dom'
import StatusPill from '../StatusPill.jsx'

function AgentCard({ agent }) {
  const statusTone = agent.tone === 'amber' ? 'warning' : 'active'

  return (
    <Link className={`agent-card agent-card--${agent.tone} agent-card--link`} to={agent.path}>
      <div className="agent-card__icon">{agent.name.slice(0, 1)}</div>
      <div className="agent-card__content">
        <div className="agent-card__heading">
          <div>
            <strong>{agent.name}</strong>
            <span>{agent.domain}</span>
          </div>
          <StatusPill tone={statusTone}>{agent.status}</StatusPill>
        </div>
        <p>{agent.task}</p>
        <div className="agent-card__progress">
          <span>{agent.detail}</span>
          <span className="agent-card__progress-value">
            {agent.progressValue ? <strong>{agent.progressValue}</strong> : null}
            <em>{agent.progressMeta || `${agent.progress}%`}</em>
          </span>
          <i>
            <b style={{ width: `${agent.progress}%` }} />
          </i>
        </div>
      </div>
    </Link>
  )
}

export default AgentCard
