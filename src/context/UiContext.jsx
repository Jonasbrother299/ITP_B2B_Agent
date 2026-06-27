import { useEffect, useMemo, useState } from 'react'
import { UiContext } from './uiContext.js'

const defaultTeamContext = {
  rfqId: 'RFQ-1024',
  material: 'Bauteil A-482',
  supplier: 'Müller GmbH',
  recommendation: 'Freigabe durch Einkauf erforderlich',
  risk: 'Mittel',
}

const defaultSource = {
  title: 'ERP-Daten',
  type: 'ERP',
  content: 'Bestands-, RFQ- und Bestelldaten aus dem angebundenen ERP-System.',
}

export function UiProvider({ children }) {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('procura-theme') || 'dark')
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false)
  const [teamContext, setTeamContext] = useState(defaultTeamContext)
  const [sourceDrawer, setSourceDrawer] = useState({ isOpen: false, source: defaultSource })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('procura-theme', theme)
  }, [theme])

  const openTeamDrawer = (context = defaultTeamContext) => {
    setTeamContext({ ...defaultTeamContext, ...context })
    setIsTeamDrawerOpen(true)
  }

  const openSourceDrawer = (source = defaultSource) => {
    setSourceDrawer({ isOpen: true, source: { ...defaultSource, ...source } })
  }

  const value = useMemo(() => ({
    closeSourceDrawer: () => setSourceDrawer((drawer) => ({ ...drawer, isOpen: false })),
    closeTeamDrawer: () => setIsTeamDrawerOpen(false),
    isTeamDrawerOpen,
    openSourceDrawer,
    openTeamDrawer,
    setTheme,
    sourceDrawer,
    teamContext,
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
  }), [isTeamDrawerOpen, sourceDrawer, teamContext, theme])

  return (
    <UiContext.Provider value={value}>
      {children}
    </UiContext.Provider>
  )
}
