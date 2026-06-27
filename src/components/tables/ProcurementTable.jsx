import ActionMenu from '../ActionMenu.jsx'
import StatusPill from '../StatusPill.jsx'

function ProcurementTable({ processes }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Vorgang</th>
            <th>Material / Produkt</th>
            <th>Lieferant</th>
            <th>Status</th>
            <th>Nächster Schritt</th>
            <th>Verantwortlich</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>
                <strong>{process.id}</strong>
              </td>
              <td>{process.product}</td>
              <td>{process.supplier}</td>
              <td>
                <StatusPill tone={process.tone}>{process.status}</StatusPill>
              </td>
              <td>→ {process.nextStep}</td>
              <td>{process.owner}</td>
              <td>
                <ActionMenu
                  actions={[
                    { label: 'Öffnen', to: process.path },
                    { label: 'Prüfen', to: process.path },
                    { label: 'Freigeben', disabled: true },
                    { label: 'Nachricht senden', disabled: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProcurementTable
