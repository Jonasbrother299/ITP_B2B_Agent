import { NavLink } from 'react-router-dom'
import { useUi } from '../../context/useUi.js'
import { settingsDataSources, settingsNavigationItems } from '../../data/settingsData.js'

function DataSourceItem({ onOpen, source }) {
  return (
    <button className="data-source-row data-source-row--button" type="button" onClick={() => onOpen(source)}>
      <span>{source.name}</span>
      <strong>{source.status}</strong>
    </button>
  )
}

function DataSourceList() {
  const { openSourceDrawer } = useUi()
  const openDataSource = (source) => {
    openSourceDrawer({
      title: source.name,
      type: 'Datenquelle',
      content: `${source.name} ist mit Procura verbunden und wird für Bedarfserkennung, Sourcing, Verhandlung und Reporting verwendet.`,
      preview: source.status,
    })
  }

  return (
    <section className="settings-card">
      <div className="section-header">
        <h2>Datenquellen</h2>
        <span>5 von 5 aktiv</span>
      </div>
      <div className="settings-data-source-list">
        {settingsDataSources.map((source) => (
          <DataSourceItem key={source.name} onOpen={openDataSource} source={source} />
        ))}
      </div>
    </section>
  )
}

function SettingsHeader() {
  return (
    <div className="settings-header">
      <div>
        <span>Einstellungen</span>
        <h1>Datenquellen</h1>
        <p>
          Verbundene Systeme und Datenquellen für Bedarfserkennung, Sourcing,
          Verhandlung und Reporting.
        </p>
      </div>
      <nav className="settings-tabs" aria-label="Einstellungen">
        {settingsNavigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'settings-tabs__link settings-tabs__link--active' : 'settings-tabs__link'
            }
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function DataSourcesPage() {
  return (
    <section className="basic-page settings-area">
      <SettingsHeader />
      <div className="process-hint">
        Ihr nächster sinnvoller Schritt: angebundene Quellen prüfen
      </div>
      <DataSourceList />
    </section>
  )
}

export default DataSourcesPage
