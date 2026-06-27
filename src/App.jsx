import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import { ProcurementProvider } from './context/ProcurementContext.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import { UiProvider } from './context/UiContext.jsx'
import Angebotsvergleich from './pages/Angebotsvergleich.jsx'
import Bedarfserkennung from './pages/Bedarfserkennung.jsx'
import Bestellungen from './pages/Bestellungen.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DataSourcesPage from './pages/settings/DataSourcesPage.jsx'
import Freigaben from './pages/Freigaben.jsx'
import Lieferantensuche from './pages/Lieferantensuche.jsx'
import RegelnGovernance from './pages/RegelnGovernance.jsx'
import Reporting from './pages/Reporting.jsx'
import RFQs from './pages/RFQs.jsx'
import Verhandlungen from './pages/Verhandlungen.jsx'
import VorgangDetail from './pages/VorgangDetail.jsx'

function App() {
  return (
    <ProcurementProvider>
      <UiProvider>
        <ToastProvider>
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate replace to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bedarfserkennung" element={<Bedarfserkennung />} />
                <Route path="/lieferantensuche" element={<Lieferantensuche />} />
                <Route path="/rfqs" element={<RFQs />} />
                <Route path="/angebotsvergleich" element={<Angebotsvergleich />} />
                <Route path="/verhandlungen" element={<Verhandlungen />} />
                <Route path="/freigaben" element={<Freigaben />} />
                <Route path="/freigaben/:id" element={<VorgangDetail />} />
                <Route path="/vorgaenge/:id" element={<VorgangDetail />} />
                <Route path="/bestellungen" element={<Bestellungen />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/regeln-governance" element={<RegelnGovernance />} />
                <Route path="/settings" element={<Navigate replace to="/settings/data-sources" />} />
                <Route path="/settings/data-sources" element={<DataSourcesPage />} />
                <Route path="*" element={<Navigate replace to="/dashboard" />} />
              </Route>
            </Routes>
          </HashRouter>
        </ToastProvider>
      </UiProvider>
    </ProcurementProvider>
  )
}

export default App
