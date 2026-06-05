import { useState } from 'react'
import StatusPill from '../components/StatusPill.jsx'
import {
  agentGovernance,
  autonomySettings,
  complianceSettings,
  escalationRules,
} from '../data/governanceData.js'

const escalationOptions = [
  'Human-in-the-Loop',
  'Freigabe erforderlich',
  'Einkauf entscheidet',
]

function SettingsSection({ title, children, modifier = '' }) {
  return (
    <section className="settings-page__section">
      <h2>{title}</h2>
      <div className={`settings-page__grid ${modifier}`}>{children}</div>
    </section>
  )
}

function SettingCard({ setting, children }) {
  return (
    <article className="settings-page__card">
      <div className="settings-page__row">
        <span>{setting.label}</span>
        {children}
      </div>
      {setting.description && <p>{setting.description}</p>}
    </article>
  )
}

function RegelnGovernance() {
  const [priceRange, setPriceRange] = useState(10)
  const [orderLimit, setOrderLimit] = useState(5000)
  const [newSupplierApproval, setNewSupplierApproval] = useState(true)
  const [escalations, setEscalations] = useState(
    escalationRules.map((rule) => rule.value),
  )
  const [compliance, setCompliance] = useState(
    complianceSettings.reduce(
      (values, setting) => ({ ...values, [setting.label]: setting.value === 'Aktiv' }),
      {},
    ),
  )
  const [agentAutonomy, setAgentAutonomy] = useState(
    agentGovernance.reduce(
      (values, agent) => ({ ...values, [agent.name]: agent.autonomy }),
      {},
    ),
  )

  return (
    <section className="settings-page">
      <div className="settings-page__transition" aria-hidden="true">
        <div className="settings-page__panel settings-page__panel--primary" />
      </div>

      <header className="settings-page__header">
        <span>ProcureAI Einstellungen</span>
        <h1>Regeln & Governance</h1>
        <p>
          Definieren Sie, welche Entscheidungen KI-Agenten autonom treffen dürfen und
          wann menschliche Freigaben erforderlich sind.
        </p>
      </header>

      <SettingsSection title="Autonomiegrenzen">
        <SettingCard setting={autonomySettings[0]}>
          <label className="settings-page__field">
            <input
              min="0"
              max="25"
              type="number"
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
            />
            <em>±{priceRange || 0} %</em>
          </label>
        </SettingCard>

        <SettingCard setting={autonomySettings[1]}>
          <label className="settings-page__field">
            <input
              min="0"
              step="500"
              type="number"
              value={orderLimit}
              onChange={(event) => setOrderLimit(event.target.value)}
            />
            <em>{Number(orderLimit || 0).toLocaleString('de-DE')} €</em>
          </label>
        </SettingCard>

        <SettingCard setting={autonomySettings[2]}>
          <label className="settings-page__toggle">
            <input
              checked={newSupplierApproval}
              type="checkbox"
              onChange={(event) => setNewSupplierApproval(event.target.checked)}
            />
            <span>{newSupplierApproval ? 'Aktiv' : 'Inaktiv'}</span>
          </label>
        </SettingCard>
      </SettingsSection>

      <SettingsSection title="Eskalationsregeln">
        {escalationRules.map((setting, index) => (
          <SettingCard key={setting.label} setting={setting}>
            <select
              className="settings-page__select"
              value={escalations[index]}
              onChange={(event) => {
                const nextEscalations = [...escalations]
                nextEscalations[index] = event.target.value
                setEscalations(nextEscalations)
              }}
            >
              {escalationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </SettingCard>
        ))}
      </SettingsSection>

      <SettingsSection title="Compliance & Nachvollziehbarkeit">
        {complianceSettings.map((setting) => (
          <SettingCard key={setting.label} setting={setting}>
            <label className="settings-page__toggle">
              <input
                checked={compliance[setting.label]}
                type="checkbox"
                onChange={(event) =>
                  setCompliance({
                    ...compliance,
                    [setting.label]: event.target.checked,
                  })
                }
              />
              <span>{compliance[setting.label] ? 'Aktiv' : 'Inaktiv'}</span>
            </label>
          </SettingCard>
        ))}
      </SettingsSection>

      <SettingsSection title="Agenten-Steuerung" modifier="settings-page__grid--agents">
        {agentGovernance.map((agent) => (
          <article
            className={`settings-page__agent-card settings-page__agent-card--${agent.tone}`}
            key={agent.name}
          >
            <div>
              <h3>{agent.name}</h3>
              <StatusPill tone={agent.tone}>{agent.status}</StatusPill>
            </div>
            <p>{agent.description}</p>
            <footer>
              <span>Autonomielevel</span>
              <select
                className="settings-page__select"
                value={agentAutonomy[agent.name]}
                onChange={(event) =>
                  setAgentAutonomy({
                    ...agentAutonomy,
                    [agent.name]: event.target.value,
                  })
                }
              >
                <option>Niedrig</option>
                <option>Mittel</option>
                <option>Hoch</option>
              </select>
            </footer>
          </article>
        ))}
      </SettingsSection>
    </section>
  )
}

export default RegelnGovernance
