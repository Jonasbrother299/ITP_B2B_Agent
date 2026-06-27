import { Link, useNavigate } from 'react-router-dom'
import ActionMenu from '../components/ActionMenu.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Hoch: 'risk',
  Mittel: 'warning',
  Niedrig: 'active',
}

const statusTone = {
  Offen: 'risk',
  Freigegeben: 'active',
  Abgelehnt: 'risk',
}

function Freigaben() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { approvalCases } = useProcurement()

  const openApprovals = approvalCases.filter((approval) => approval.status === 'Offen')
  const nextApproval = openApprovals[0] || approvalCases[0]

  const handleSelectApproval = (approvalId) => {
    if (approvalId) {
      navigate(`/vorgaenge/${approvalId}`)
    }
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Human-in-the-Loop</span>
        <h1>Freigaben</h1>
        <p>
          Kritische Beschaffungsvorgänge werden hier priorisiert. Die vollständige
          Prüfung erfolgt immer in der zentralen Vorgangsdetailseite.
        </p>
      </div>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Prüffall auswählen</h2>
          <span>{openApprovals.length} offene Freigaben</span>
        </div>
        <div className="approval-selector">
          <label className="form-field">
            <span className="form-field__label">Vorgang</span>
            <select
              className="form-field__select"
              value=""
              onChange={(event) => handleSelectApproval(event.target.value)}
            >
              <option value="">Vorgang zur Detailprüfung auswählen</option>
              {approvalCases.map((approval) => (
                <option key={approval.id} value={approval.id}>
                  {approval.id} · {approval.title}
                </option>
              ))}
            </select>
          </label>
          {nextApproval && (
            <Link className="btn btn--primary" to={`/vorgaenge/${nextApproval.id}`}>
              Nächste Freigabe prüfen
            </Link>
          )}
        </div>
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Freigaben durch Einkauf</h2>
          <span>Übersicht ohne eigene Detailkopie</span>
        </div>
        <div className="approval-master__list approval-master__list--wide">
          {approvalCases.map((approval) => {
            return (
              <article
                className={`approval-overview-card ${approval.status !== 'Offen' ? 'approval-overview-card--resolved' : ''}`}
                key={approval.id}
              >
                <div>
                  <small>{approval.id} · {approval.dataSource}</small>
                  <strong>{approval.title}</strong>
                  <p>{approval.reason}</p>
                  <dl className="compact-meta-list">
                    <div><dt>Lieferant</dt><dd>{approval.relatedSupplier}</dd></div>
                    <div><dt>Material</dt><dd>{approval.relatedMaterial}</dd></div>
                    <div><dt>Preis</dt><dd>{approval.proposedPrice}</dd></div>
                  </dl>
                </div>
                <div className="approval-overview-card__badges">
                  <StatusPill tone={riskTone[approval.riskLevel]}>Risiko: {approval.riskLevel}</StatusPill>
                  <StatusPill tone={statusTone[approval.status] || 'neutral'}>{approval.status}</StatusPill>
                  <ActionMenu
                    actions={[
                      { label: 'Öffnen', to: `/vorgaenge/${approval.id}` },
                      { label: 'Prüfen', to: `/vorgaenge/${approval.id}` },
                      {
                        label: 'Nachricht senden',
                        onClick: () => showToast('Team-Nachricht wird vorbereitet.', 'info'),
                      },
                    ]}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}

export default Freigaben
