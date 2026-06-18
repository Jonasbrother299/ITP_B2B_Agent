import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import { rfq1024Prototype } from '../data/procurementProcessDetails.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Niedrig: 'active',
  Mittel: 'warning',
  Hoch: 'risk',
}

const stepTone = {
  abgeschlossen: 'active',
  aktuell: 'warning',
  ausstehend: 'neutral',
}

function PrototypeSourceHints({ title, items }) {
  return (
    <div className="prototype-source-box">
      <strong>{title}</strong>
      <div className="prototype-source-tags">
        {items.map((item) => (
          <span className="prototype-source-tag" key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function PrototypeOfferComparison({ acceptedOfferId, offers, selectedOfferId }) {
  return (
    <div className="offer-comparison" role="table" aria-label="Angebotsvergleich RFQ-1024">
      <div className="offer-comparison__row offer-comparison__row--head" role="row">
        <span>Lieferant</span>
        <span>Startpreis</span>
        <span>Aktueller Preis</span>
        <span>Abw. Preisziel</span>
        <span>Lieferzeit</span>
        <span>Risiko</span>
        <span>Bewertung</span>
      </div>

      {offers.map((offer) => {
        const isSelected = offer.id === selectedOfferId
        const isAccepted = offer.id === acceptedOfferId

        return (
          <div
            className={`offer-comparison__row ${isSelected ? 'offer-comparison__row--selected' : ''}`}
            key={offer.id}
            role="row"
          >
            <strong>
              {offer.supplier}
              {isAccepted ? <small>Für Entscheidung markiert</small> : isSelected ? <small>In Ansicht</small> : null}
            </strong>
            <span>{offer.startPrice}</span>
            <span>{offer.currentPrice}</span>
            <span>{offer.deviation}</span>
            <span>{offer.deliveryTime}</span>
            <StatusPill tone={riskTone[offer.risk]}>{offer.risk}</StatusPill>
            <span>{offer.rating}</span>
          </div>
        )
      })}
    </div>
  )
}

function PrototypeOfferDetails({
  acceptedOfferId,
  approvalPrepared,
  offer,
  offers,
  onAcceptOffer,
  onSelectOffer,
}) {
  const isAccepted = offer.id === acceptedOfferId

  return (
    <section className="approval-review-card panel">
      <div className="approval-review-card__header">
        <div>
          <span>Ausgewähltes Angebot</span>
        </div>
        <StatusPill tone={isAccepted ? 'active' : offer.tone}>
          {isAccepted ? 'Für Entscheidung markiert' : offer.detailStatus}
        </StatusPill>
      </div>

      <div className="prototype-offer-switcher" aria-label="Angebot direkt wechseln">
        <div className="prototype-offer-switcher__header">
          <strong>Angebot direkt wechseln</strong>
        </div>

        <div className="prototype-offer-switcher__tabs">
          {offers.map((candidate, index) => {
            const isCurrent = candidate.id === offer.id

            return (
              <button
                aria-pressed={isCurrent}
                className={`prototype-offer-switcher__item ${isCurrent ? 'prototype-offer-switcher__item--active' : ''}`}
                key={candidate.id}
                type="button"
                onClick={() => onSelectOffer(candidate)}
              >
                <div className="prototype-offer-switcher__eyebrow">
                  <span>Option {String.fromCharCode(65 + index)}</span>
                  <small>{isCurrent ? 'Aktiv' : 'Ansehen'}</small>
                </div>
                <strong>{candidate.supplier}</strong>
                <span>{candidate.currentPrice} · {candidate.deliveryTime}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="prototype-offer-detail-heading">
        <h2>Angebotsdetails</h2>
      </div>

      <div className="selected-offer-grid">
        <div><span>Lieferant</span><strong>{offer.supplier}</strong></div>
        <div><span>Startpreis</span><strong>{offer.startPrice}</strong></div>
        <div><span>Aktueller Preis</span><strong>{offer.currentPrice}</strong></div>
        <div><span>Abweichung zum Preisziel</span><strong>{offer.deviation}</strong></div>
        <div><span>Lieferzeit</span><strong>{offer.deliveryTime}</strong></div>
        <div><span>Zahlungsbedingungen</span><strong>{offer.terms}</strong></div>
        <div><span>Risiko</span><strong>{offer.risk}</strong></div>
      </div>

      <PrototypeSourceHints title="Quellen für dieses Angebot" items={offer.sourceRefs} />

      <div className="negotiation-history">
        <h3>Verhandlungsverlauf</h3>
        <ol>
          {offer.history.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="prototype-detail-actions">
        <button
          className={`btn ${isAccepted ? 'btn--success' : 'btn--primary'}`}
          type="button"
          onClick={() => onAcceptOffer(offer)}
        >
          {approvalPrepared && isAccepted ? 'Angebot ausgewählt und vorbereitet' : isAccepted ? 'Angebot ausgewählt' : 'Angebot auswählen'}
        </button>
      </div>
    </section>
  )
}

function PrototypeProcessSidebar({ process, statusLabel, steps }) {
  return (
    <>
      <section className="approval-sidebar-card">
        <h2>Vorgangsstatus</h2>
        <StatusPill tone={statusLabel === process.statusLabel ? 'warning' : 'active'}>{statusLabel}</StatusPill>
        <ol className="prototype-status-list">
          {steps.map((step) => (
            <li className={`prototype-status-list__item prototype-status-list__item--${step.status}`} key={step.id}>
              <span>{step.title}</span>
              <StatusPill tone={stepTone[step.status]}>{step.status}</StatusPill>
            </li>
          ))}
        </ol>
      </section>

      <section className="approval-sidebar-card">
        <h2>Entscheidungsregeln</h2>
        <ul>
          {process.guardrails.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="approval-sidebar-card">
        <h2>Quellen & Nachvollziehbarkeit</h2>
        <div className="prototype-sidebar-group">
          <h3>Quellen</h3>
          <ul>
            {process.sources.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="prototype-sidebar-group">
          <h3>Protokoll</h3>
          <ol>
            {process.protocol.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

function ProcurementProcessDetail() {
  const process = rfq1024Prototype
  const { showToast } = useToast()
  const [selectedOffer, setSelectedOffer] = useState(process.offers[0])
  const [acceptedOfferId, setAcceptedOfferId] = useState(null)
  const [approvalPrepared, setApprovalPrepared] = useState(false)

  const acceptedOffer = process.offers.find((offer) => offer.id === acceptedOfferId) || null
  const statusLabel = approvalPrepared
    ? 'Für Freigabe vorbereitet'
    : acceptedOffer
      ? 'Angebot ausgewählt'
      : process.statusLabel
  const processSteps = process.processSteps.map((step) => {
    if (step.id === 'review') {
      return { ...step, status: acceptedOffer ? 'abgeschlossen' : 'aktuell' }
    }

    if (step.id === 'approval') {
      if (approvalPrepared) {
        return { ...step, status: 'abgeschlossen', title: 'Freigabe vorbereitet' }
      }

      return { ...step, status: acceptedOffer ? 'aktuell' : 'ausstehend' }
    }

    return step
  })

  const handleAcceptOffer = (offer) => {
    if (acceptedOfferId === offer.id && approvalPrepared) {
      showToast(`${offer.supplier} ist bereits ausgewählt und zur Freigabe vorbereitet.`)
      return
    }

    setSelectedOffer(offer)
    setAcceptedOfferId(offer.id)
    setApprovalPrepared(false)
    showToast(`${offer.supplier} wurde als bestes Angebot markiert.`)
  }

  const handlePrepareApproval = () => {
    if (!acceptedOffer) {
      return
    }

    setApprovalPrepared(true)
    showToast(`${acceptedOffer.supplier} wurde zur Freigabe vorbereitet.`)
  }

  return (
    <section className="basic-page approval-review-page prototype-process-page">
      <header className="approval-review-header panel">
        <div className="approval-review-header__top">
          <Link className="btn btn--ghost btn--small" to="/dashboard">
            ← Zurück zum Einkaufs-Cockpit
          </Link>
          <span>{process.updatedAt}</span>
        </div>

        <div className="approval-review-header__content">
          <div>
            <span>{process.id} · Lieferantenanfrage</span>
            <h1>{process.title}</h1>
            <p>{process.subtitle}</p>
          </div>
          <div className="approval-review-header__badges">
            <StatusPill tone={approvalPrepared ? 'active' : acceptedOffer ? 'blue' : 'warning'}>{statusLabel}</StatusPill>
            {acceptedOffer ? <StatusPill tone="active">{acceptedOffer.supplier}</StatusPill> : null}
          </div>
        </div>

        <div className="prototype-language-note">
          <strong>Kurz erklärt</strong>
          <p>{process.plainLanguageNote}</p>
        </div>
      </header>

      <div className="approval-review-layout">
        <main className="approval-review-main">
          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Vorgangsübersicht</span>
                <h2>Anfrage und Bedarfsdaten</h2>
              </div>
              <StatusPill tone="info">{process.materialLabel}</StatusPill>
            </div>
            <div className="prototype-summary-grid">
              {process.summary.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Angebote</span>
                <h2>Angebote im Vergleich</h2>
              </div>
              <StatusPill tone="info">3 Angebote</StatusPill>
            </div>
            <PrototypeOfferComparison
              acceptedOfferId={acceptedOfferId}
              offers={process.offers}
              selectedOfferId={selectedOffer.id}
            />
          </section>

          <section className="approval-review-card approval-review-card--decision panel">
            <div className="approval-review-card__header">
              <div>
                <span>KI-Empfehlung</span>
                <h2>{process.recommendation.supplier}</h2>
              </div>
              <StatusPill tone="active">Empfohlen</StatusPill>
            </div>

            <p>{process.recommendation.summary}</p>

            <div className="prototype-insight-box">
              <strong>Begründung</strong>
              <ul>
                {process.recommendation.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>

            <PrototypeSourceHints
              title="Worauf stützt sich diese Empfehlung?"
              items={process.recommendation.sourceRefs}
            />

            <div className="prototype-open-point">
              <strong>Offener Punkt</strong>
              <p>{process.recommendation.openPoint}</p>
            </div>
          </section>

          <PrototypeOfferDetails
            acceptedOfferId={acceptedOfferId}
            approvalPrepared={approvalPrepared}
            offer={selectedOffer}
            offers={process.offers}
            onAcceptOffer={handleAcceptOffer}
            onSelectOffer={setSelectedOffer}
          />

          <section className="approval-review-card panel">
            <div className="approval-review-card__header">
              <div>
                <span>Nächste Schritte</span>
                <h2>Aktionen vorbereiten</h2>
              </div>
              <StatusPill tone={approvalPrepared ? 'active' : acceptedOffer ? 'blue' : 'warning'}>
                {approvalPrepared ? 'Freigabe vorbereitet' : acceptedOffer ? '1 Schritt offen' : 'Auswahl ausstehend'}
              </StatusPill>
            </div>

            <div className="prototype-decision-note">
              <strong>
                {approvalPrepared
                  ? `${acceptedOffer?.supplier} wurde zur Freigabe vorbereitet.`
                  : acceptedOffer
                    ? `${acceptedOffer.supplier} ist aktuell als bestes Angebot ausgewählt.`
                    : 'Wähle zuerst ein Angebot aus, damit der Vorgang abgeschlossen werden kann.'}
              </strong>
              <p>
                {approvalPrepared
                  ? 'Damit ist der Interview-Flow sichtbar abgeschlossen und die Auswahl nachvollziehbar dokumentiert.'
                  : acceptedOffer
                    ? 'Als nächster Schritt kannst du den Vorgang zur Freigabe vorbereiten.'
                    : 'Die anderen Aktionen bleiben bewusst prototypisch und sind für den Test nicht entscheidend.'}
              </p>
            </div>

            <div className="prototype-action-list">
              {process.actions.map((action) => (
                action.id === 'prepare' ? (
                  <button
                    className={`btn btn--${action.tone}`}
                    disabled={!acceptedOffer || approvalPrepared}
                    key={action.id}
                    type="button"
                    onClick={handlePrepareApproval}
                  >
                    {approvalPrepared ? 'Bereits vorbereitet' : action.label}
                  </button>
                ) : (
                  <button className={`btn btn--${action.tone}`} key={action.id} type="button">
                    {action.label}
                  </button>
                )
              ))}
            </div>
          </section>
        </main>

        <aside className="approval-review-sidebar">
          <PrototypeProcessSidebar process={process} statusLabel={statusLabel} steps={processSteps} />
        </aside>
      </div>
    </section>
  )
}

export default ProcurementProcessDetail
