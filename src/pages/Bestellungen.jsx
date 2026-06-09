import { useEffect, useMemo } from 'react'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const riskTone = {
  niedrig: 'active',
  mittel: 'warning',
  hoch: 'risk',
}

const statusTone = {
  'Bestellung vorbereitet': 'warning',
  'Bestellung erstellt': 'blue',
  'ERP-Übergabe erfolgt': 'active',
  'Lieferbestätigung offen': 'warning',
  'Lieferverzug möglich': 'risk',
}

function OrderDetailModal({ onClose, onSimulateHandover, order }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const nextStep =
    order.status === 'ERP-Übergabe erfolgt'
      ? 'Lieferbestätigung vom Lieferanten prüfen.'
      : 'Bestellung an das ERP-System übergeben.'

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Lieferstatus</span>
            <h2 id="order-modal-title">{order.orderId}</h2>
          </div>
          <StatusPill tone={statusTone[order.status] || 'neutral'}>{order.status}</StatusPill>
        </header>
        <div className="modal__body">
          <div>
            <h3>Material</h3>
            <p>{order.material}</p>
          </div>
          <div>
            <h3>Lieferant</h3>
            <p>{order.supplier}</p>
          </div>
          <div>
            <h3>Preis</h3>
            <p>{order.price}</p>
          </div>
          <div>
            <h3>Aktueller Status</h3>
            <p>{order.status}</p>
          </div>
          <div>
            <h3>Nächster Schritt</h3>
            <p>{nextStep}</p>
          </div>
          <div>
            <h3>Risiko</h3>
            <p>{order.risk}</p>
          </div>
        </div>
        <footer className="modal__footer">
          <button
            className="btn btn--primary"
            disabled={order.status === 'ERP-Übergabe erfolgt'}
            type="button"
            onClick={() => onSimulateHandover(order)}
          >
            ERP-Übergabe vorbereiten
          </button>
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Schließen
          </button>
        </footer>
      </section>
    </div>
  )
}

function Bestellungen() {
  const { orders, selectedOrder, setSelectedOrder, updateOrderStatus } = useProcurement()
  const { showToast } = useToast()

  const metrics = useMemo(() => {
    const waiting = orders.filter((order) => order.status !== 'ERP-Übergabe erfolgt').length
    const risks = orders.filter((order) => order.risk !== 'niedrig').length

    return [
      {
        label: 'Offene Bestellungen',
        value: orders.length,
        text: 'inkl. vorbereiteter Bestellungen',
      },
      {
        label: 'Wartet auf Lieferbestätigung',
        value: waiting,
        text: 'noch nicht final bestätigt',
      },
      {
        label: 'Verzögerungsrisiken',
        value: risks,
        text: 'mittlere oder hohe Risiken',
      },
    ]
  }, [orders])

  const handleSimulateHandover = (order) => {
    updateOrderStatus(order.orderId, 'ERP-Übergabe erfolgt')
    showToast('Bestellung wurde an das ERP-System übergeben.')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Bestellmanagement</span>
        <h1>Bestellungen</h1>
        <p>
          Übersicht über erstellte Bestellungen, ERP-Übergaben und laufende
          Auftragsabwicklung.
        </p>
      </div>

      <section className="basic-page__cards">
        {metrics.map((metric) => (
          <article className="info-card info-card--compact" key={metric.label}>
            <span>{metric.value}</span>
            <h2>{metric.label}</h2>
            <p>{metric.text}</p>
          </article>
        ))}
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Bestellübersicht</h2>
          <span>Erstellte und vorbereitete Bestellungen</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bestellung</th>
                <th>Material</th>
                <th>Lieferant</th>
                <th>Preis</th>
                <th>Status</th>
                <th>Liefertermin</th>
                <th>Risiko</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td><strong>{order.orderId}</strong></td>
                  <td>{order.material}</td>
                  <td>{order.supplier}</td>
                  <td>{order.price}</td>
                  <td><StatusPill tone={statusTone[order.status] || 'neutral'}>{order.status}</StatusPill></td>
                  <td>{order.deliveryDate}</td>
                  <td><StatusPill tone={riskTone[order.risk]}>{order.risk}</StatusPill></td>
                  <td>
                    <button className="btn btn--secondary btn--small" type="button" onClick={() => setSelectedOrder(order)}>
                      Lieferstatus prüfen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <OrderDetailModal
          onClose={() => setSelectedOrder(null)}
          onSimulateHandover={handleSimulateHandover}
          order={selectedOrder}
        />
      )}
    </section>
  )
}

export default Bestellungen
