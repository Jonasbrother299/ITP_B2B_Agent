import { useState } from 'react'
import StatusPill from '../components/StatusPill.jsx'
import { useProcurement } from '../context/useProcurement.js'
import { useToast } from '../context/useToast.js'

const autonomyLevels = ['Niedrig', 'Mittel', 'Hoch']

const escalationSettings = [
  {
    key: 'priceDeviation',
    label: 'Preisabweichung über Grenze eskalieren',
    description: 'Leitet Angebote außerhalb definierter Preisgrenzen an den Einkauf weiter.',
  },
  {
    key: 'newSuppliers',
    label: 'Neue Lieferanten immer zur Freigabe',
    description: 'Erzwingt Prüfung bei Lieferanten ohne vollständige Historie.',
  },
  {
    key: 'contractChanges',
    label: 'Vertragsänderung zur Prüfung weiterleiten',
    description: 'Stoppt autonome Entscheidungen bei abweichenden Vertragsbedingungen.',
  },
  {
    key: 'deliveryDelay',
    label: 'Lieferverzug bei kritischem Material eskalieren',
    description: 'Hebt Verzögerungsrisiken für kritische Bedarfe hervor.',
  },
]

const complianceSettings = [
  {
    key: 'decisionLog',
    label: 'Alle KI-Entscheidungen protokollieren',
    description: 'Speichert Entscheidungsgrundlagen für spätere Nachvollziehbarkeit.',
  },
  {
    key: 'showDataSources',
    label: 'Datenquelle je Empfehlung anzeigen',
    description: 'Zeigt pro Empfehlung die verwendeten Datenquellen an.',
  },
  {
    key: 'auditLog',
    label: 'Audit-Log revisionssicher speichern',
    description: 'Markiert Governance-relevante Ereignisse für Audits.',
  },
]

const agents = [
  {
    name: 'Sourcing Agent',
    status: 'Aktiv',
    tone: 'blue',
    description: 'Identifiziert passende Lieferanten und bewertet Marktoptionen.',
  },
  {
    name: 'Negotiation Agent',
    status: 'Aktiv',
    tone: 'purple',
    description: 'Verhandelt Preise und Konditionen innerhalb freigegebener Grenzen.',
  },
  {
    name: 'Intelligence Agent',
    status: 'Aktiv',
    tone: 'warning',
    description: 'Erkennt Bedarfe, Risiken und Empfehlungen aus Prozessdaten.',
  },
  {
    name: 'Reporting Agent',
    status: 'Aktiv',
    tone: 'active',
    description: 'Erstellt Kennzahlen, Management-Sichten und Prozessauswertungen.',
  },
]

const autonomyDescriptions = {
  'Sourcing Agent': {
    Niedrig: 'Schlägt passende Lieferanten vor und bewertet Marktoptionen. Entscheidungen bleiben vollständig beim Einkaufsteam.',
    Mittel: 'Priorisiert Lieferanten automatisch, erstellt Vorschläge für RFQs und markiert Risiken zur Prüfung.',
    Hoch: 'Startet definierte Sourcing-Schritte eigenständig innerhalb freigegebener Regeln und meldet nur kritische Abweichungen.',
  },
  'Negotiation Agent': {
    Niedrig: 'Bereitet Verhandlungsargumente vor und zeigt mögliche Einsparpotenziale an.',
    Mittel: 'Erstellt Gegenangebote und schlägt Verhandlungsstrategien innerhalb definierter Grenzen vor.',
    Hoch: 'Führt standardisierte Preis- und Konditionsverhandlungen eigenständig innerhalb freigegebener Parameter.',
  },
  'Intelligence Agent': {
    Niedrig: 'Analysiert Prozessdaten und weist auf Bedarfe, Risiken und Auffälligkeiten hin.',
    Mittel: 'Priorisiert Risiken, erkennt Muster und gibt konkrete Handlungsempfehlungen.',
    Hoch: 'Überwacht Datenquellen kontinuierlich, erkennt kritische Entwicklungen und stößt empfohlene Maßnahmen automatisch an.',
  },
  'Reporting Agent': {
    Niedrig: 'Erstellt einfache Kennzahlen und Übersichten für operative Auswertungen.',
    Mittel: 'Generiert Management-Sichten, erkennt Trends und hebt relevante Abweichungen hervor.',
    Hoch: 'Erstellt Reports automatisch, bewertet Entwicklungen und bereitet Entscheidungsgrundlagen eigenständig vor.',
  },
}

const readSavedAgentLevels = (fallbackLevels) => {
  try {
    const savedLevels = window.localStorage.getItem('procureai-agent-autonomy-levels')
    return savedLevels ? { ...fallbackLevels, ...JSON.parse(savedLevels) } : fallbackLevels
  } catch {
    return fallbackLevels
  }
}

function SettingsSection({ title, children, modifier = '', onSave }) {
  return (
    <section className="settings-page__section">
      <h2>{title}</h2>
      <div className={`settings-page__grid ${modifier}`}>{children}</div>
      {onSave && (
        <footer className="settings-page__section-actions">
          <button className="btn btn--primary" type="button" onClick={onSave}>
            Speichern
          </button>
        </footer>
      )}
    </section>
  )
}

function SettingCard({ setting, children, variant = 'default' }) {
  return (
    <article className={`settings-page__card setting-control setting-control--${variant}`}>
      <div className="setting-control__content">
        <span className="setting-control__title">{setting.label}</span>
        {setting.description && <p className="setting-control__description">{setting.description}</p>}
      </div>
      <div className="setting-control__actions">
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
      <div className="stepper-control__main setting-control__stepper">
        <button className="btn btn--ghost btn--small" type="button" onClick={() => updateValue(value - step)}>
          −
        </button>
        <strong className="setting-control__value">{value.toLocaleString('de-DE')} {suffix}</strong>
        <button className="btn btn--ghost btn--small" type="button" onClick={() => updateValue(value + step)}>
          +
        </button>
      </div>
      <input
        className="setting-control__slider"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => updateValue(Number(event.target.value))}
      />
      <div className="stepper-control__limits setting-control__range-labels">
        <span>{min.toLocaleString('de-DE')} {suffix}</span>
        <span>{max.toLocaleString('de-DE')} {suffix}</span>
      </div>
    </div>
  )
}

function SwitchControl({ checked, onChange }) {
  return (
    <button
      className={`switch-control ${checked ? 'switch-control--on' : ''}`}
      type="button"
      onClick={() => onChange(!checked)}
    >
      <span className="switch-control__track">
        <i />
      </span>
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
  const {
    agentAutonomyLevels,
    governanceSettings,
    updateAgentAutonomyLevel,
    updateGovernanceSetting,
  } = useProcurement()
  const { showToast } = useToast()
  const { autonomyLimits, compliance, escalationRules } = governanceSettings
  const [draftAgentAutonomyLevels, setDraftAgentAutonomyLevels] = useState(() =>
    readSavedAgentLevels(agentAutonomyLevels),
  )

  const updateAutonomyLimit = (key, value) => {
    updateGovernanceSetting('autonomyLimits', key, value)
    showToast('Regel aktualisiert.')
  }

  const updateEscalation = (key, value) => {
    updateGovernanceSetting('escalationRules', key, value)
    showToast('Eskalationsregel aktualisiert.')
  }

  const updateCompliance = (key, value) => {
    updateGovernanceSetting('compliance', key, value)
    showToast('Compliance-Einstellung aktualisiert.')
  }

  const updateAgentDraft = (agentName, level) => {
    setDraftAgentAutonomyLevels((levels) => ({
      ...levels,
      [agentName]: level,
    }))
  }

  const saveAgentSettings = () => {
    Object.entries(draftAgentAutonomyLevels).forEach(([agentName, level]) => {
      updateAgentAutonomyLevel(agentName, level)
    })
    window.localStorage.setItem(
      'procureai-agent-autonomy-levels',
      JSON.stringify(draftAgentAutonomyLevels),
    )
    showToast('Agenten-Einstellungen gespeichert.')
  }

  const saveAutonomySettings = () => {
    window.localStorage.setItem(
      'procureai-autonomy-settings',
      JSON.stringify(autonomyLimits),
    )
    showToast('Autonomiegrenzen gespeichert.')
  }

  const saveEscalationSettings = () => {
    window.localStorage.setItem(
      'procureai-escalation-settings',
      JSON.stringify(escalationRules),
    )
    showToast('Eskalationsregeln gespeichert.')
  }

  const saveComplianceSettings = () => {
    window.localStorage.setItem(
      'procureai-compliance-settings',
      JSON.stringify(compliance),
    )
    showToast('Compliance-Einstellungen gespeichert.')
  }

  const activeEscalations = Object.values(escalationRules).filter(Boolean).length

  return (
    <section className="settings-page">
      <div className="settings-page__transition" aria-hidden="true">
        <div className="settings-page__panel settings-page__panel--primary" />
      </div>

      <header className="settings-page__header">
        <span>ProcureAI Einstellungen</span>
        <h1>Regeln & Governance</h1>
        <p>
          Definieren Sie, welche Entscheidungen KI-Agenten autonom treffen dürfen
          und wann menschliche Freigaben erforderlich sind.
        </p>
      </header>

      <SettingsSection title="Autonomiegrenzen" modifier="settings-page__grid--autonomy" onSave={saveAutonomySettings}>
        <SettingCard
          setting={{
            label: 'Preisverhandlungsspielraum',
            description: 'Legt fest, in welchem Rahmen der Negotiation Agent autonom verhandeln darf.',
          }}
          variant="numeric"
        >
          <NumericControl max={25} onChange={(value) => updateAutonomyLimit('priceRange', value)} suffix="%" value={autonomyLimits.priceRange} />
        </SettingCard>

        <SettingCard
          setting={{
            label: 'Maximale automatische Bestellsumme',
            description: 'Begrenzt Bestellungen, die ohne zusätzliche Freigabe vorbereitet werden.',
          }}
          variant="numeric"
        >
          <NumericControl max={25000} onChange={(value) => updateAutonomyLimit('orderLimit', value)} step={500} suffix="€" value={autonomyLimits.orderLimit} />
        </SettingCard>

        <SettingCard
          setting={{
            label: 'Maximale Verhandlungsdauer',
            description: 'Begrenzt automatische Verhandlungen, bevor eine Eskalation erfolgt.',
          }}
          variant="numeric"
        >
          <NumericControl max={96} min={1} onChange={(value) => updateAutonomyLimit('negotiationDuration', value)} suffix="h" value={autonomyLimits.negotiationDuration} />
        </SettingCard>
      </SettingsSection>

      <SettingsSection title="Eskalationsregeln" modifier="settings-page__grid--toggles" onSave={saveEscalationSettings}>
        {escalationSettings.map((setting) => (
          <SettingCard key={setting.key} setting={setting} variant="toggle">
            <SwitchControl
              checked={escalationRules[setting.key]}
              onChange={(checked) => updateEscalation(setting.key, checked)}
            />
          </SettingCard>
        ))}
      </SettingsSection>

      <SettingsSection title="Compliance & Nachvollziehbarkeit" modifier="settings-page__grid--toggles" onSave={saveComplianceSettings}>
        {complianceSettings.map((setting) => (
          <SettingCard key={setting.key} setting={setting} variant="toggle">
            <SwitchControl
              checked={compliance[setting.key]}
              onChange={(checked) => updateCompliance(setting.key, checked)}
            />
          </SettingCard>
        ))}
      </SettingsSection>

      <SettingsSection title="Agenten-Steuerung" modifier="settings-page__grid--agents">
        {agents.map((agent) => (
          <article
            className={`settings-page__agent-card settings-page__agent-card--${agent.tone}`}
            key={agent.name}
          >
            <div>
              <h3>{agent.name}</h3>
              <StatusPill tone={agent.tone}>{agent.status}</StatusPill>
            </div>
            <p>{autonomyDescriptions[agent.name][draftAgentAutonomyLevels[agent.name]]}</p>
            <footer>
              <span>Autonomielevel</span>
              <SegmentedControl
                value={draftAgentAutonomyLevels[agent.name]}
                onChange={(level) => updateAgentDraft(agent.name, level)}
              />
            </footer>
          </article>
        ))}
      </SettingsSection>

      <div className="settings-save-bar">
        <button className="btn btn--primary" type="button" onClick={saveAgentSettings}>
          Speichern
        </button>
      </div>

      <section className="settings-page__summary">
        <h2>Aktuelle Governance-Auswirkung</h2>
        <p>Negotiation Agent darf bis ±{autonomyLimits.priceRange} % autonom verhandeln.</p>
        <p>Automatische Bestellungen sind bis {autonomyLimits.orderLimit.toLocaleString('de-DE')} € erlaubt.</p>
        <p>{activeEscalations} aktive Eskalationsregeln leiten Freigaben an den Einkauf weiter.</p>
      </section>
    </section>
  )
}

export default RegelnGovernance
