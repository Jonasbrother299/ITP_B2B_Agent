import { useNavigate } from 'react-router-dom'
import ActionMenu from '../components/ActionMenu.jsx'
import InfoCard from '../components/cards/InfoCard.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'

const priorityTone = {
  hoch: 'risk',
  mittel: 'warning',
  niedrig: 'active',
}

function Bedarfserkennung() {
  const navigate = useNavigate()
  const { detectedNeeds, prepareNeedForRfq } = useProcurement()
  const criticalNeeds = detectedNeeds.filter((need) => need.priority === 'hoch').length
  const preparedNeeds = detectedNeeds.filter((need) => need.status === 'RFQ vorbereitet').length

  const handleCreateRfq = (need) => {
    prepareNeedForRfq(need)
    navigate('/rfqs')
  }

  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>Bedarf erkannt</span>
        <h1>Bedarfserkennung</h1>
        <p>
          Automatische Erkennung von Beschaffungsbedarfen aus Bestandsdaten,
          Planung, offenen Bestellungen und Prognosen.
        </p>
      </div>

      <div className="process-hint">
        Ihr nächster sinnvoller Schritt: kritischen Bedarf in eine RFQ überführen
      </div>

      <div className="basic-page__cards">
        <InfoCard title="Erkannte Bedarfe" value={String(detectedNeeds.length)} text="Aus ERP, Planung und Forecasts konsolidiert." />
        <InfoCard title="Kritische Lagerbestände" value={String(criticalNeeds)} text="Bedarfe mit hoher Priorität." />
        <InfoCard title="RFQs vorbereitet" value={String(preparedNeeds)} text="Bedarfe mit gestarteter Anfrage." />
      </div>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Erkannte Bedarfe</h2>
          <span>Bestand, Prognose und empfohlene nächste Schritte</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Aktueller Bestand</th>
                <th>Mindestbestand</th>
                <th>Prognose</th>
                <th>Priorität</th>
                <th>Vorschlag</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {detectedNeeds.map((need) => (
                <tr key={need.id}>
                  <td><strong>{need.material}</strong></td>
                  <td>{need.currentStock}</td>
                  <td>{need.minimumStock}</td>
                  <td>{need.forecast}</td>
                  <td>
                    <StatusPill tone={priorityTone[need.priority]}>{need.priority}</StatusPill>
                  </td>
                  <td>{need.suggestion}</td>
                  <td>
                    <StatusPill tone={need.status === 'RFQ vorbereitet' ? 'blue' : 'neutral'}>
                      {need.status}
                    </StatusPill>
                  </td>
                  <td>
                    <ActionMenu
                      actions={[
                        { label: 'Öffnen', disabled: true },
                        { label: 'Prüfen', disabled: true },
                        { label: 'Freigeben', disabled: true },
                        { label: 'Nachricht senden', disabled: true },
                        { label: 'RFQ erstellen', onClick: () => handleCreateRfq(need) },
                      ]}
                    />
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

export default Bedarfserkennung
