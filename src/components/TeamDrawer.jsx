import { useState } from 'react'
import { useUi } from '../context/useUi.js'

const contacts = [
  { name: 'Lea Hoffmann', role: 'Einkauf', focus: 'Freigaben' },
  { name: 'Jonas Keller', role: 'Sourcing', focus: 'Lieferanten' },
  { name: 'Mara Singh', role: 'Finanzen', focus: 'Budget' },
  { name: 'Timo Berger', role: 'Recht', focus: 'Verträge' },
]

function TeamDrawer() {
  const { closeTeamDrawer, isTeamDrawerOpen, teamContext } = useUi()
  const [filter, setFilter] = useState('Alle')
  const visibleContacts = filter === 'Alle'
    ? contacts
    : contacts.filter((contact) => contact.focus === filter)

  if (!isTeamDrawerOpen) {
    return null
  }

  return (
    <div className="side-drawer" role="presentation">
      <button className="side-drawer__backdrop" type="button" aria-label="Team schließen" onClick={closeTeamDrawer} />
      <aside className="side-drawer__panel" aria-label="Team fragen">
        <header className="side-drawer__header">
          <div>
            <span>Zusammenarbeit</span>
            <h2>Team fragen</h2>
          </div>
          <button className="btn btn--ghost btn--small" type="button" onClick={closeTeamDrawer}>×</button>
        </header>

        <section className="side-drawer__context">
          <h3>Kontext anhängen</h3>
          <p>{teamContext.rfqId} · {teamContext.material}</p>
          <p>{teamContext.supplier} · Risiko: {teamContext.risk}</p>
          <p>{teamContext.recommendation}</p>
          <button className="btn btn--secondary btn--small" type="button">
            Kontext anhängen
          </button>
        </section>

        <label className="form-field">
          <span className="form-field__label">Verantwortung filtern</span>
          <select className="form-field__select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>Alle</option>
            <option>Freigaben</option>
            <option>Lieferanten</option>
            <option>Budget</option>
            <option>Verträge</option>
          </select>
        </label>

        <section className="side-drawer__list">
          {visibleContacts.map((contact) => (
            <article key={contact.name}>
              <strong>{contact.name}</strong>
              <span>{contact.role} · {contact.focus}</span>
            </article>
          ))}
        </section>

        <label className="form-field">
          <span className="form-field__label">Nachricht</span>
          <textarea className="form-field__textarea" rows="4" defaultValue="Bitte um kurze Einschätzung zu diesem Vorgang." />
        </label>
        <button className="btn btn--primary" type="button">Nachricht senden</button>
      </aside>
    </div>
  )
}

export default TeamDrawer
