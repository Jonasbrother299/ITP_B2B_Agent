import { useState } from 'react'
import { useParams } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import TooltipTerm from '../components/TooltipTerm.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'
import { useUi } from '../context/useUi.js'

const riskTone = {
  Hoch: 'risk',
  Mittel: 'warning',
  Niedrig: 'active',
}

const statusTone = {
  'Prüfung erforderlich': 'risk',
  Offen: 'risk',
  Freigegeben: 'active',
  Abgelehnt: 'risk',
  Versendet: 'blue',
  'Angebote eingegangen': 'active',
  'Bestellung vorbereitet': 'warning',
  'Bestellung erstellt': 'neutral',
  'ERP-Übergabe erfolgt': 'active',
}

function OfferGrid({ activeOfferId, offers, onSelectOffer }) {
  return (
    <div className="case-offer-grid">
      {offers.map((offer) => (
        <article className={`case-offer-card ${offer.id === activeOfferId ? 'case-offer-card--active' : ''}`} key={offer.id}>
          <header>
            <h3>{offer.supplier}</h3>
            <StatusPill tone={offer.recommended ? 'active' : riskTone[offer.risk]}>
              {offer.recommended ? 'KI-Empfehlung' : offer.risk}
            </StatusPill>
          </header>
          <dl>
            <div><dt>Preis</dt><dd>{offer.currentPrice}</dd></div>
            <div><dt>Lieferzeit</dt><dd>{offer.deliveryTime}</dd></div>
            <div><dt>Risiko</dt><dd>{offer.risk}</dd></div>
            <div><dt>Qualität</dt><dd>{offer.quality}</dd></div>
            <div><dt>Historie</dt><dd>{offer.history}</dd></div>
          </dl>
          <p>{offer.aiReason}</p>
          {!offer.recommended && <small>Warum nicht: {offer.whyNot}</small>}
          <button className="btn btn--secondary btn--small" type="button" onClick={() => onSelectOffer(offer)}>
            Angebot ansehen
          </button>
        </article>
      ))}
    </div>
  )
}

function ProcessTimeline({ steps }) {
  return (
    <ol className="process-timeline case-process-timeline">
      {steps.map((step) => (
        <li className={`process-timeline__item process-timeline__item--${step.status}`} key={step.id}>
          <div className="process-timeline__marker" aria-hidden="true" />
          <div className="process-timeline__content">
            <div>
              <h3>{step.title}</h3>
              <StatusPill tone={step.status === 'abgeschlossen' ? 'active' : step.status === 'aktuell' ? 'warning' : 'neutral'}>
                {step.status}
              </StatusPill>
            </div>
            <p>{step.description}</p>
            <span>{step.time}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

function VorgangDetail() {
  const { id } = useParams()
  const { approvalCases, getProcurementCase, resolveApproval } = useProcurement()
  const { showToast } = useToast()
  const { openSourceDrawer, openTeamDrawer } = useUi()
  const procurementCase = getProcurementCase(id)
  const [activeOfferId, setActiveOfferId] = useState(null)

  if (!procurementCase) {
    return (
      <section className="basic-page">
        <div className="basic-page__hero">
          <span>Vorgang</span>
          <h1>Vorgang nicht gefunden</h1>
          <p>Für diese ID liegen im aktuellen Prototyp keine Vorgangsdaten vor.</p>
        </div>
      </section>
    )
  }

  const canResolveApproval = procurementCase.type === 'approval' && procurementCase.status === 'Prüfung erforderlich'
  const activeOffer =
    procurementCase.offers.find((offer) => offer.id === (activeOfferId || procurementCase.selectedOfferId)) ||
    procurementCase.offers[0]

  const handleApprove = () => {
    if (!canResolveApproval) {
      showToast('Für diesen Vorgang ist keine Freigabe offen.', 'info')
      return
    }

    const approval = approvalCases.find((item) => item.id === procurementCase.id)
    if (!approval) {
      showToast('Für diesen Vorgang ist keine Freigabe offen.', 'info')
      return
    }

    resolveApproval(approval, 'approved')
    showToast('Freigabe erteilt. Bestellung wurde vorbereitet.')
  }

  const teamContext = {
    rfqId: procurementCase.rfqId,
    material: procurementCase.material,
    supplier: procurementCase.supplier,
    recommendation: procurementCase.decision.recommendation,
    risk: procurementCase.riskLevel,
  }

  return (
    <section className="basic-page case-detail-page">
      <header className="approval-review-header panel">
        <div className="approval-review-header__top">
          <span>Aktualisiert {procurementCase.updatedAt}</span>
        </div>
        <div className="approval-review-header__content">
          <div>
            <span>{procurementCase.id}</span>
            <h1>{procurementCase.title}</h1>
            <p>{procurementCase.rfqId} · {procurementCase.supplier}</p>
          </div>
          <div className="approval-review-header__badges">
            <StatusPill tone={statusTone[procurementCase.status] || 'neutral'}>{procurementCase.status}</StatusPill>
            <StatusPill tone={riskTone[procurementCase.riskLevel]}>Risiko: {procurementCase.riskLevel}</StatusPill>
          </div>
        </div>
      </header>

      <div className="approval-review-layout">
        <main className="approval-review-main">
          <section className="approval-review-card approval-review-card--decision panel">
            <div className="approval-review-card__header">
              <div>
                <span>Entscheidungsbereich</span>
                <h2>{procurementCase.decision.title}</h2>
              </div>
              <StatusPill tone="warning">
                <TooltipTerm label="Human-in-the-Loop bedeutet, dass ein Mensch eine kritische KI-Empfehlung prüft.">
                  Human-in-the-Loop
                </TooltipTerm>
              </StatusPill>
            </div>
            <div className="approval-decision-grid">
              <div className="approval-decision-summary">
                <article>
                  <h3>Grund</h3>
                  <p>{procurementCase.decision.reason}</p>
                </article>
                <article>
                  <h3>KI-Empfehlung</h3>
                  <p>{procurementCase.decision.recommendation}</p>
                </article>
                <article>
                  <h3>Kontext</h3>
                  <p>{procurementCase.decision.context}</p>
                </article>
              </div>
              <div className="approval-decision-actions">
                <span>Aktionen</span>
                <button className="btn btn--primary" disabled={!canResolveApproval} type="button" onClick={handleApprove}>
                  Freigabe vorbereiten
                </button>
                <button className="btn btn--secondary" type="button" onClick={() => openTeamDrawer(teamContext)}>
                  Team fragen
                </button>
                <button className="btn btn--danger" type="button" onClick={() => showToast('Vorgang wurde zur Eskalation markiert.', 'danger')}>
                  Eskalieren
                </button>
              </div>
            </div>
          </section>

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Angebote</span>
                <h2>Angebotsvergleich</h2>
              </div>
              <StatusPill tone="info">
                <TooltipTerm label="RFQ steht für Request for Quotation, also eine Angebotsanfrage.">
                  RFQ
                </TooltipTerm>
              </StatusPill>
            </div>
            <OfferGrid activeOfferId={activeOffer?.id} offers={procurementCase.offers} onSelectOffer={(offer) => setActiveOfferId(offer.id)} />
          </section>

          {activeOffer && (
            <section className="approval-review-card panel">
              <div className="approval-review-card__header">
                <div>
                  <span>Ausgewähltes Angebot</span>
                  <h2>{activeOffer.supplier}</h2>
                </div>
                <StatusPill tone={activeOffer.recommended ? 'active' : riskTone[activeOffer.risk]}>
                  {activeOffer.recommended ? 'Empfohlen' : activeOffer.risk}
                </StatusPill>
              </div>
              <div className="selected-offer-grid">
                <div><span>Preis</span><strong>{activeOffer.currentPrice}</strong></div>
                <div><span>Zielpreis</span><strong>{activeOffer.targetDeviation}</strong></div>
                <div><span>Lieferzeit</span><strong>{activeOffer.deliveryTime}</strong></div>
                <div><span>Zahlungsbedingungen</span><strong>{activeOffer.paymentTerms}</strong></div>
                <div><span>Risiko</span><strong>{activeOffer.risk}</strong></div>
                <div><span>Qualität</span><strong>{activeOffer.quality}</strong></div>
              </div>
              {activeOffer.negotiationHistory.length > 0 && (
                <div className="negotiation-history">
                  <h3>Verhandlungsverlauf</h3>
                  <ol>
                    {activeOffer.negotiationHistory.map((item) => <li key={item}>{item}</li>)}
                  </ol>
                </div>
              )}
            </section>
          )}

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Quellen & Protokoll</span>
                <h2>Nachvollziehbarkeit</h2>
              </div>
              <StatusPill tone="info">Klickbare Quellen</StatusPill>
            </div>
            <div className="source-protocol-grid">
              <div>
                <h3>Quellen</h3>
                {procurementCase.sources.map((source) => (
                  <button className="source-link" key={source.title} type="button" onClick={() => openSourceDrawer(source)}>
                    {source.title}
                  </button>
                ))}
              </div>
              <div>
                <h3>Historie</h3>
                <ol>
                  {procurementCase.history.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </div>
            </div>
          </section>
        </main>

        <aside className="approval-review-sidebar">
          <section className="approval-sidebar-card">
            <h2>Vorgangsstatus</h2>
            <StatusPill tone={statusTone[procurementCase.status] || 'neutral'}>{procurementCase.status}</StatusPill>
            <dl>
              <div><dt>Material</dt><dd>{procurementCase.material}</dd></div>
              <div><dt>Lieferant</dt><dd>{procurementCase.supplier}</dd></div>
              <div><dt>RFQ</dt><dd>{procurementCase.rfqId}</dd></div>
            </dl>
          </section>
          <section className="approval-sidebar-card">
            <h2>Risiken & Leitplanken</h2>
            <ul>
              <li>Preisgrenze wird gegen Governance-Regeln geprüft.</li>
              <li>Risiko: {procurementCase.riskLevel}</li>
              <li>
                <TooltipTerm label="Governance beschreibt die Regeln, innerhalb derer KI-Agenten autonom handeln dürfen.">
                  Governance-Regeln aktiv
                </TooltipTerm>
              </li>
            </ul>
          </section>
          <section className="approval-sidebar-card approval-sidebar-card--process">
            <div className="approval-review-card__header">
              <div>
                <span>Prozess</span>
                <h2>Vorgangsverlauf</h2>
              </div>
            </div>
            <ProcessTimeline steps={procurementCase.processSteps} />
          </section>
        </aside>
      </div>
    </section>
  )
}

export default VorgangDetail
