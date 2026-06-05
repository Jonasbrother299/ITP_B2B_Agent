export const autonomySettings = [
  {
    label: 'Preisverhandlungsspielraum',
    value: '±10 %',
    description: 'KI-Agenten dürfen Angebote innerhalb dieses Korridors eigenständig optimieren.',
  },
  {
    label: 'Maximale automatische Bestellsumme',
    value: '5.000 €',
    description: 'Bestellungen oberhalb dieser Schwelle benötigen eine menschliche Freigabe.',
  },
  {
    label: 'Neue Lieferanten immer zur Freigabe',
    value: 'Aktiv',
    description: 'Unbekannte Lieferanten werden vor jeder Nutzung durch den Einkauf geprüft.',
  },
]

export const escalationRules = [
  {
    label: 'Preisabweichung über 10 %',
    value: 'Human-in-the-Loop',
  },
  {
    label: 'Risikobewertung unvollständig',
    value: 'Freigabe erforderlich',
  },
  {
    label: 'Vertragsänderung außerhalb Standardbedingungen',
    value: 'Einkauf entscheidet',
  },
]

export const complianceSettings = [
  {
    label: 'Alle KI-Entscheidungen protokollieren',
    value: 'Aktiv',
  },
  {
    label: 'Datenquelle je Empfehlung anzeigen',
    value: 'Aktiv',
  },
  {
    label: 'Audit-Log revisionssicher speichern',
    value: 'Aktiv',
  },
]

export const agentGovernance = [
  {
    name: 'Sourcing Agent',
    description: 'Findet neue Lieferanten und erstellt qualifizierte Shortlists.',
    status: 'Aktiv',
    autonomy: 'Mittel',
    tone: 'blue',
  },
  {
    name: 'Negotiation Agent',
    description: 'Verhandelt Preise und Konditionen innerhalb definierter Grenzen.',
    status: 'Aktiv',
    autonomy: 'Hoch',
    tone: 'purple',
  },
  {
    name: 'Intelligence Agent',
    description: 'Erkennt Risiken, Bedarfe und Abweichungen in Einkaufsprozessen.',
    status: 'Aktiv',
    autonomy: 'Mittel',
    tone: 'warning',
  },
  {
    name: 'Reporting Agent',
    description: 'Erstellt Auswertungen, Kennzahlen und Management-Übersichten.',
    status: 'Aktiv',
    autonomy: 'Niedrig',
    tone: 'active',
  },
]
