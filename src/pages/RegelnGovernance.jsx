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

const autonomyLevels = ['Niedrig', 'Mittel', 'Hoch']

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
        <div>
          <span>{setting.label}</span>
          {setting.description && <p>{setting.description}</p>}
        </div>
        {children}
      </div>
    </article>
  )
}

function NumericControl({ max, min = 0, onChange, step = 1, suffix, value }) {
  const updateValue = (nextValue) => {
    onChange(Math.min(max, Math.max(min, nextValue)))
  }

  return (
    <div className="stepper-control">
      <div className="stepper-control__main">
        <button className="btn btn--ghost btn--small" type="button" onClick={() => updateValue(value - step)}>
          −
        </button>
        <strong>{value.toLocaleString('de-DE')} {suffix}</strong>
        <button className="btn btn--ghost btn--small" type="button" onClick={() => updateValue(value + step)}>
          +
        </button>
      </div>
      <input
        max={max}
        min={min}
        type="range"
        value={value}
        onChange={(event) => updateValue(Number(event.target.value))}
      />
      <div className="stepper-control__limits">
        <span>{min} {suffix}</span>
        <span>{max.toLocaleString('de-DE')} {suffix}</span>
      </div>
    </div>
  )
}

function SwitchControl({ checked, label, onChange }) {
  return (
    <button
      className={`switch-control ${checked ? 'switch-control--on' : ''}`}
      type="button"
      onClick={() => onChange(!checked)}
    >
      <span className="switch-control__track">
        <i />
      </span>
      <span>{label}</span>
      <strong>{checked ? 'Aktiv' : 'Inaktiv'}</strong>
    </button>
  )
}

function SegmentedControl({ onChange, value }) {
  return (
    <div className="segmented-control" role="group" aria-label="Autonomielevel">
      {autonomyLevels.map((level) => (
        <button
          className={level === value ? 'segmented-control__item segmented-control__item--active' : 'segmented-control__item'}
          key={level}
          type="button"
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  )
}

function RegelnGovernance() {
  const [priceRange, setPriceRange] = useState(10)
  const [orderLimit, setOrderLimit] = useState(5000)
  const [negotiationDuration, setNegotiationDuration] = useState(48)
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
        <SettingCard
          setting={{
            ...autonomySettings[0],
            description: 'Legt fest, in welchem Rahmen der Negotiation Agent autonom verhandeln darf.',
          }}
        >
          <NumericControl max={25} onChange={setPriceRange} suffix="%" value={priceRange} />
        </SettingCard>

        <SettingCard setting={autonomySettings[1]}>
          <NumericControl max={25000} onChange={setOrderLimit} step={500} suffix="€" value={orderLimit} />
        </SettingCard>

        <SettingCard
          setting={{
            label: 'Maximale Verhandlungsdauer',
            description: 'Begrenzt automatische Verhandlungen, bevor eine Eskalation erfolgt.',
          }}
        >
          <NumericControl max={96} onChange={setNegotiationDuration} step={4} suffix="h" value={negotiationDuration} />
        </SettingCard>

        <SettingCard setting={autonomySettings[2]}>
          <SwitchControl
            checked={newSupplierApproval}
            label="Neue Lieferanten"
            onChange={setNewSupplierApproval}
          />
        </SettingCard>
      </SettingsSection>

      <SettingsSection title="Eskalationsregeln">
        {escalationRules.map((setting, index) => (
          <SettingCard key={setting.label} setting={setting}>
            <select
              className="form-field__select settings-page__select"
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
            <SwitchControl
              checked={compliance[setting.label]}
              label={setting.label}
              onChange={(checked) =>
                setCompliance({
                  ...compliance,
                  [setting.label]: checked,
                })
              }
            />
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
              <SegmentedControl
                value={agentAutonomy[agent.name]}
                onChange={(level) =>
                  setAgentAutonomy({
                    ...agentAutonomy,
                    [agent.name]: level,
                  })
                }
              />
            </footer>
          </article>
        ))}
      </SettingsSection>
    </section>
  )
}

export default RegelnGovernance
