import { useEffect } from 'react'
import { Link } from 'react-router-dom'
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

function ApprovalDetailsModal({ approval, onApprove, onClose, onReject }) {
  const isResolved = approval.status !== 'Offen'

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
            <span>Freigabeprüfung</span>
            <h2 id="approval-modal-title">{approval.title}</h2>
          </div>
          <StatusPill tone={riskTone[approval.riskLevel]}>
            Risiko: {approval.riskLevel}
          </StatusPill>
        </header>
        <div className="modal__body">
          <div>
            <h3>Grund der Eskalation</h3>
            <p>{approval.reason}</p>
          </div>
          <div>
            <h3>KI-Empfehlung</h3>
            <p>{approval.aiRecommendation}</p>
          </div>
          <div>
            <h3>Datenquelle</h3>
            <p>{approval.dataSource}</p>
          </div>
          <div>
            <h3>Lieferant</h3>
            <p>{approval.relatedSupplier}</p>
          </div>
          <div>
            <h3>Material</h3>
            <p>{approval.relatedMaterial}</p>
          </div>
          <div>
            <h3>Vorgeschlagener Preis</h3>
            <p>{approval.proposedPrice}</p>
          </div>
          <div>
            <h3>Warum wurde dieser Fall eskaliert?</h3>
            <p>
              Dieser Fall wurde eskaliert, weil definierte Governance-Regeln
              überschritten wurden.
            </p>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn btn--success" disabled={isResolved} type="button" onClick={() => onApprove(approval)}>
            Freigeben
          </button>
          <button className="btn btn--danger" disabled={isResolved} type="button" onClick={() => onReject(approval)}>
            Ablehnen
          </button>
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Schließen
          </button>
        </footer>
      </section>
    </div>
  )
}

function Freigaben() {
  const { showToast } = useToast()
  const {
    approvalCases,
    resolveApproval,
    selectedApproval,
    setSelectedApproval,
  } = useProcurement()

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

      <section className="approval-layout">
        <div>
          <div className="approval-grid">
            {approvalCases.map((approval) => {
              const isResolved = approval.status !== 'Offen'

              return (
                <article className={`approval-card ${isResolved ? 'approval-card--resolved' : ''}`} key={approval.id}>
                  <div>
                    <h2>{approval.title}</h2>
                    <div className="approval-card__badges">
                      <StatusPill tone={riskTone[approval.riskLevel]}>
                        Risiko: {approval.riskLevel}
                      </StatusPill>
                      <StatusPill tone={statusTone[approval.status]}>{approval.status}</StatusPill>
                    </div>
                  </div>
                  <p>{approval.reason}</p>
                  <dl>
                    <div><dt>KI-Empfehlung</dt><dd>{approval.aiRecommendation}</dd></div>
                    <div><dt>Datenquelle</dt><dd>{approval.dataSource}</dd></div>
                    <div><dt>Lieferant</dt><dd>{approval.relatedSupplier}</dd></div>
                    <div><dt>Material</dt><dd>{approval.relatedMaterial}</dd></div>
                    <div><dt>Preis</dt><dd>{approval.proposedPrice}</dd></div>
                  </dl>
                  <div className="approval-card__actions">
                    <button
                      className="btn btn--ghost btn--small"
                      type="button"
                      onClick={() => setSelectedApproval(approval)}
                    >
                      Details prüfen
                    </button>
                    <button
                      className="btn btn--success btn--small"
                      disabled={isResolved}
                      type="button"
                      onClick={() => handleApprove(approval)}
                    >
                      Freigeben
                    </button>
                    <button
                      className="btn btn--danger btn--small"
                      disabled={isResolved}
                      type="button"
                      onClick={() => handleReject(approval)}
                    >
                      Ablehnen
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="section-actions section-actions--standalone">
            <Link className="btn btn--primary" to="/bestellungen">
              Zu Bestellungen
            </Link>
          </div>
        </div>

        <aside className="info-panel">
          <h2>Warum wurde eskaliert?</h2>
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
          onApprove={handleApprove}
          onClose={() => setSelectedApproval(null)}
          onReject={handleReject}
        />
      )}
    </section>
  )
}

export default Freigaben
