import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import InfoCard from '../components/cards/InfoCard.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const emptyForm = {
  material: '',
  quantity: '',
  deliveryDate: '',
  suppliers: 'Northline Supply, Müller Industriebedarf',
  requestText: '',
}

const statusTone = {
  Entwurf: 'neutral',
  Versendet: 'blue',
  'Angebote eingegangen': 'active',
}

const formFromNeed = (need, supplier) => ({
  material: need.material,
  quantity: need.suggestedQuantity,
  deliveryDate: need.suggestedDeliveryDate,
  suppliers: supplier?.name || 'Northline Supply, Müller Industriebedarf',
  requestText: `Bitte senden Sie ein Angebot für ${need.suggestedQuantity} ${need.material} bis zum gewünschten Liefertermin.`,
})

const formFromSupplier = (supplier) => ({
  ...emptyForm,
  suppliers: supplier.name,
  requestText: `Bitte senden Sie ein Angebot für den aktuellen Bedarf an ${supplier.name}.`,
})

function RFQs() {
  const { showToast } = useToast()
  const {
    activeRFQs,
    rfqDrafts,
    saveRfqDraft,
    selectedNeedForRFQ,
    selectedSupplierForRFQ,
    sendRfq,
    setSelectedNeedForRFQ,
    setSelectedSupplierForRFQ,
  } = useProcurement()
  const hasShownSupplierToast = useRef(false)
  const [formData, setFormData] = useState(() =>
    selectedNeedForRFQ
      ? formFromNeed(selectedNeedForRFQ, selectedSupplierForRFQ)
      : selectedSupplierForRFQ
        ? formFromSupplier(selectedSupplierForRFQ)
        : emptyForm,
  )

  useEffect(() => {
    if (!selectedSupplierForRFQ) {
      return
    }

    if (!hasShownSupplierToast.current) {
      showToast('Lieferant wurde für RFQ übernommen.')
      hasShownSupplierToast.current = true
    }
  }, [selectedSupplierForRFQ, showToast])

  const updateField = (field, value) => {
    setFormData((data) => ({ ...data, [field]: value }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setSelectedNeedForRFQ(null)
    setSelectedSupplierForRFQ(null)
    hasShownSupplierToast.current = false
  }

  const handleSaveDraft = () => {
    saveRfqDraft(formData)
    showToast('RFQ-Entwurf gespeichert.')
  }

  const handleSendRfq = () => {
    sendRfq(formData)
    showToast('RFQ wurde an Lieferanten versendet.')
    resetForm()
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>RFQ Management</span>
        <h1>RFQs</h1>
        <p>
          Automatisierte Erstellung und Verwaltung von Angebotsanfragen an
          geeignete Lieferanten.
        </p>
      </div>

      <div className="process-hint">
        Bedarf erkannt → RFQ erstellen → Angebote vergleichen → Freigabe
      </div>

      <div className="basic-page__cards">
        <InfoCard title="RFQ-Entwürfe" value={String(rfqDrafts.length)} text="Gespeicherte Anfragen vor Versand." />
        <InfoCard title="Aktive RFQs" value={String(activeRFQs.length)} text="Versendet oder mit Angebotseingang." />
        <InfoCard title="Aus Bedarfserkennung" value={selectedNeedForRFQ ? '1' : '0'} text="Aktuell vorausgefüllter Bedarf." />
      </div>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Neue RFQ erstellen</h2>
          <span>Formular kann bearbeitet, gespeichert oder versendet werden</span>
        </div>
        <form className="prototype-form" onSubmit={(event) => event.preventDefault()}>
          <label className="form-field">
            <span className="form-field__label">Material / Produkt</span>
            <input
              className="form-field__input"
              placeholder="Material eingeben"
              type="text"
              value={formData.material}
              onChange={(event) => updateField('material', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Menge</span>
            <input
              className="form-field__input"
              placeholder="Menge eingeben"
              type="text"
              value={formData.quantity}
              onChange={(event) => updateField('quantity', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Gewünschter Liefertermin</span>
            <input
              className="form-field__input"
              type="date"
              value={formData.deliveryDate}
              onChange={(event) => updateField('deliveryDate', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Lieferanten auswählen</span>
            <select
              className="form-field__select"
              value={formData.suppliers}
              onChange={(event) => updateField('suppliers', event.target.value)}
            >
              {selectedSupplierForRFQ && <option>{selectedSupplierForRFQ.name}</option>}
              <option>Northline Supply, Müller Industriebedarf</option>
              <option>SensorTech AG, TechParts Asia Ltd.</option>
              <option>PackPro AG, ValveTec AG</option>
            </select>
          </label>
          <label className="form-field">
            <span className="form-field__label">Anfragetext</span>
            <textarea
              className="form-field__textarea"
              placeholder="Anfragetext eingeben"
              rows="4"
              value={formData.requestText}
              onChange={(event) => updateField('requestText', event.target.value)}
            />
          </label>
          <div className="prototype-form__actions">
            <button className="btn btn--secondary" type="button" onClick={handleSaveDraft}>
              Entwurf speichern
            </button>
            <button className="btn btn--primary" type="button" onClick={handleSendRfq}>
              RFQ versenden
            </button>
          </div>
        </form>
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>RFQ-Entwürfe</h2>
          <span>{rfqDrafts.length} Entwürfe im lokalen Prototyp</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Entwurf</th>
                <th>Material</th>
                <th>Menge</th>
                <th>Lieferanten</th>
                <th>Liefertermin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rfqDrafts.map((draft) => (
                <tr key={draft.id}>
                  <td><strong>{draft.id}</strong></td>
                  <td>{draft.material}</td>
                  <td>{draft.quantity}</td>
                  <td>{draft.suppliers}</td>
                  <td>{draft.deliveryDate || 'Offen'}</td>
                  <td><StatusPill tone="neutral">Entwurf</StatusPill></td>
                </tr>
              ))}
              {rfqDrafts.length === 0 && (
                <tr>
                  <td colSpan="6">Noch keine Entwürfe gespeichert.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Aktive RFQs</h2>
          <span>Aktualisiert sich direkt nach dem Versand</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>RFQ-ID</th>
                <th>Material</th>
                <th>Menge</th>
                <th>Lieferanten</th>
                <th>Status</th>
                <th>Frist</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {activeRFQs.map((rfq) => (
                <tr key={rfq.id}>
                  <td><strong>{rfq.id}</strong></td>
                  <td>{rfq.material}</td>
                  <td>{rfq.quantity}</td>
                  <td>{rfq.suppliers}</td>
                  <td>
                    <StatusPill tone={statusTone[rfq.status]}>{rfq.status}</StatusPill>
                  </td>
                  <td>{rfq.deadline}</td>
                  <td>
                    <Link className="btn btn--secondary btn--small table-action" to="/angebotsvergleich">
                      Angebote prüfen
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default RFQs
