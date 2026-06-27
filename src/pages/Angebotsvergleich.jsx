import { Link, useNavigate } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import TooltipTerm from '../components/TooltipTerm.jsx'
import { demoRFQ } from '../context/procurementDemoData.js'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Niedrig: 'active',
  Mittel: 'warning',
  Hoch: 'risk',
}

const offerContext = {
  'Northline Supply': {
    history: '98 % Termintreue, stabile Konditionen, zuletzt keine Eskalation.',
    aiReason: 'Bester Gesamtwert aus Preis, Lieferzeit und niedrigem Risiko.',
    whyNot: 'Dieses Angebot ist die Referenzempfehlung.',
  },
  'Müller Industriebedarf': {
    history: 'Bestehender Lieferant mit zwei Preisabweichungen im letzten Quartal.',
    aiReason: 'Solide Option, aber höheres Risiko und kürzere Zahlungsfrist.',
    whyNot: 'Nicht empfohlen, weil Preis und Lieferzeit schwächer als bei Northline Supply sind.',
  },
  'SensorTech AG': {
    history: 'Sehr schnelle Lieferung, aber eingeschränkte Zahlungsbedingungen.',
    aiReason: 'Schnellste Lieferung, jedoch schwächere Konditionen.',
    whyNot: 'Nicht empfohlen, weil Vorkasse und hoher Preis den Liefervorteil überwiegen.',
  },
}

function ComparisonBar({ label, offers, valueKey }) {
  return (
    <article className="comparison-bar-card">
      <h3>{label}</h3>
      {offers.map((offer) => (
        <div className="status-bar" key={`${label}-${offer.id}`}>
          <div>
            <span>{offer.supplier}</span>
            <strong>{offer[valueKey]}%</strong>
          </div>
          <i>
            <b className={`tone-${offer.tone}`} style={{ width: `${offer[valueKey]}%` }} />
          </i>
        </div>
      ))}
    </article>
  )
}

function Angebotsvergleich() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    activeRFQs,
    selectedOffer,
    selectedRFQ,
    setSelectedOffer,
    setSelectedRFQ,
    startNegotiationForOffer,
    supplierOffers,
  } = useProcurement()
  const rfq = selectedRFQ || activeRFQs[0] || demoRFQ
  const offers = supplierOffers.map((offer) => ({
    ...offer,
    ...offerContext[offer.supplier],
  }))
  const recommendedOffer = offers[0]

  const handleSelectRfq = (rfqId) => {
    const nextRFQ = activeRFQs.find((item) => item.id === rfqId) || demoRFQ
    setSelectedRFQ(nextRFQ)
  }

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer)
    showToast('Angebot ausgewählt.')
  }

  const handleStartNegotiation = (offer) => {
    startNegotiationForOffer(offer, rfq)
    navigate('/verhandlungen')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Angebote bewerten</span>
        <h1>Angebotsvergleich</h1>
        <p>
          Vergleich eingegangener Angebote nach Preis, Lieferzeit, Historie,
          Konditionen, Risiko und Lieferantenperformance.
        </p>
      </div>

      <section className="rfq-summary-card rfq-summary-card--select" aria-label="RFQ-Zusammenfassung">
        <label className="form-field">
          <span className="form-field__label">
            <TooltipTerm label="RFQ steht für Request for Quotation, also eine Angebotsanfrage.">
              RFQ auswählen
            </TooltipTerm>
          </span>
          <select className="form-field__select" value={rfq.id} onChange={(event) => handleSelectRfq(event.target.value)}>
            {activeRFQs.map((item) => (
              <option key={item.id} value={item.id}>{item.id} · {item.material}</option>
            ))}
            {!activeRFQs.some((item) => item.id === demoRFQ.id) && (
              <option value={demoRFQ.id}>{demoRFQ.id} · {demoRFQ.material}</option>
            )}
          </select>
        </label>
        <div>
          <span>Material</span>
          <strong>{rfq.material}</strong>
        </div>
        <div>
          <span>Menge</span>
          <strong>{rfq.quantity}</strong>
        </div>
        <div>
          <span>Status</span>
          <StatusPill tone="active">{rfq.status}</StatusPill>
        </div>
      </section>

      <section className="basic-page__offer-grid basic-page__offer-grid--comparison" aria-label="Lieferantenangebote">
        {offers.map((offer) => {
          const isSelected = selectedOffer?.id === offer.id

          return (
            <article
              className={`offer-card offer-card--interactive ${isSelected ? 'offer-card--selected' : ''}`}
              key={offer.id}
            >
              <div>
                <h2>{offer.supplier}</h2>
                <StatusPill tone={offer.tone}>{offer.badge}</StatusPill>
              </div>
              <dl>
                <div><dt>Preis</dt><dd>{offer.priceLabel}</dd></div>
                <div><dt>Lieferzeit</dt><dd>{offer.deliveryTime}</dd></div>
                <div><dt>Risiko</dt><dd><StatusPill tone={riskTone[offer.risk]}>{offer.risk}</StatusPill></dd></div>
                <div><dt>Qualität</dt><dd>{offer.quality}</dd></div>
                <div><dt>Historie</dt><dd>{offer.history}</dd></div>
              </dl>
              <div className="offer-card__reason">
                <strong>KI-Begründung</strong>
                <p>{offer.aiReason}</p>
                {!offer.badge.includes('Empfehlung') && <small>Warum nicht Angebot B: {offer.whyNot}</small>}
              </div>
              <div className="offer-card__actions">
                <button className="btn btn--secondary btn--small" type="button" onClick={() => handleSelectOffer(offer)}>
                  Auswählen
                </button>
                <button className="btn btn--primary btn--small" type="button" onClick={() => handleStartNegotiation(offer)}>
                  Verhandlung starten
                </button>
                <Link className="btn btn--ghost btn--small" to={`/vorgaenge/${rfq.id}`}>
                  Vorgang öffnen
                </Link>
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Angebotsbewertung</h2>
          <span>Preis, Lieferzeit und Risiko im Vergleich</span>
        </div>
        <div className="comparison-bars">
          <ComparisonBar
            label="Preisvergleich"
            offers={offers.map((offer) => ({
              ...offer,
              priceScore: Math.round((offer.price / 56000) * 100),
            }))}
            valueKey="priceScore"
          />
          <ComparisonBar label="Lieferzeit" offers={offers} valueKey="deliveryScore" />
          <ComparisonBar label="Risiko" offers={offers} valueKey="riskScore" />
        </div>
      </section>

      <section className="recommendation-box">
        <p>
          Die KI empfiehlt Northline Supply, da der Preis 6 % unter dem aktuellen
          Lieferanten liegt und die Lieferzeit stabil ist.
        </p>
        <div>
          <button className="btn btn--primary" type="button" onClick={() => handleStartNegotiation(recommendedOffer)}>
            Verhandlung mit Empfehlung starten
          </button>
          <Link className="btn btn--secondary" to="/vorgaenge/APR-1001">
            Zur Freigabe senden
          </Link>
        </div>
      </section>
    </section>
  )
}

export default Angebotsvergleich
