import { Link } from 'react-router-dom'
import AgentCard from '../components/cards/AgentCard.jsx'
import MetricCard from '../components/cards/MetricCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import StatusPill from '../components/StatusPill.jsx'
import ProcurementTable from '../components/tables/ProcurementTable.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { dataSources } from '../data/dashboardData.js'

const riskTone = {
  Niedrig: 'active',
  Mittel: 'warning',
  Hoch: 'risk',
}

const statusTone = {
  Offen: 'warning',
  Versendet: 'blue',
  'Angebote eingegangen': 'active',
  'Bestellung vorbereitet': 'warning',
  'Bestellung erstellt': 'neutral',
  'ERP-Übergabe erfolgt': 'active',
  'Verhandlung läuft': 'purple',
}

function Dashboard() {
  const {
    activeRFQs,
    approvalCases,
    negotiationCase,
    orders,
    selectedOffer,
    suppliers,
  } = useProcurement()

  const openApprovals = approvalCases.filter((approval) => approval.status === 'Offen')
  const supplierRiskCount = suppliers.filter((supplier) => supplier.risk !== 'Niedrig').length
  const activeProcurementCount = activeRFQs.length + orders.length + openApprovals.length
  const savingsPotential = selectedOffer || negotiationCase ? '9,1 %' : '8,4 %'

  const kpis = [
    {
      label: 'Aktive Beschaffungsvorgänge',
      value: String(activeProcurementCount),
      change: 'RFQs, Freigaben und Bestellungen',
      tone: 'blue',
      progress: Math.min(activeProcurementCount * 10, 100),
      path: '/bestellungen',
    },
    {
      label: 'Offene Freigaben',
      value: String(openApprovals.length),
      change: openApprovals.length ? 'Aktion erforderlich' : 'Keine Blocker',
      tone: 'amber',
      progress: Math.min(openApprovals.length * 28, 100),
      path: '/freigaben',
    },
    {
      label: 'Einsparpotenzial',
      value: savingsPotential,
      change: negotiationCase ? 'aus Verhandlung aktualisiert' : 'Demo-Prognose',
      tone: 'green',
      progress: negotiationCase ? 91 : 84,
      path: '/reporting',
      miniBars: [36, 54, 42, 76, 64],
    },
    {
      label: 'Lieferantenrisiken',
      value: String(supplierRiskCount),
      change: 'Mittel oder Hoch',
      tone: 'red',
      progress: Math.min(supplierRiskCount * 22, 100),
      path: '/lieferantensuche',
    },
    {
      label: 'Automatisierte RFQs',
      value: String(activeRFQs.length),
      change: 'Aktive RFQs',
      tone: 'purple',
      progress: Math.min(activeRFQs.length * 25, 100),
      path: '/rfqs',
    },
  ]

  const agents = [
    {
      name: 'Sourcing Agent',
      domain: 'Lieferantensuche & Marktanalyse',
      task: 'Findet passende Lieferanten nach Bedarf, Preislage und Risikoprofil.',
      detail: `${suppliers.length} Lieferanten im Monitoring`,
      progress: 78,
      status: 'Aktiv',
      tone: 'blue',
      path: '/lieferantensuche',
    },
    {
      name: 'Negotiation Agent',
      domain: 'Preisverhandlung',
      task: 'Verhandelt innerhalb definierter Governance-Grenzen.',
      detail: 'Aktive Verhandlungen',
      progress: negotiationCase ? 74 : 38,
      status: negotiationCase ? 'Verhandlung läuft' : 'Bereit',
      progressValue: '12',
      tone: 'purple',
      path: '/verhandlungen',
    },
    {
      name: 'Intelligence Agent',
      domain: 'Risiko- & Bedarfsüberwachung',
      task: 'Erkennt Risiken, offene Freigaben und Prozessblocker.',
      detail: `${openApprovals.length} offene Freigaben`,
      progress: openApprovals.length ? 88 : 62,
      status: 'Überwachung aktiv',
      tone: openApprovals.length ? 'amber' : 'blue',
      path: '/bedarfserkennung',
    },
    {
      name: 'Reporting Agent',
      domain: 'KPI & Berichtswesen',
      task: 'Erstellt Management-Sichten aus RFQs, Freigaben und Bestellungen.',
      detail: `${orders.length} Bestellungen ausgewertet`,
      progress: 58,
      status: 'Bereit',
      tone: 'neutral',
      path: '/reporting',
    },
  ]

  const processRows = [
    ...activeRFQs.map((rfq) => ({
      id: rfq.id,
      product: rfq.material || 'Material offen',
      supplier: rfq.suppliers || 'Lieferanten offen',
      status: rfq.status,
      tone: statusTone[rfq.status] || 'blue',
      nextStep: 'Angebotsvergleich',
      owner: 'RFQ Agent',
      path: '/angebotsvergleich',
    })),
    ...(negotiationCase ? [{
      id: negotiationCase.rfqId,
      product: negotiationCase.material,
      supplier: negotiationCase.supplier,
      status: negotiationCase.status,
      tone: 'purple',
      nextStep: 'Verhandlung prüfen',
      owner: 'Negotiation Agent',
      path: '/verhandlungen',
    }] : []),
    ...openApprovals.slice(0, 2).map((approval) => ({
      id: approval.id,
      product: approval.relatedMaterial,
      supplier: approval.relatedSupplier,
      status: approval.status,
      tone: 'warning',
      nextStep: 'Freigabe entscheiden',
      owner: 'Einkauf',
      path: '/freigaben',
    })),
    ...orders.map((order) => ({
      id: order.orderId,
      product: order.material,
      supplier: order.supplier,
      status: order.status,
      tone: statusTone[order.status] || 'neutral',
      nextStep: order.status === 'ERP-Übergabe erfolgt' ? 'Lieferbestätigung' : 'ERP-Status prüfen',
      owner: 'Order Agent',
      path: '/bestellungen',
    })),
  ].slice(0, 7)

  const recommendations = [
    supplierRiskCount > 0 && {
      label: 'Risiko',
      text: 'Lieferanten mit erhöhtem Risiko sollten geprüft werden.',
      time: 'Jetzt',
      tone: 'risk',
      path: '/lieferantensuche',
    },
    openApprovals.length > 0 && {
      label: 'Freigaben',
      text: 'Offene Freigaben blockieren aktuelle Beschaffungsvorgänge.',
      time: 'Jetzt',
      tone: 'warning',
      path: '/freigaben',
    },
    activeRFQs.length > 0 && {
      label: 'RFQs',
      text: 'Aktive RFQs können im Angebotsvergleich ausgewertet werden.',
      time: 'Heute',
      tone: 'purple',
      path: '/angebotsvergleich',
    },
    orders.length > 0 && {
      label: 'Bestellungen',
      text: 'Bestellungen sollten auf ERP-Status geprüft werden.',
      time: 'Heute',
      tone: 'active',
      path: '/bestellungen',
    },
  ].filter(Boolean)

  return (
    <>
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span>KI-gestützte Automatisierung</span>
          <h1>Intelligenter Einkaufsprozess</h1>
          <p>
            KI-Agenten überwachen Bedarfe, holen Angebote ein, vergleichen
            Lieferanten und eskalieren kritische Entscheidungen an den Einkauf.
          </p>
          <div className="hero-panel__meta">
            <span>4 Agenten aktiv</span>
            <span>{activeProcurementCount} Vorgänge im State</span>
            <span>{dataSources.length} Datenquellen</span>
          </div>
        </div>
        <div className="hero-panel__actions">
          <Link className="btn btn--primary" to="/rfqs">+ Neue RFQ erstellen</Link>
          <Link className="btn btn--secondary" to="/freigaben">
            Freigaben prüfen <strong>{openApprovals.length}</strong>
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
          <section className="panel panel--decisions">
            <SectionHeader
              eyebrow={`${openApprovals.length} offene Fälle · Human-in-the-Loop`}
              title="Human-in-the-Loop: Entscheidung erforderlich"
            />
            <div className="decision-list">
              {openApprovals.length === 0 && (
                <article className="decision-empty">
                  <p>Keine offenen Freigaben</p>
                  <Link className="btn btn--secondary btn--small" to="/freigaben">
                    Freigaben öffnen
                  </Link>
                </article>
              )}
              {openApprovals.slice(0, 3).map((approval, index) => (
                <article className="decision-card" key={approval.id}>
                  <div className="decision-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="decision-card__body">
                    <div className="decision-card__heading">
                      <strong>{approval.title}</strong>
                      <StatusPill tone={riskTone[approval.riskLevel]}>
                        Risiko: {approval.riskLevel}
                      </StatusPill>
                    </div>
                    <p>{approval.reason}</p>
                    <small>{approval.dataSource} · {approval.relatedSupplier}</small>
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
              eyebrow={`${processRows.length} Vorgänge angezeigt`}
              title="Laufende Beschaffungsvorgänge"
            />
            <ProcurementTable processes={processRows} />
          </section>
        </div>

        <aside className="dashboard__aside">
          <section className="panel recommendations">
            <SectionHeader eyebrow={`${recommendations.length} aktive Hinweise`} title="Empfehlungen" />
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

          <section className="panel panel--agents panel--agents-compact">
            <SectionHeader
              eyebrow="Status aus Prototyp-State"
              title="Aktive KI-Agenten"
            />
            <div className="agent-list agent-list--compact">
              {agents.map((agent) => (
                <AgentCard agent={agent} key={agent.name} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default Dashboard
