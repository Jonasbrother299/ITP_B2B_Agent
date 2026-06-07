import { NavLink } from 'react-router-dom'
import { navigationItems, settingsNavigationItems } from '../../data/navigationData.js'

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand">
        <div className="sidebar__mark">P</div>
        <div>
          <strong>ProcureAI</strong>
          <span>B2B Einkauf · v2.1</span>
        </div>
      </div>

      <span className="sidebar__section">Einkaufsprozess</span>
      <nav className="sidebar__nav">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
            key={item.path}
            to={item.path}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <em>{item.badge}</em>}
          </NavLink>
        ))}
      </nav>

      <span className="sidebar__section sidebar__section--settings">Einstellungen</span>
      <nav className="sidebar__nav">
        {settingsNavigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
            key={item.path}
            to={item.path}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__status">
        <span>Einkaufsteam</span>
        <strong>Online</strong>
      </div>
    </aside>
  )
}

export default Sidebar
