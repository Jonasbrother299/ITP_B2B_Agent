function Topbar() {
  return (
    <header className="topbar">
      <label className="topbar__search">
        <span>Search</span>
        <input type="search" placeholder="Search suppliers, requests, contracts" />
      </label>

      <div className="topbar__profile" aria-label="Signed in user">
        <div>
          <strong>Mara Jensen</strong>
          <span>Procurement Lead</span>
        </div>
        <div className="topbar__avatar">MJ</div>
      </div>
    </header>
  )
}

export default Topbar
