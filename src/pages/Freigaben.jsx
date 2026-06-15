import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Hoch: 'risk',
  Mittel: 'warning',
  Niedrig: 'active',
}

const offerComparison = [
  {
    id: 'offer-mueller',
    supplier: 'Müller GmbH',
    startPrice: '49.800 €',
    currentPrice: '43.900 €',
    deviation: '+12,4 %',
    deliveryTime: '9 Tage',
    risk: 'Niedrig',
    rating: '92/100',
    paymentTerms: '30 Tage netto',
    negotiationHistory: [
      'Initialangebot bei 49.800 € eingegangen',
      'Negotiation Agent hat Gegenangebot vorbereitet',
      'Lieferant senkt Preis auf 43.900 €',
      'Finale Freigabe durch Einkauf erforderlich',
    ],
    selected: true,
  },
  {
    id: 'offer-northline',
    supplier: 'Northline Supply',
    startPrice: '47.600 €',
    currentPrice: '45.200 €',
    deviation: '+15,8 %',
    deliveryTime: '11 Tage',
    risk: 'Mittel',
    rating: '88/100',
    paymentTerms: '14 Tage netto',
    negotiationHistory: [],
    selected: false,
  },
  {
    id: 'offer-sensortech',
    supplier: 'SensorTech AG',
    startPrice: '52.400 €',
    currentPrice: '48.700 €',
    deviation: '+24,7 %',
    deliveryTime: '7 Tage',
    risk: 'Niedrig',
    rating: '86/100',
    paymentTerms: 'Vorkasse',
    negotiationHistory: [],
    selected: false,
  },
]

const selectedOffer = offerComparison.find((offer) => offer.selected)

const processSteps = [
  {
    id: 'demand',
    title: 'Bedarf erkannt',
    description: 'Bedarf für Bauteil A-482 erkannt',
    status: 'abgeschlossen',
    time: 'vor 3 Tagen',
  },
  {
    id: 'rfq',
    title: 'Lieferanten angefragt',
    description: 'RFQ an passende Lieferanten versendet',
    status: 'abgeschlossen',
    time: 'vor 2 Tagen',
  },
  {
    id: 'offers',
    title: 'Angebote erhalten',
    description: '3 Angebote eingegangen',
    status: 'abgeschlossen',
    time: 'vor 1 Tag',
  },
  {
    id: 'negotiation',
    title: 'KI-Vorverhandlung abgeschlossen',
    description: 'Preise und Konditionen wurden innerhalb der Regeln verhandelt',
    status: 'abgeschlossen',
    time: 'vor 4 Stunden',
  },
  {
    id: 'review',
    title: 'Menschliche Prüfung erforderlich',
    description: 'Preisabweichung über Freigabegrenze',
    status: 'aktuell',
    time: 'vor 3 Minuten',
  },
  {
    id: 'approval',
    title: 'Freigabe vorbereitet',
    description: 'Entscheidung wird im Einkauf dokumentiert',
    status: 'ausstehend',
    time: 'ausstehend',
  },
]

const protocolItems = [
  'RFQ-1024 aus Angebotsdaten geladen',
  'Preisabweichung gegen Zielpreis geprüft',
  'Governance-Regel für automatische Freigabe ausgelöst',
  'Finale Entscheidung an Einkauf weitergeleitet',
]

const guardrails = [
  'Automatische Freigabe bis 10 % Preisabweichung',
  'Human-in-the-Loop bei Überschreitung',
  'Keine Vertragsänderung ohne manuelle Prüfung',
  'Lieferantenrisiko muss niedrig oder mittel sein',
]

function ApprovalFallback({ id }) {
  return (
    <section className="basic-page">
      <div className="approval-review-header approval-review-header--empty">
        <Link className="btn btn--ghost btn--small" to="/freigaben">
          Zurück zu Freigaben
        </Link>
        <div>
          <span>{id ? `Vorgang ${id}` : 'Freigaben'}</span>
          <h1>{id ? 'Vorgang nicht gefunden' : 'Bitte Vorgang auswählen'}</h1>
          <p>
            {id
              ? 'Für diese Vorgangs-ID liegen im aktuellen Prototyp-State keine Freigabedaten vor.'
              : 'Öffnen Sie einen Human-in-the-Loop-Fall, um die Detailprüfung zu starten.'}
          </p>
        </div>
      </div>
    </section>
  )
}

function OfferComparisonTable({ inspectedOfferId, onInspectOffer }) {
  return (
    <div className="offer-comparison" role="table" aria-label="Angebotsvergleich">
      <div className="offer-comparison__row offer-comparison__row--head" role="row">
        <span>Lieferant</span>
        <span>Startpreis</span>
        <span>Aktueller Preis</span>
        <span>Zum Zielpreis</span>
        <span>Lieferzeit</span>
        <span>Risiko</span>
        <span>Bewertung</span>
        <span>Aktion</span>
      </div>

      {offerComparison.map((offer) => (
        <div
          className={`offer-comparison__row ${offer.selected ? 'offer-comparison__row--selected' : ''}`}
          key={offer.id}
          role="row"
        >
          <strong>
            {offer.supplier}
            {offer.selected ? <small>Ausgewählt</small> : null}
          </strong>
          <span>{offer.startPrice}</span>
          <span>{offer.currentPrice}</span>
          <span>{offer.deviation}</span>
          <span>{offer.deliveryTime}</span>
          <StatusPill tone={riskTone[offer.risk]}>{offer.risk}</StatusPill>
          <span>{offer.rating}</span>
          <button
            aria-pressed={inspectedOfferId === offer.id}
            className={`btn btn--ghost btn--small ${inspectedOfferId === offer.id ? 'btn--active' : ''}`}
            type="button"
            onClick={() => onInspectOffer(offer)}
          >
            Details
          </button>
        </div>
      ))}
    </div>
  )
}

function OfferDetailsCard({ offer }) {
  return (
    <section className="approval-review-card panel">
      <div className="approval-review-card__header">
        <div>
          <span>Angebotsdetails</span>
          <h2>{offer.supplier}</h2>
        </div>
        <StatusPill tone={offer.selected ? 'active' : riskTone[offer.risk]}>
          {offer.selected ? 'Empfohlen' : `Risiko: ${offer.risk}`}
        </StatusPill>
      </div>

      <div className="selected-offer-grid">
        <div><span>Lieferant</span><strong>{offer.supplier}</strong></div>
        <div><span>Startpreis</span><strong>{offer.startPrice}</strong></div>
        <div><span>Aktueller Preis</span><strong>{offer.currentPrice}</strong></div>
        <div><span>Zielpreis-Abweichung</span><strong>{offer.deviation}</strong></div>
        <div><span>Lieferzeit</span><strong>{offer.deliveryTime}</strong></div>
        <div><span>Zahlungsbedingungen</span><strong>{offer.paymentTerms}</strong></div>
        <div><span>Risiko</span><strong>{offer.risk}</strong></div>
      </div>

      {offer.negotiationHistory.length > 0 ? (
        <div className="negotiation-history">
          <h3>Verhandlungsverlauf</h3>
          <ol>
            {offer.negotiationHistory.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}

function ProcessTimeline({ onOpenProcess }) {
  return (
    <section className="approval-sidebar-card approval-sidebar-card--process">
      <div className="approval-review-card__header">
        <div>
          <span>Vorgangsstatus</span>
          <h2>Prozessverlauf</h2>
        </div>
        <StatusPill tone="warning">Aktuelle Prüfung</StatusPill>
      </div>

      <ol className="process-timeline">
        {processSteps.map((step) => (
          <li className={`process-timeline__item process-timeline__item--${step.status}`} key={step.id}>
            <div className="process-timeline__marker" aria-hidden="true" />
            <div className="process-timeline__content">
              <div>
                <h3>{step.title}</h3>
                <StatusPill
                  tone={step.status === 'abgeschlossen' ? 'active' : step.status === 'aktuell' ? 'warning' : 'neutral'}
                >
                  {step.status}
                </StatusPill>
              </div>
              <p>{step.description}</p>
              <span>{step.time}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className="process-timeline__actions">
        <button className="btn btn--secondary" type="button" onClick={onOpenProcess}>
          Vorgangsverlauf öffnen
        </button>
      </div>
    </section>
  )
}

function Freigaben() {
  const { id } = useParams()
  const { showToast } = useToast()
  const { approvalCases, resolveApproval } = useProcurement()
  const [inspectedOffer, setInspectedOffer] = useState(selectedOffer)

  const fallbackApproval =
    approvalCases.find((approval) => approval.status === 'Offen') || approvalCases[0] || null
  const routeApproval = id
    ? approvalCases.find((approval) => approval.id === id)
    : null
  const activeApproval = id ? routeApproval : fallbackApproval

  if (!activeApproval) {
    return <ApprovalFallback id={id} />
  }

  if (id && !routeApproval) {
    return <ApprovalFallback id={id} />
  }

  const isResolved = activeApproval.status !== 'Offen'
  const statusTone = activeApproval.status === 'Freigegeben'
    ? 'active'
    : activeApproval.status === 'Abgelehnt'
      ? 'risk'
      : 'warning'
  const statusLabel = isResolved ? activeApproval.status : 'Prüfung erforderlich'

  const handleAction = (message, tone = 'success') => {
    showToast(message, tone)
  }

  const handlePrepareApproval = () => {
    if (isResolved) {
      return
    }

    resolveApproval(activeApproval, 'approved')
    showToast('Freigabe erteilt. Bestellung wurde vorbereitet.')
  }

  return (
    <section className="basic-page approval-review-page">
      <header className="approval-review-header panel">
        <div className="approval-review-header__top">
          <span>Aktualisiert vor 3 Minuten</span>
        </div>

        <div className="approval-review-header__content">
          <div>
            <span>{activeApproval.id}</span>
            <h1>Vorgang: Bauteil A-482</h1>
            <p>{activeApproval.dataSource} · {activeApproval.relatedSupplier}</p>
          </div>
          <div className="approval-review-header__badges">
            <StatusPill tone="warning">Prüfung erforderlich</StatusPill>
            <StatusPill tone={riskTone[activeApproval.riskLevel]}>
              Risiko: {activeApproval.riskLevel}
            </StatusPill>
          </div>
        </div>
      </header>

      <div className="approval-review-layout">
        <main className="approval-review-main">
          <section className="approval-review-card approval-review-card--decision panel">
            <div className="approval-review-card__header">
              <div>
                <span>Entscheidungsbereich</span>
                <h2>Menschliche Prüfung erforderlich</h2>
              </div>
              <StatusPill tone="warning">Automatische Freigabe blockiert</StatusPill>
            </div>

            <div className="approval-decision-grid">
              <div className="approval-decision-summary">
                <article>
                  <h3>Grund der Prüfung</h3>
                  <p>Preisabweichung 12,4 % über Zielpreis. Automatische Freigabe blockiert.</p>
                </article>
                <article>
                  <h3>KI-Empfehlung</h3>
                  <p>Müller GmbH prüfen: Preis liegt im Marktbereich, Lieferzeit stabil, Risiko niedrig.</p>
                </article>
                <article>
                  <h3>Kontext</h3>
                  <p>Finale Freigabe durch Einkauf erforderlich, bevor die Bestellung vorbereitet wird.</p>
                </article>
              </div>

              <div className="approval-decision-actions">
                <span>Aktionen</span>
                <button
                  className="btn btn--primary"
                  disabled={isResolved}
                  type="button"
                  onClick={handlePrepareApproval}
                >
                  Freigabe vorbereiten
                </button>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={() => handleAction('Rückfrage wurde vorbereitet.', 'info')}
                >
                  Rückfrage senden
                </button>
                <button
                  className="btn btn--danger"
                  type="button"
                  onClick={() => handleAction('Vorgang wurde zur Eskalation markiert.', 'danger')}
                >
                  Eskalieren
                </button>
              </div>
            </div>
          </section>

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Angebotsvergleich</span>
                <h2>Lieferantenangebote</h2>
              </div>
              <StatusPill tone="info">3 Angebote</StatusPill>
            </div>
            <OfferComparisonTable
              inspectedOfferId={inspectedOffer.id}
              onInspectOffer={setInspectedOffer}
            />
          </section>

          <OfferDetailsCard offer={inspectedOffer} />

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Quellen & Protokoll</span>
                <h2>Datenbasis der Prüfung</h2>
              </div>
              <StatusPill tone="info">RFQ-1024</StatusPill>
            </div>
            <div className="source-protocol-grid">
              <div>
                <h3>Quellen</h3>
                <p>{activeApproval.dataSource}</p>
                <p>Lieferant: {activeApproval.relatedSupplier}</p>
                <p>Material: {activeApproval.relatedMaterial}</p>
              </div>
              <div>
                <h3>Protokoll</h3>
                <ol>
                  {protocolItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </main>

        <aside className="approval-review-sidebar">
          <section className="approval-sidebar-card">
            <h2>Vorgangsstatus</h2>
            <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
            <dl>
              <div><dt>Vorgang</dt><dd>Bauteil A-482</dd></div>
              <div><dt>Fall-ID</dt><dd>{activeApproval.id}</dd></div>
              <div><dt>Aktualisiert</dt><dd>vor 3 Minuten</dd></div>
            </dl>
          </section>

          <section className="approval-sidebar-card">
            <h2>Verhandlungsleitplanken</h2>
            <ul>
              {guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </section>

          <ProcessTimeline
            onOpenProcess={() => handleAction('Vorgangsverlauf wird vorbereitet.', 'info')}
          />
        </aside>
      </div>
    </section>
  )
}

export default Freigaben
