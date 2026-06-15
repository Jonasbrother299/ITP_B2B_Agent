import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Hoch: 'risk',
  Mittel: 'warning',
  Niedrig: 'active',
}

const statusTone = {
  Offen: 'warning',
  Freigegeben: 'active',
  Abgelehnt: 'risk',
}

function ApprovalDetailsModal({ approval, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        aria-modal="true"
        aria-labelledby="approval-modal-title"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Drilldown</span>
            <h2 id="approval-modal-title">Quellen & Protokoll</h2>
          </div>
          <StatusPill tone={riskTone[approval.riskLevel]}>
            Risiko: {approval.riskLevel}
          </StatusPill>
        </header>
        <div className="modal__body">
          <div>
            <h3>Datenquelle</h3>
            <p>{approval.dataSource}</p>
          </div>
          <div>
            <h3>Kontextdaten</h3>
            <p>
              Lieferant: {approval.relatedSupplier} · Material: {approval.relatedMaterial} ·
              Preis/Kontext: {approval.proposedPrice}
            </p>
          </div>
          <div>
            <h3>Governance-Auslöser</h3>
            <p>
              Ausgelöste Regel: {approval.title} · Risikostufe: {approval.riskLevel} ·
              Status: {approval.status}
            </p>
          </div>
          <div>
            <h3>Protokollnotiz</h3>
            <p>
              Dieses Fenster zeigt nur Quellen- und Kontextinformationen. Die
              finale Entscheidung wird im Hauptbereich der Freigabeseite
              getroffen.
            </p>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Schließen
          </button>
        </footer>
      </section>
    </div>
  )
}

function DetailField({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ApprovalOverviewCard({ approval, isActive }) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={`approval-overview-card ${isActive ? 'approval-overview-card--active' : ''}`}
      to={`/freigaben/${approval.id}`}
    >
      <div>
        <strong>{approval.title}</strong>
        <small>{approval.id} · {approval.relatedSupplier}</small>
      </div>
      <div className="approval-overview-card__badges">
        <StatusPill tone={riskTone[approval.riskLevel]}>
          Risiko: {approval.riskLevel}
        </StatusPill>
        <StatusPill tone={statusTone[approval.status]}>{approval.status}</StatusPill>
      </div>
    </Link>
  )
}

function ApprovalDetail({ approval, onApprove, onOpenModal, onReject }) {
  const isResolved = approval.status !== 'Offen'

  return (
    <article className={`approval-detail panel ${isResolved ? 'approval-detail--resolved' : ''}`}>
      <header className="approval-detail__header">
        <div>
          <span>{approval.id}</span>
          <h2>{approval.title}</h2>
          <p>{approval.relatedMaterial} · {approval.relatedSupplier}</p>
        </div>
        <div className="approval-detail__badges">
          <StatusPill tone={riskTone[approval.riskLevel]}>
            Risiko: {approval.riskLevel}
          </StatusPill>
          <StatusPill tone={statusTone[approval.status]}>{approval.status}</StatusPill>
        </div>
      </header>

      <dl className="approval-detail__grid">
        <DetailField label="Datenquelle" value={approval.dataSource} />
        <DetailField label="Lieferant" value={approval.relatedSupplier} />
        <DetailField label="Material" value={approval.relatedMaterial} />
        <DetailField label="Preis / Kontext" value={approval.proposedPrice} />
      </dl>

      <div className="approval-detail__body">
        <section>
          <h3>Warum ist eine Freigabe erforderlich?</h3>
          <p>{approval.reason}</p>
        </section>
        <section>
          <h3>KI-Empfehlung</h3>
          <p>{approval.aiRecommendation}</p>
        </section>
        <section>
          <h3>Nächste Schritte</h3>
          <p>
            Datenquelle prüfen, Empfehlung bewerten und Entscheidung im
            Einkauf dokumentieren.
          </p>
        </section>
      </div>

      <footer className="approval-detail__actions">
        <button className="btn btn--ghost" type="button" onClick={() => onOpenModal(approval)}>
          Quellen & Verlauf
        </button>
        <button className="btn btn--success" disabled={isResolved} type="button" onClick={() => onApprove(approval)}>
          Freigeben
        </button>
        <button className="btn btn--danger" disabled={isResolved} type="button" onClick={() => onReject(approval)}>
          Ablehnen
        </button>
        <Link className="btn btn--secondary" to="/bestellungen">
          Bestellungen öffnen
        </Link>
      </footer>
    </article>
  )
}

function ApprovalFallback({ id }) {
  return (
    <article className="approval-detail approval-detail--empty panel">
      <header className="approval-detail__header">
        <div>
          <span>{id ? `Vorgang ${id}` : 'Freigaben'}</span>
          <h2>{id ? 'Vorgang nicht gefunden' : 'Bitte Vorgang auswählen'}</h2>
          <p>
            {id
              ? 'Für diese Vorgangs-ID liegen im aktuellen Prototyp-State keine Freigabedaten vor.'
              : 'Wählen Sie oben einen Freigabefall aus, um die Detailprüfung zu öffnen.'}
          </p>
        </div>
      </header>
      <footer className="approval-detail__actions">
        <Link className="btn btn--primary" to="/freigaben">
          Freigaben öffnen
        </Link>
        <Link className="btn btn--secondary" to="/dashboard">
          Dashboard öffnen
        </Link>
      </footer>
    </article>
  )
}

function Freigaben() {
  const { id } = useParams()
  const { showToast } = useToast()
  const {
    approvalCases,
    resolveApproval,
    selectedApproval,
    setSelectedApproval,
  } = useProcurement()

  const fallbackApproval =
    approvalCases.find((approval) => approval.status === 'Offen') || approvalCases[0] || null
  const routeApproval = id
    ? approvalCases.find((approval) => approval.id === id)
    : null
  const activeApproval = id ? routeApproval : fallbackApproval
  const hasUnknownId = Boolean(id && !routeApproval)
  const openApprovals = approvalCases.filter((approval) => approval.status === 'Offen')

  const handleApprove = (approval) => {
    resolveApproval(approval, 'approved')
    setSelectedApproval(null)
    showToast('Freigabe erteilt. Bestellung wurde vorbereitet.')
  }

  const handleReject = (approval) => {
    resolveApproval(approval, 'rejected')
    setSelectedApproval(null)
    showToast('Freigabe wurde abgelehnt.', 'danger')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Human-in-the-Loop</span>
        <h1>Freigaben</h1>
        <p>
          Kritische oder komplexe Einkaufsentscheidungen werden zur menschlichen
          Prüfung weitergeleitet.
        </p>
      </div>

      <section className="approval-master panel">
        <div className="section-header">
          <h2>Prüffälle</h2>
          <span>{approvalCases.length} Fälle · {openApprovals.length} offen</span>
        </div>
        <div className="approval-master__list">
          {approvalCases.map((approval) => (
            <ApprovalOverviewCard
              approval={approval}
              isActive={activeApproval?.id === approval.id}
              key={approval.id}
            />
          ))}
        </div>
      </section>

      <section className="approval-detail-layout">
        {hasUnknownId && <ApprovalFallback id={id} />}
        {!hasUnknownId && activeApproval && (
          <ApprovalDetail
            approval={activeApproval}
            onApprove={handleApprove}
            onOpenModal={setSelectedApproval}
            onReject={handleReject}
          />
        )}
        {!hasUnknownId && !activeApproval && <ApprovalFallback />}

        <aside className="info-panel">
          <h2>Warum ist eine Freigabe erforderlich?</h2>
          <p>
            Die Governance-Regeln stoppen autonome KI-Entscheidungen bei
            Preisabweichungen, Compliance-Lücken oder Vertragsänderungen und
            übergeben sie an den Einkauf.
          </p>
        </aside>
      </section>

      {selectedApproval && (
        <ApprovalDetailsModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
        />
      )}
    </section>
  )
}

export default Freigaben
