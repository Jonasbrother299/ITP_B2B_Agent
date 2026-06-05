function Sidebar({ items }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand">
        <div className="sidebar__mark">PA</div>
        <div>
          <strong>ProcureAI</strong>
          <span>Agentic purchasing</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <a
            className={item.active ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
            href="#"
            key={item.label}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar__status">
        <span>AI orchestration</span>
        <strong>Live</strong>
      </div>
    </aside>
  )
}

export default Sidebar
