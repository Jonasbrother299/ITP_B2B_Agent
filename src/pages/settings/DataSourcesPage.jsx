import { NavLink } from 'react-router-dom'
import { settingsDataSources, settingsNavigationItems } from '../../data/settingsData.js'

function DataSourceItem({ source }) {
  return (
    <div className="data-source-row">
      <span>{source.name}</span>
      <strong>{source.status}</strong>
    </div>
  )
}

function DataSourceList() {
  return (
    <section className="settings-card">
      <div className="section-header">
        <h2>Datenquellen</h2>
        <span>5 von 5 aktiv</span>
      </div>
      <div className="settings-data-source-list">
        {settingsDataSources.map((source) => (
          <DataSourceItem key={source.name} source={source} />
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
          Übersicht über angebundene Systeme, Vertragsquellen und externe
          Marktdaten für den KI-gestützten Einkaufsprozess.
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
      <DataSourceList />
    </section>
  )
}

export default DataSourcesPage
