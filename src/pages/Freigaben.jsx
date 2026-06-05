import { useEffect, useState } from 'react'
import StatusPill from '../components/StatusPill.jsx'
import { pageContent } from '../data/pageData.js'

const approvalTone = {
  pending: 'warning',
  approved: 'active',
  rejected: 'risk',
}

const approvalLabel = {
  pending: 'Offen',
  approved: 'Freigegeben',
  rejected: 'Abgelehnt',
}

function Freigaben() {
  const page = pageContent.freigaben
  const [approvalStates, setApprovalStates] = useState(
    page.approvals.reduce((states, approval) => ({ ...states, [approval.title]: 'pending' }), {}),
  )
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!selectedApproval) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedApproval(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedApproval])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const updateApproval = (approval, status) => {
    setApprovalStates((states) => ({ ...states, [approval.title]: status }))
    setSelectedApproval(null)
    setToast({
      tone: status === 'approved' ? 'success' : 'danger',
      message:
        status === 'approved'
          ? 'Freigabe erfolgreich erteilt.'
          : 'Freigabe wurde abgelehnt.',
    })
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Human-in-the-Loop</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      <section className="approval-layout">
        <div className="approval-grid">
          {page.approvals.map((approval) => {
            const status = approvalStates[approval.title]
            const isResolved = status !== 'pending'

            return (
              <article className={`approval-card ${isResolved ? 'approval-card--resolved' : ''}`} key={approval.title}>
                <div>
                  <h2>{approval.title}</h2>
                  <div className="approval-card__badges">
                    <StatusPill tone={approval.risk === 'Hoch' ? 'risk' : 'warning'}>
                      Risiko: {approval.risk}
                    </StatusPill>
                    <StatusPill tone={approvalTone[status]}>{approvalLabel[status]}</StatusPill>
                  </div>
                </div>
                <p>{approval.reason}</p>
                <dl>
                  <div><dt>KI-Empfehlung</dt><dd>{approval.recommendation}</dd></div>
                  <div><dt>Datenquelle</dt><dd>{approval.source}</dd></div>
                </dl>
                <div className="approval-card__actions">
                  <button
                    className="btn btn--success btn--small"
                    disabled={isResolved}
                    type="button"
                    onClick={() => updateApproval(approval, 'approved')}
                  >
                    Freigeben
                  </button>
                  <button
                    className="btn btn--danger btn--small"
                    disabled={isResolved}
                    type="button"
                    onClick={() => updateApproval(approval, 'rejected')}
                  >
                    Ablehnen
                  </button>
                  <button
                    className="btn btn--ghost btn--small"
                    type="button"
                    onClick={() => setSelectedApproval(approval)}
                  >
                    Details prüfen
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="info-panel">
          <h2>{page.infoBox.title}</h2>
          <p>{page.infoBox.text}</p>
        </aside>
      </section>

      {selectedApproval && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedApproval(null)}>
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
                <h2 id="approval-modal-title">{selectedApproval.title}</h2>
              </div>
              <StatusPill tone={selectedApproval.risk === 'Hoch' ? 'risk' : 'warning'}>
                Risiko: {selectedApproval.risk}
              </StatusPill>
            </header>
            <div className="modal__body">
              <div>
                <h3>Grund der Eskalation</h3>
                <p>{selectedApproval.reason}</p>
              </div>
              <div>
                <h3>KI-Empfehlung</h3>
                <p>{selectedApproval.recommendation}</p>
              </div>
              <div>
                <h3>Datenquelle</h3>
                <p>{selectedApproval.source}</p>
              </div>
              <div>
                <h3>Warum wurde dieser Fall eskaliert?</h3>
                <p>
                  Der Vorgang liegt außerhalb der definierten Autonomiegrenzen und
                  benötigt eine menschliche Entscheidung, bevor der Einkaufsprozess
                  fortgesetzt wird.
                </p>
              </div>
            </div>
            <footer className="modal__footer">
              <button className="btn btn--success" type="button" onClick={() => updateApproval(selectedApproval, 'approved')}>
                Freigeben
              </button>
              <button className="btn btn--danger" type="button" onClick={() => updateApproval(selectedApproval, 'rejected')}>
                Ablehnen
              </button>
              <button className="btn btn--ghost" type="button" onClick={() => setSelectedApproval(null)}>
                Schließen
              </button>
            </footer>
          </section>
        </div>
      )}

      {toast && (
        <div className={`toast toast--${toast.tone}`} role="status">
          {toast.message}
        </div>
      )}
    </section>
  )
}

export default Freigaben
