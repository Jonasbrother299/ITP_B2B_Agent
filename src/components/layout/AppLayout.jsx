import { Outlet } from 'react-router-dom'
import SourceDrawer from '../SourceDrawer.jsx'
import TeamDrawer from '../TeamDrawer.jsx'
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
      <TeamDrawer />
      <SourceDrawer />
    </div>
  )
}

export default AppLayout
