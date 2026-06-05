import MetricCard from '../components/MetricCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Sidebar from '../components/Sidebar.jsx'
import StatusPill from '../components/StatusPill.jsx'
import Topbar from '../components/Topbar.jsx'
import {
  agents,
  decisions,
  kpis,
  navigationItems,
  procurementProcesses,
  recommendations,
} from '../data/dashboardData.js'

function Dashboard() {
  return (
    <div className="dashboard-shell">
      <Sidebar items={navigationItems} />

      <main className="dashboard">
        <Topbar />

        <section className="hero-panel">
          <div className="hero-panel__content">
            <span>Procurement command center</span>
            <h1>AI agents moving purchasing from request to compliant order.</h1>
            <p>
              Monitor autonomous sourcing, review exception decisions, and keep every
              procurement workflow aligned with policy and supplier strategy.
            </p>
          </div>
          <div className="hero-panel__summary" aria-label="Current automation summary">
            <strong>72%</strong>
            <span>Requests handled without manual touch</span>
          </div>
        </section>

        <section className="kpi-grid" aria-label="Procurement KPIs">
          {kpis.map((metric) => (
            <MetricCard metric={metric} key={metric.label} />
          ))}
        </section>

        <div className="dashboard__columns">
          <section className="panel">
            <SectionHeader eyebrow="Active AI agents" title="Autonomous work in progress" />
            <div className="agent-list">
              {agents.map((agent) => (
                <article className="agent-card" key={agent.name}>
                  <div>
                    <strong>{agent.name}</strong>
                    <p>{agent.task}</p>
                  </div>
                  <div className="agent-card__meta">
                    <StatusPill tone="active">{agent.status}</StatusPill>
                    <span>{agent.confidence} confidence</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <SectionHeader eyebrow="Human-in-the-loop" title="Decisions needing review" />
            <div className="decision-list">
              {decisions.map((decision) => (
                <article className="decision-card" key={decision.title}>
                  <div className="decision-card__heading">
                    <strong>{decision.title}</strong>
                    <StatusPill tone={decision.risk === 'High' ? 'risk' : 'warning'}>
                      {decision.risk} risk
                    </StatusPill>
                  </div>
                  <p>{decision.context}</p>
                  <small>{decision.recommendation}</small>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="panel">
          <SectionHeader eyebrow="Procurement process" title="Open purchasing workflows" />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Owner</th>
                  <th>Supplier</th>
                  <th>Stage</th>
                  <th>Spend</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {procurementProcesses.map((process) => (
                  <tr key={process.request}>
                    <td>{process.request}</td>
                    <td>{process.owner}</td>
                    <td>{process.supplier}</td>
                    <td>
                      <StatusPill>{process.stage}</StatusPill>
                    </td>
                    <td>{process.spend}</td>
                    <td>{process.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel recommendations">
          <SectionHeader eyebrow="System intelligence" title="Recommended next actions" />
          <div className="recommendations__grid">
            {recommendations.map((recommendation, index) => (
              <article className="recommendation-card" key={recommendation}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
