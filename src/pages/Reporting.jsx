import { useMemo, useState } from 'react'
import InfoCard from '../components/cards/InfoCard.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const countByStatus = (items, statuses, key = 'status') =>
  statuses.map((status) => ({
    label: status,
    value: items.filter((item) => item[key] === status).length,
  }))

const countByRisk = (orders) =>
  ['niedrig', 'mittel', 'hoch'].map((risk) => ({
    label: risk,
    value: orders.filter((order) => order.risk === risk).length,
  }))

function ChartCard({ data, title }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <div className="status-bars">
        {data.map((item, index) => (
          <div className="status-bar" key={item.label}>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <i>
              <b className={index === 0 ? 'tone-active' : index === 1 ? 'tone-warning' : 'tone-risk'} style={{ width: `${Math.max((item.value / max) * 100, item.value ? 18 : 4)}%` }} />
            </i>
          </div>
        ))}
      </div>
    </article>
  )
}

function Reporting() {
  const {
    activeRFQs,
    activityLog,
    approvalCases,
    orders,
    rfqDrafts,
  } = useProcurement()
  const { showToast } = useToast()
  const [showReportPreview, setShowReportPreview] = useState(false)

  const openApprovals = approvalCases.filter((approval) => approval.status === 'Offen').length
  const preparedOrders = orders.filter((order) => order.status === 'Bestellung vorbereitet').length
  const completedActions =
    approvalCases.filter((approval) => approval.status !== 'Offen').length +
    orders.filter((order) => order.status === 'ERP-Übergabe erfolgt').length +
    activeRFQs.length
  const automationRate = Math.min(84, 68 + completedActions * 2)

  const charts = useMemo(() => [
    {
      title: 'RFQs nach Status',
      data: [
        { label: 'Entwurf', value: rfqDrafts.length },
        ...countByStatus(activeRFQs, ['Versendet', 'Angebote eingegangen']),
      ],
    },
    {
      title: 'Freigaben nach Status',
      data: countByStatus(approvalCases, ['Offen', 'Freigegeben', 'Abgelehnt']),
    },
    {
      title: 'Bestellungen nach Status',
      data: countByStatus(orders, ['Bestellung vorbereitet', 'Bestellung erstellt', 'ERP-Übergabe erfolgt']),
    },
    {
      title: 'Lieferantenrisiken',
      data: countByRisk(orders),
    },
  ], [activeRFQs, approvalCases, orders, rfqDrafts])

  const handleGenerateReport = () => {
    setShowReportPreview(true)
    showToast('Management-Report wurde generiert.')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Procura Intelligence</span>
        <h1>Reporting</h1>
        <p>
          Visualisierung von Einkaufskennzahlen, Einsparpotenzialen, Risiken und
          Lieferantenperformance auf Basis des aktuellen Prototyp-Zustands.
        </p>
      </div>

      <div className="process-hint">
        Ihr nächster sinnvoller Schritt: Management-Report generieren
      </div>

      <section className="basic-page__cards basic-page__cards--six">
        <InfoCard title="Aktive RFQs" value={String(activeRFQs.length)} text="versendet oder mit Angebotseingang" />
        <InfoCard title="RFQ-Entwürfe" value={String(rfqDrafts.length)} text="gespeicherte RFQ-Vorlagen" />
        <InfoCard title="Offene Freigaben" value={String(openApprovals)} text="Human-in-the-Loop erforderlich" />
        <InfoCard title="Erstellte Bestellungen" value={String(orders.length)} text="inkl. vorbereiteter Bestellungen" />
        <InfoCard title="Automatisierungsquote" value={`${automationRate} %`} text="aktuell berechneter Wert" />
        <InfoCard title="Einsparpotenzial" value="8,4 %" text="aus Verhandlung und Sourcing" />
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Einkaufskennzahlen</h2>
          <span>Statusübersicht nach RFQs, Freigaben und Bestellungen</span>
        </div>
        <div className="chart-grid chart-grid--four">
          {charts.map((chart) => (
            <ChartCard data={chart.data} key={chart.title} title={chart.title} />
          ))}
        </div>
      </section>

      <section className="basic-page__split">
        <article className="panel">
          <div className="section-header">
            <h2>Letzte Aktivitäten</h2>
            <span>aus den letzten Prozessaktionen</span>
          </div>
          <ol className="activity-list">
            {activityLog.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        </article>

        <aside className="report-card report-card--stacked">
          <div>
            <h2>Monatsreport</h2>
            <p>
              Erstellt eine kompakte Management-Sicht mit RFQs, Freigaben,
              Bestellungen, Risiken und Governance-Empfehlung.
            </p>
          </div>
          <button className="btn btn--primary" type="button" onClick={handleGenerateReport}>
            Management-Report generieren
          </button>
        </aside>
      </section>

      {showReportPreview && (
        <section className="report-preview">
          <div className="section-header">
            <h2>Management-Report Einkauf</h2>
            <span>Report-Vorschau</span>
          </div>
          <div className="report-preview__grid">
            <p>Zusammenfassung der aktiven RFQs: {activeRFQs.length} aktive Vorgänge.</p>
            <p>Anzahl offener Freigaben: {openApprovals} Fälle.</p>
            <p>Anzahl vorbereiteter Bestellungen: {preparedOrders} Bestellungen.</p>
            <p>Aktuelle Risiken: {orders.filter((order) => order.risk !== 'niedrig').length} Bestellungen mit mittlerem oder hohem Risiko.</p>
            <p>Empfehlung: Governance-Regeln regelmäßig prüfen, um Eskalationen gezielt zu steuern.</p>
          </div>
        </section>
      )}
    </section>
  )
}

export default Reporting
