import { useState } from 'react'
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
  Offen: 'risk',
  Versendet: 'blue',
  'Angebote eingegangen': 'active',
  'Bestellung vorbereitet': 'warning',
  'Bestellung erstellt': 'neutral',
  'ERP-Übergabe erfolgt': 'active',
  'Verhandlung läuft': 'blue',
}

const defaultDashboardWidgets = [
  { id: 'approvals', label: 'Freigaben', visible: true, priority: 'Hoch' },
  { id: 'recommendations', label: 'Risiken', visible: true, priority: 'Hoch' },
  { id: 'processes', label: 'RFQs', visible: true, priority: 'Mittel' },
  { id: 'agents', label: 'KI-Agenten', visible: true, priority: 'Mittel' },
  { id: 'prices', label: 'Preisentwicklungen', visible: false, priority: 'Niedrig' },
  { id: 'delays', label: 'Verzögerungen', visible: false, priority: 'Niedrig' },
]

const readSavedDashboardWidgets = () => {
  try {
    const savedWidgets = window.localStorage.getItem('procura-dashboard-widgets')
    if (!savedWidgets) {
      return defaultDashboardWidgets
    }

    const parsedWidgets = JSON.parse(savedWidgets)
    return defaultDashboardWidgets.map((widget) => ({
      ...widget,
      ...parsedWidgets.find((savedWidget) => savedWidget.id === widget.id),
    }))
  } catch {
    return defaultDashboardWidgets
  }
}

function Dashboard() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [dashboardWidgets, setDashboardWidgets] = useState(readSavedDashboardWidgets)
  const [draftDashboardWidgets, setDraftDashboardWidgets] = useState(dashboardWidgets)
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
      label: 'Aktive Vorgänge',
      value: String(activeProcurementCount),
      change: 'RFQs, Freigaben, Bestellungen',
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
      change: negotiationCase ? 'aus Verhandlung aktualisiert' : 'Prognosewert',
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
      tone: 'blue',
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
      detail: '2 aktive Verhandlungen',
      progress: negotiationCase ? 74 : 38,
      status: negotiationCase ? 'Verhandlung läuft' : 'Bereit',
      progressMeta: `${negotiationCase ? 74 : 38}%`,
      tone: 'blue',
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
      task: 'Erstellt Management-Sichten aus RFQs, Freigaben, Bestellungen.',
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
      path: `/vorgaenge/${rfq.id}`,
    })),
    ...(negotiationCase ? [{
      id: negotiationCase.rfqId,
      product: negotiationCase.material,
      supplier: negotiationCase.supplier,
      status: negotiationCase.status,
      tone: 'blue',
      nextStep: 'Verhandlung prüfen',
      owner: 'Negotiation Agent',
      path: `/vorgaenge/${negotiationCase.rfqId}`,
    }] : []),
    ...openApprovals.slice(0, 2).map((approval) => ({
      id: approval.id,
      product: approval.relatedMaterial,
      supplier: approval.relatedSupplier,
      status: approval.status,
      tone: 'risk',
      nextStep: 'Freigabe entscheiden',
      owner: 'Einkauf',
      path: `/vorgaenge/${approval.id}`,
    })),
    ...orders.map((order) => ({
      id: order.orderId,
      product: order.material,
      supplier: order.supplier,
      status: order.status,
      tone: statusTone[order.status] || 'neutral',
      nextStep: order.status === 'ERP-Übergabe erfolgt' ? 'Lieferbestätigung' : 'ERP-Status prüfen',
      owner: 'Order Agent',
      path: `/vorgaenge/${order.orderId}`,
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
      label: 'Anfragen / RFQs',
      text: 'Aktive RFQs können im Angebotsvergleich ausgewertet werden.',
      time: 'Heute',
      tone: 'blue',
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

  const isWidgetVisible = (widgetId) =>
    dashboardWidgets.find((widget) => widget.id === widgetId)?.visible

  const widgetOrderClass = (widgetId) => {
    const order = dashboardWidgets.findIndex((widget) => widget.id === widgetId) + 1
    return `dashboard-widget-order-${order}`
  }

  const openCustomizer = () => {
    setDraftDashboardWidgets(dashboardWidgets)
    setIsCustomizerOpen(true)
  }

  const cancelCustomizer = () => {
    setDraftDashboardWidgets(dashboardWidgets)
    setIsCustomizerOpen(false)
  }

  const saveCustomizer = () => {
    setDashboardWidgets(draftDashboardWidgets)
    window.localStorage.setItem('procura-dashboard-widgets', JSON.stringify(draftDashboardWidgets))
    setIsCustomizerOpen(false)
  }

  const resetCustomizer = () => {
    window.localStorage.removeItem('procura-dashboard-widgets')
    setDashboardWidgets(defaultDashboardWidgets)
    setDraftDashboardWidgets(defaultDashboardWidgets)
  }

  const toggleDraftWidget = (widgetId) => {
    setDraftDashboardWidgets((widgets) =>
      widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget,
      ),
    )
  }

  const updateDraftWidgetPriority = (widgetId, priority) => {
    setDraftDashboardWidgets((widgets) =>
      widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, priority } : widget,
      ),
    )
  }

  const moveDraftWidget = (widgetId, direction) => {
    setDraftDashboardWidgets((widgets) => {
      const currentIndex = widgets.findIndex((widget) => widget.id === widgetId)
      const nextIndex = currentIndex + direction

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= widgets.length) {
        return widgets
      }

      const nextWidgets = [...widgets]
      const [widget] = nextWidgets.splice(currentIndex, 1)
      nextWidgets.splice(nextIndex, 0, widget)
      return nextWidgets
    })
  }

  return (
    <>
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span>KI-gestützte Automatisierung</span>
          <h1>KI-gestützter Einkaufsprozess</h1>
          <p>
            KI-Agenten überwachen Bedarfe, holen Angebote ein, vergleichen
            Lieferanten und eskalieren kritische Entscheidungen an den Einkauf.
          </p>
          <div className="hero-panel__meta">
            <span>4 Agenten aktiv</span>
            <span>{activeProcurementCount} aktive Vorgänge</span>
            <span>{dataSources.length} Datenquellen</span>
          </div>
        </div>
        <div className="hero-panel__actions">
          <button className="btn btn--ghost" type="button" onClick={openCustomizer}>
            Dashboard anpassen
          </button>
          <Link className="btn btn--primary" to="/rfqs">+ Neue RFQ erstellen</Link>
          <Link className="btn btn--secondary" to="/freigaben">
            Freigaben prüfen <strong>{openApprovals.length}</strong>
          </Link>
        </div>
      </section>

      {isCustomizerOpen && (
        <section className="panel dashboard-customizer" aria-label="Dashboard anpassen">
          <div className="section-header">
            <h2>Dashboard anpassen</h2>
            <span>Widgets aktivieren, priorisieren und Reihenfolge ändern</span>
          </div>
          <div className="dashboard-customizer__list">
            {draftDashboardWidgets.map((widget, index) => (
              <article className="dashboard-customizer__item" key={widget.id}>
                <div className="dashboard-customizer__widget">
                  <span>Widget</span>
                  <strong>{widget.label}</strong>
                </div>
                <label className="dashboard-customizer__visibility">
                  <input
                    checked={widget.visible}
                    type="checkbox"
                    onChange={() => toggleDraftWidget(widget.id)}
                  />
                  <span>Anzeigen</span>
                </label>
                <label className="dashboard-customizer__priority">
                  <span>Priorität</span>
                  <select
                    className="form-field__select"
                    value={widget.priority}
                    onChange={(event) => updateDraftWidgetPriority(widget.id, event.target.value)}
                  >
                    <option>Hoch</option>
                    <option>Mittel</option>
                    <option>Niedrig</option>
                  </select>
                </label>
                <div className="dashboard-customizer__order" aria-label={`Reihenfolge für ${widget.label}`}>
                  <span>Reihenfolge</span>
                  <div>
                    <button className="btn btn--ghost btn--small" disabled={index === 0} type="button" onClick={() => moveDraftWidget(widget.id, -1)}>
                      ↑ Nach oben
                    </button>
                    <button className="btn btn--ghost btn--small" disabled={index === draftDashboardWidgets.length - 1} type="button" onClick={() => moveDraftWidget(widget.id, 1)}>
                      ↓ Nach unten
                    </button>
                  </div>
                </div>
                <div className="dashboard-customizer__status">
                  <span>Status</span>
                  <strong>{widget.visible ? 'Wird angezeigt' : 'Ausgeblendet'}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className="dashboard-customizer__footer">
            <button className="btn btn--ghost" type="button" onClick={resetCustomizer}>
              Zurücksetzen
            </button>
            <div>
              <button className="btn btn--secondary" type="button" onClick={cancelCustomizer}>
                Abbrechen
              </button>
              <button className="btn btn--primary" type="button" onClick={saveCustomizer}>
                Speichern
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="kpi-grid" aria-label="Procura KPIs">
        {kpis.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </section>

      <div className="process-hint dashboard-next-step">
        Ihr nächster sinnvoller Schritt: wichtigste offene Freigabe prüfen
      </div>

      <div className="dashboard-process-stepper" aria-label="Procura Prozess">
        {[
          ['Bedarf erkannt', '/bedarfserkennung'],
          ['RFQ', '/rfqs'],
          ['Angebotsvergleich', '/angebotsvergleich'],
          ['Verhandlung', '/verhandlungen'],
          ['Freigabe', '/freigaben'],
          ['Bestellung', '/bestellungen'],
          ['Reporting', '/reporting'],
        ].map(([label, path], index) => (
          <Link key={label} to={path}>
            <span>{index + 1}</span>
            {label}
          </Link>
        ))}
      </div>

      <div className="dashboard__body">
        <div className="dashboard__main">
          <section className={`panel panel--decisions ${widgetOrderClass('approvals')} ${isWidgetVisible('approvals') ? '' : 'dashboard-widget--hidden'}`}>
            <SectionHeader
              eyebrow={`${openApprovals.length} offene Fälle · Human-in-the-Loop`}
              title="Freigaben durch Einkauf"
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
                    <Link className="btn btn--primary btn--small" to={`/vorgaenge/${approval.id}`}>Prüfen</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={`panel dashboard-process-widget ${widgetOrderClass('processes')} ${isWidgetVisible('processes') ? '' : 'dashboard-widget--hidden'}`}>
            <SectionHeader
              eyebrow={`${processRows.length} laufende Vorgänge`}
              title="Laufende Beschaffungsvorgänge"
            />
            <ProcurementTable processes={processRows} />
          </section>
        </div>

        <aside className="dashboard__aside">
          <section className={`panel recommendations ${widgetOrderClass('recommendations')} ${isWidgetVisible('recommendations') ? '' : 'dashboard-widget--hidden'}`}>
            <SectionHeader eyebrow={`${recommendations.length} aktive Hinweise`} title="KI-Empfehlungen" />
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

          <section className={`panel panel--agents ${widgetOrderClass('agents')} ${isWidgetVisible('agents') ? '' : 'dashboard-widget--hidden'}`}>
            <SectionHeader
              eyebrow="Aktueller Agentenstatus"
              title="Aktive KI-Agenten"
            />
            <div className="agent-list">
              {agents.map((agent) => (
                <AgentCard agent={agent} key={agent.name} />
              ))}
            </div>
          </section>
        </aside>

        <section className={`panel dashboard-placeholder-widget ${widgetOrderClass('prices')} ${isWidgetVisible('prices') ? '' : 'dashboard-widget--hidden'}`}>
          <SectionHeader eyebrow="Optionales Widget" title="Preisentwicklungen" />
          <div className="dashboard-placeholder-widget__body">
            <p>Preisverläufe werden im nächsten Prototyp-Schritt mit RFQ- und Angebotsdaten verbunden.</p>
          </div>
        </section>

        <section className={`panel dashboard-placeholder-widget ${widgetOrderClass('delays')} ${isWidgetVisible('delays') ? '' : 'dashboard-widget--hidden'}`}>
          <SectionHeader eyebrow="Optionales Widget" title="Verzögerungen" />
          <div className="dashboard-placeholder-widget__body">
            <p>Lieferverzüge und blockierte Vorgänge werden hier priorisiert dargestellt.</p>
          </div>
        </section>
      </div>
    </>
  )
}

export default Dashboard
