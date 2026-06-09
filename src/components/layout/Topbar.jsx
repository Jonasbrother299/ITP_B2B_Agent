import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { navigationItems } from '../../data/navigationData.js'

function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { pathname } = useLocation()
  const activeItem =
    navigationItems.find((item) => item.path === pathname) ?? navigationItems[0]

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">
        <span>ProcureAI</span>
        <strong>{activeItem.label}</strong>
      </div>

      <label className="topbar__search">
        <span>Suche</span>
        <input type="search" placeholder="Lieferant, RFQ oder Bestellung suchen" />
      </label>

      <div className="topbar__profile" aria-label="Signed in user">
        <button className="btn btn--ghost topbar__icon-button" type="button" aria-label="Benachrichtigungen">
          ○
        </button>
        <button
          className="btn btn--ghost topbar__profile-trigger"
          type="button"
          onClick={() => setIsProfileOpen(true)}
        >
          <div>
            <strong>Einkaufsteam</strong>
            <span>Operativer Einkauf</span>
          </div>
          <div className="topbar__avatar">ET</div>
        </button>
      </div>

      {isProfileOpen && (
        <div className="profile-drawer" role="presentation">
          <button
            className="profile-drawer__backdrop"
            type="button"
            aria-label="Profil schließen"
            onClick={() => setIsProfileOpen(false)}
          />
          <aside className="profile-drawer__card" aria-label="Profilinformationen">
            <button
              className="btn btn--ghost profile-drawer__close"
              type="button"
              aria-label="Profil schließen"
              onClick={() => setIsProfileOpen(false)}
            >
              ×
            </button>
            <div className="profile-drawer__identity">
              <div className="topbar__avatar">ET</div>
              <div>
                <h2>Einkaufsteam</h2>
                <p>Operativer Einkauf</p>
              </div>
            </div>
            <dl className="profile-drawer__meta">
              <div>
                <dt>Rolle</dt>
                <dd>Procurement Lead</dd>
              </div>
              <div>
                <dt>Freigabelimit</dt>
                <dd>25.000 €</dd>
              </div>
              <div>
                <dt>Aktive Freigaben</dt>
                <dd>6 Vorgänge</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Online</dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </header>
  )
}

export default Topbar
