import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import { demoRFQ } from '../context/procurementDemoData.js'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const formatEuro = (value) =>
  new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'EUR',
  }).format(value)

const statusTone = {
  'Bereit zur Verhandlung': 'blue',
  'Verhandlung läuft': 'warning',
  'Ergebnis vorbereitet': 'active',
}

function Verhandlungen() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    addNegotiationTimelineItem,
    negotiationCase,
    negotiationTimeline,
    selectedRFQ,
    startNegotiationForOffer,
    supplierOffers,
    updateNegotiationCase,
  } = useProcurement()
  const fallbackCase = useMemo(() => {
    const offer = supplierOffers[0]
    return {
      rfqId: demoRFQ.id,
      material: demoRFQ.material,
      supplier: offer.supplier,
      initialPrice: offer.price,
      targetPrice: Math.round(offer.price * 0.94),
      currentPrice: offer.price,
      status: 'Bereit zur Verhandlung',
      offer,
    }
  }, [supplierOffers])

  const activeCase = negotiationCase || fallbackCase
  const savings = Math.max(activeCase.initialPrice - activeCase.currentPrice, 0)
  const savingsPercent = activeCase.initialPrice
    ? Math.round((savings / activeCase.initialPrice) * 100)
    : 0

  const ensureNegotiationCase = () => {
    if (!negotiationCase) {
      startNegotiationForOffer(activeCase.offer, selectedRFQ || demoRFQ)
    }
  }

  const handleStart = () => {
    ensureNegotiationCase()
    updateNegotiationCase({ status: 'Verhandlung läuft' })
    addNegotiationTimelineItem(`Negotiation Agent startet Verhandlung mit ${activeCase.supplier}.`)
    showToast('Verhandlung gestartet.')
  }

  const handleCounterOffer = () => {
    ensureNegotiationCase()
    const improvedPrice = activeCase.currentPrice > 43900 ? 43900 : Math.max(activeCase.currentPrice - 650, activeCase.targetPrice)

    updateNegotiationCase({
      currentPrice: improvedPrice,
      status: 'Verhandlung läuft',
    })
    addNegotiationTimelineItem(`Lieferant bietet verbessertes Angebot über ${formatEuro(improvedPrice)}.`)
    showToast('Gegenangebot erhalten.')
  }

  const handleAcceptResult = () => {
    ensureNegotiationCase()
    updateNegotiationCase({ status: 'Ergebnis vorbereitet' })
    addNegotiationTimelineItem('Verhandlungsergebnis wurde für Freigabe vorbereitet.')
    showToast('Verhandlungsergebnis vorbereitet.')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Negotiation Agent</span>
        <h1>Verhandlungen</h1>
        <p>
          Überblick über automatisierte Preis- und Konditionsverhandlungen
          innerhalb definierter Leitplanken.
        </p>
      </div>

      <section className="negotiation-summary-card">
        <div className="section-header">
          <h2>Verhandlungsfall</h2>
          <StatusPill tone={statusTone[activeCase.status] || 'neutral'}>{activeCase.status}</StatusPill>
        </div>
        <div className="negotiation-summary-card__grid">
          <div><span>RFQ-ID</span><strong>{activeCase.rfqId}</strong></div>
          <div><span>Lieferant</span><strong>{activeCase.supplier}</strong></div>
          <div><span>Ausgangspreis</span><strong>{formatEuro(activeCase.initialPrice)}</strong></div>
          <div><span>Zielpreis</span><strong>{formatEuro(activeCase.targetPrice)}</strong></div>
          <div><span>Aktueller Preis</span><strong>{formatEuro(activeCase.currentPrice)}</strong></div>
          <div><span>Spielraum</span><strong>±10 %</strong></div>
          <div><span>Einsparung</span><strong>{formatEuro(savings)} ({savingsPercent} %)</strong></div>
        </div>
        <div className="negotiation-actions">
          <button className="btn btn--primary" type="button" onClick={handleStart}>
            Verhandlung starten
          </button>
          <button className="btn btn--secondary" type="button" onClick={handleCounterOffer}>
            Gegenangebot vorbereiten
          </button>
          <button className="btn btn--success" type="button" onClick={handleAcceptResult}>
            Ergebnis akzeptieren
          </button>
          <button className="btn btn--ghost" type="button" onClick={() => navigate('/vorgaenge/APR-1001')}>
            Zur Freigabe senden
          </button>
        </div>
      </section>

      <section className="basic-page__split">
        <article className="panel">
          <div className="section-header">
            <h2>Verhandlungsverlauf</h2>
            <span>Aktualisiert durch Prototyp-Aktionen</span>
          </div>
          <ol className="timeline-list">
            {negotiationTimeline.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ol>
        </article>

        <aside className="info-panel">
          <h2>Parameter</h2>
          <div className="parameter-list parameter-list--compact">
            <div>Preis-Spielraum: ±10 %</div>
            <div>Maximale Laufzeit: 48h</div>
            <div>Eskalation bei Vertragsänderung</div>
            <div>Human-in-the-Loop bei Überschreitung</div>
          </div>
          <div className="ai-explanation-box">
            Der Negotiation Agent darf nur innerhalb definierter Preis- und
            Vertragsgrenzen handeln. Sobald Grenzen überschritten werden, wird
            der Fall an Freigaben eskaliert.
          </div>
        </aside>
      </section>
    </section>
  )
}

export default Verhandlungen
