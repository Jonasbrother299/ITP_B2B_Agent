import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InfoCard from '../components/cards/InfoCard.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  Niedrig: 'active',
  Mittel: 'warning',
  Hoch: 'risk',
}

const statusTone = {
  Verifiziert: 'active',
  'Bestehender Lieferant': 'blue',
  'Prüfung erforderlich': 'warning',
  'Risiko erkannt': 'risk',
}

const categories = ['Alle', 'Industriebedarf', 'Metallteile', 'Elektronik', 'Verpackungsmaterial', 'Hydraulik']
const risks = ['Alle', 'Niedrig', 'Mittel', 'Hoch']

function SupplierDetailsModal({ onClose, supplier }) {
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
        aria-labelledby="supplier-modal-title"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Lieferantenprofil</span>
            <h2 id="supplier-modal-title">{supplier.name}</h2>
          </div>
          <StatusPill tone={riskTone[supplier.risk]}>Risiko: {supplier.risk}</StatusPill>
        </header>
        <div className="modal__body">
          <div><h3>Kategorie</h3><p>{supplier.category}</p></div>
          <div><h3>Preisniveau</h3><p>{supplier.priceLevel}</p></div>
          <div><h3>Lieferzeit</h3><p>{supplier.deliveryTime}</p></div>
          <div><h3>Bewertung</h3><p>{supplier.rating}</p></div>
          <div><h3>Zertifikate</h3><p>{supplier.certificates.join(', ')}</p></div>
          <div><h3>Status</h3><p>{supplier.status}</p></div>
          <div>
            <h3>Bewertungslogik</h3>
            <p>
              Diese Bewertung basiert auf Preisniveau, Lieferzeit, Risiko,
              Zertifikaten und bisheriger Performance.
            </p>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Schließen
          </button>
        </footer>
      </section>
    </div>
  )
}

function Lieferantensuche() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    requestRfqForSupplier,
    selectSupplier,
    selectedSupplier,
    selectedSuppliersForComparison,
    suppliers,
    toggleSupplierComparison,
  } = useProcurement()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('Alle')
  const [categoryFilter, setCategoryFilter] = useState('Alle')
  const [detailSupplier, setDetailSupplier] = useState(null)

  const filteredSuppliers = useMemo(() => suppliers.filter((supplier) => {
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      supplier.name.toLowerCase().includes(query) ||
      supplier.category.toLowerCase().includes(query)
    const matchesRisk = riskFilter === 'Alle' || supplier.risk === riskFilter
    const matchesCategory = categoryFilter === 'Alle' || supplier.category === categoryFilter

    return matchesSearch && matchesRisk && matchesCategory
  }), [categoryFilter, riskFilter, search, suppliers])

  const metrics = [
    {
      title: 'Neue Lieferanten gefunden',
      value: String(suppliers.filter((supplier) => supplier.status !== 'Bestehender Lieferant').length),
      text: 'aus Markt- und Risikodaten',
    },
    {
      title: 'Bestehende Lieferanten',
      value: String(suppliers.filter((supplier) => supplier.status === 'Bestehender Lieferant').length),
      text: 'mit vorhandener Historie',
    },
    {
      title: 'Lieferanten mit Risiko',
      value: String(suppliers.filter((supplier) => supplier.risk !== 'Niedrig').length),
      text: 'Mittel oder Hoch',
    },
    {
      title: 'Verifizierte Lieferanten',
      value: String(suppliers.filter((supplier) => supplier.status === 'Verifiziert').length),
      text: 'mit vollständigen Nachweisen',
    },
  ]

  const clearFilters = () => {
    setSearch('')
    setRiskFilter('Alle')
    setCategoryFilter('Alle')
  }

  const handleSelect = (supplier) => {
    selectSupplier(supplier)
    showToast('Lieferant ausgewählt.')
  }

  const handleRequestOffer = (supplier) => {
    requestRfqForSupplier(supplier)
    navigate('/rfqs')
  }

  const handleCompare = (supplier) => {
    toggleSupplierComparison(supplier)
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Sourcing Intelligence</span>
        <h1>Lieferantensuche</h1>
        <p>
          Identifikation geeigneter Lieferanten anhand von Bedarf,
          Marktinformationen, Vertragsdaten und Risikobewertungen.
        </p>
      </div>

      <div className="basic-page__cards basic-page__cards--four">
        {metrics.map((metric) => (
          <InfoCard key={metric.title} title={metric.title} value={metric.value} text={metric.text} />
        ))}
      </div>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Filter</h2>
          <span>{filteredSuppliers.length} passende Lieferanten</span>
        </div>
        <div className="supplier-filters">
          <label className="form-field">
            <span className="form-field__label">Suche</span>
            <input
              className="form-field__input"
              placeholder="Lieferant oder Kategorie suchen"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Risiko</span>
            <select className="form-field__select" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
              {risks.map((risk) => <option key={risk}>{risk}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span className="form-field__label">Kategorie</span>
            <select className="form-field__select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <button className="btn btn--ghost" type="button" onClick={clearFilters}>
            Filter zurücksetzen
          </button>
        </div>
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Lieferanten</h2>
          <span>Auswählen, vergleichen oder direkt RFQ vorbereiten</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lieferant</th>
                <th>Kategorie</th>
                <th>Preisniveau</th>
                <th>Lieferzeit</th>
                <th>Risiko</th>
                <th>Bewertung</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => {
                const isSelected = selectedSupplier?.id === supplier.id
                const isCompared = selectedSuppliersForComparison.some((item) => item.id === supplier.id)

                return (
                  <tr className={`${isSelected ? 'table-row--selected' : ''} ${isCompared ? 'table-row--compared' : ''}`} key={supplier.id}>
                    <td><strong>{supplier.name}</strong></td>
                    <td>{supplier.category}</td>
                    <td>{supplier.priceLevel}</td>
                    <td>{supplier.deliveryTime}</td>
                    <td><StatusPill tone={riskTone[supplier.risk]}>{supplier.risk}</StatusPill></td>
                    <td>{supplier.rating}</td>
                    <td><StatusPill tone={statusTone[supplier.status]}>{supplier.status}</StatusPill></td>
                    <td>
                      <div className="inline-actions">
                        <button className="btn btn--ghost btn--small" type="button" onClick={() => setDetailSupplier(supplier)}>
                          Details
                        </button>
                        <button className="btn btn--secondary btn--small" type="button" onClick={() => handleSelect(supplier)}>
                          Auswählen
                        </button>
                        <button className="btn btn--primary btn--small" type="button" onClick={() => handleRequestOffer(supplier)}>
                          Angebot anfragen
                        </button>
                        <button className="btn btn--ghost btn--small" type="button" onClick={() => handleCompare(supplier)}>
                          {isCompared ? 'Entfernen' : 'Vergleichen'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedSuppliersForComparison.length >= 2 && (
        <section className="supplier-comparison-panel">
          <div className="section-header">
            <h2>Lieferantenvergleich</h2>
            <Link className="btn btn--primary btn--small" to="/angebotsvergleich">
              Zum Angebotsvergleich
            </Link>
          </div>
          <div className="supplier-comparison-grid">
            {selectedSuppliersForComparison.map((supplier) => (
              <article className="supplier-comparison-card" key={supplier.id}>
                <div>
                  <h3>{supplier.name}</h3>
                  <StatusPill tone={riskTone[supplier.risk]}>{supplier.risk}</StatusPill>
                </div>
                <dl>
                  <div><dt>Preisniveau</dt><dd>{supplier.priceLevel}</dd></div>
                  <div><dt>Lieferzeit</dt><dd>{supplier.deliveryTime}</dd></div>
                  <div><dt>Risiko</dt><dd>{supplier.risk}</dd></div>
                  <div><dt>Bewertung</dt><dd>{supplier.rating}</dd></div>
                  <div><dt>Status</dt><dd>{supplier.status}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {detailSupplier && (
        <SupplierDetailsModal supplier={detailSupplier} onClose={() => setDetailSupplier(null)} />
      )}
    </section>
  )
}

export default Lieferantensuche
