import { Link } from 'react-router-dom'
import AgentCard from '../components/cards/AgentCard.jsx'
import MetricCard from '../components/cards/MetricCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import StatusPill from '../components/StatusPill.jsx'
import ProcurementTable from '../components/tables/ProcurementTable.jsx'
import {
  agents,
  dataSources,
  decisions,
  kpis,
  procurementProcesses,
  recommendations,
} from '../data/dashboardData.js'

function Dashboard() {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span>KI-gestützte Automatisierung</span>
          <h1>Intelligenter Einkaufsprozess</h1>
          <p>
            KI-Agenten überwachen Bedarfe, holen Angebote ein, vergleichen Lieferanten
            und eskalieren kritische Entscheidungen an den Einkauf.
          </p>
          <div className="hero-panel__meta">
            <span>4 Agenten aktiv</span>
            <span>Sync vor 2 Min.</span>
            <span>5 Datenquellen</span>
          </div>
        </div>
        <div className="hero-panel__actions">
          <Link className="btn btn--primary" to="/rfqs">+ Neue RFQ erstellen</Link>
          <Link className="btn btn--secondary" to="/freigaben">
            Freigaben prüfen <strong>6</strong>
          </Link>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Procurement KPIs">
        {kpis.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </section>

      <div className="dashboard__body">
        <div className="dashboard__main">
          <section className="panel panel--agents">
            <SectionHeader
              eyebrow="4 Agenten im Einsatz · Kontinuierliche Ausführung"
              title="Aktive KI-Agenten"
            />
            <div className="agent-list">
              {agents.map((agent) => (
                <AgentCard agent={agent} key={agent.name} />
              ))}
            </div>
          </section>

          <section className="panel panel--decisions">
            <SectionHeader
              eyebrow="4 Fälle warten auf Prüfung · nach Priorität sortiert"
              title="Human-in-the-Loop: Entscheidung erforderlich"
            />
            <div className="decision-list">
              {decisions.map((decision, index) => (
                <article className="decision-card" key={decision.title}>
                  <div className="decision-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="decision-card__body">
                    <div className="decision-card__heading">
                      <strong>{decision.title}</strong>
                      <StatusPill tone={decision.tone}>{decision.risk}</StatusPill>
                    </div>
                    <p>{decision.context}</p>
                    <small>{decision.meta}</small>
                  </div>
                  <div className="decision-card__actions">
                    <Link className="btn btn--primary btn--small" to="/freigaben">Prüfen</Link>
                    <Link className="btn btn--success btn--small" to="/freigaben">Freigeben</Link>
                    <Link className="btn btn--ghost btn--small" to="/freigaben">Ablehnen</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="24 aktive Vorgänge · 6 angezeigt"
              title="Laufende Beschaffungsvorgänge"
            />
            <ProcurementTable processes={procurementProcesses} />
          </section>
        </div>

        <aside className="dashboard__aside">
          <section className="panel recommendations">
            <SectionHeader eyebrow="4 aktive Empfehlungen" title="System Intelligence" />
            <div className="recommendations__grid">
              {recommendations.map((recommendation) => (
                <Link
                  className={`recommendation-card recommendation-card--${recommendation.tone}`}
                  key={recommendation.text}
                  to={recommendation.path}
                >
                  <StatusPill tone={recommendation.tone}>{recommendation.label}</StatusPill>
                  <p>{recommendation.text}</p>
                  <div>
                    <span>{recommendation.time}</span>
                    <strong>Details ›</strong>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel data-sources">
            <SectionHeader eyebrow="5 von 5 aktiv" title="Datenquellen" />
            <div className="data-sources__list">
              {dataSources.map((source) => (
                <div className="data-source" key={source}>
                  <span>{source}</span>
                  <strong>Verbunden</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default Dashboard
