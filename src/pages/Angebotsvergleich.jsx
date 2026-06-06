import { useNavigate } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import { demoRFQ } from '../context/procurementDemoData.js'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Niedrig: 'active',
  Mittel: 'warning',
  Hoch: 'risk',
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
    selectedOffer,
    selectedRFQ,
    setSelectedOffer,
    startNegotiationForOffer,
    supplierOffers,
  } = useProcurement()
  const rfq = selectedRFQ || demoRFQ
  const recommendedOffer = supplierOffers[0]

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
          Vergleich eingegangener Angebote nach Preis, Lieferzeit, Konditionen,
          Risiko und Lieferantenperformance.
        </p>
      </div>

      <section className="rfq-summary-card" aria-label="RFQ-Zusammenfassung">
        <div>
          <span>RFQ-ID</span>
          <strong>{rfq.id}</strong>
        </div>
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

      <section className="basic-page__offer-grid" aria-label="Lieferantenangebote">
        {supplierOffers.map((offer) => {
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
                <div><dt>Konditionen</dt><dd>{offer.terms}</dd></div>
              </dl>
              <div className="offer-card__actions">
                <button className="btn btn--secondary btn--small" type="button" onClick={() => handleSelectOffer(offer)}>
                  Auswählen
                </button>
                <button className="btn btn--primary btn--small" type="button" onClick={() => handleStartNegotiation(offer)}>
                  Verhandlung starten
                </button>
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Vergleichsvisualisierung</h2>
          <span>CSS-basierte Balken ohne Chart-Bibliothek</span>
        </div>
        <div className="comparison-bars">
          <ComparisonBar
            label="Preisvergleich"
            offers={supplierOffers.map((offer) => ({
              ...offer,
              priceScore: Math.round((offer.price / 56000) * 100),
            }))}
            valueKey="priceScore"
          />
          <ComparisonBar label="Lieferzeit" offers={supplierOffers} valueKey="deliveryScore" />
          <ComparisonBar label="Risiko" offers={supplierOffers} valueKey="riskScore" />
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
          <button className="btn btn--secondary" type="button" onClick={() => navigate('/freigaben')}>
            Zur Freigabe senden
          </button>
        </div>
      </section>
    </section>
  )
}

export default Angebotsvergleich
