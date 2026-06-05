import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

function AppLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
