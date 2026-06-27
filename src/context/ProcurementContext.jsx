import { useEffect, useState } from 'react'
import { ProcurementContext } from './procurementContext.js'
import { demoRFQ } from './procurementDemoData.js'

const initialNeeds = [
  {
    id: 'NEED-1001',
    material: 'Stahlrohre 40×40mm',
    currentStock: '220 Stk.',
    minimumStock: '500 Stk.',
    forecast: 'Bedarf in 9 Tagen',
    priority: 'hoch',
    suggestedQuantity: '800',
    suggestedDeliveryDate: '2026-07-18',
    suggestion: 'RFQ für 800 Stk. vorbereiten',
    status: 'Neu',
  },
  {
    id: 'NEED-1002',
    material: 'Sensor X-200',
    currentStock: '48 Stk.',
    minimumStock: '120 Stk.',
    forecast: 'Bedarf in 14 Tagen',
    priority: 'mittel',
    suggestedQuantity: '250',
    suggestedDeliveryDate: '2026-07-24',
    suggestion: 'Lieferanten für 250 Stk. anfragen',
    status: 'Neu',
  },
  {
    id: 'NEED-1003',
    material: 'Schmierstoff Klasse 3',
    currentStock: '18 Kanister',
    minimumStock: '40 Kanister',
    forecast: 'Bedarf in 21 Tagen',
    priority: 'niedrig',
    suggestedQuantity: '60',
    suggestedDeliveryDate: '2026-08-01',
    suggestion: 'Rahmenvertrag prüfen und RFQ optional starten',
    status: 'Neu',
  },
]

const initialActiveRFQs = [
  demoRFQ,
  {
    id: 'RFQ-1028',
    material: 'Sensor X-200',
    quantity: '120',
    suppliers: '5 Lieferanten',
    status: 'Versendet',
    deadline: '2 Tage',
  },
]

const initialSupplierOffers = [
  {
    id: 'offer-northline',
    supplier: 'Northline Supply',
    price: 45200,
    priceLabel: '45.200 €',
    deliveryTime: '9 Tage',
    deliveryScore: 62,
    risk: 'Niedrig',
    riskScore: 24,
    quality: '94/100',
    terms: '30 Tage netto',
    badge: 'KI-Empfehlung',
    tone: 'active',
  },
  {
    id: 'offer-mueller',
    supplier: 'Müller Industriebedarf',
    price: 48100,
    priceLabel: '48.100 €',
    deliveryTime: '12 Tage',
    deliveryScore: 78,
    risk: 'Mittel',
    riskScore: 52,
    quality: '88/100',
    terms: '14 Tage netto',
    badge: 'Solide Option',
    tone: 'blue',
  },
  {
    id: 'offer-sensortech',
    supplier: 'SensorTech AG',
    price: 51700,
    priceLabel: '51.700 €',
    deliveryTime: '7 Tage',
    deliveryScore: 48,
    risk: 'Niedrig',
    riskScore: 30,
    quality: '91/100',
    terms: 'Vorkasse',
    badge: 'Schnellste Lieferung',
    tone: 'warning',
  },
]

const initialNegotiationTimeline = [
  'RFQ ausgewählt.',
  'Initialangebot eingegangen.',
  'Negotiation Agent hat Gegenangebot vorbereitet.',
]

const centralOfferComparison = [
  {
    id: 'offer-northline',
    supplier: 'Northline Supply',
    startPrice: '47.600 €',
    currentPrice: '45.200 €',
    targetDeviation: '+6,0 %',
    deliveryTime: '9 Tage',
    risk: 'Niedrig',
    quality: '94/100',
    history: 'Stabile Lieferleistung, 98 % Termintreue',
    aiReason: 'Bester Gesamtwert aus Preis, Lieferzeit und Risiko.',
    whyNot: 'Nicht abgelehnt; als Referenzangebot für Freigabe geeignet.',
    paymentTerms: '30 Tage netto',
    negotiationHistory: [
      'Initialangebot bei 47.600 € eingegangen',
      'Negotiation Agent hat Gegenangebot vorbereitet',
      'Lieferant senkt Preis auf 45.200 €',
    ],
    recommended: true,
  },
  {
    id: 'offer-mueller',
    supplier: 'Müller Industriebedarf',
    startPrice: '49.800 €',
    currentPrice: '43.900 €',
    targetDeviation: '+12,4 %',
    deliveryTime: '12 Tage',
    risk: 'Mittel',
    quality: '88/100',
    history: 'Bestehender Lieferant, zuletzt zwei Preisabweichungen.',
    aiReason: 'Solide Option, aber Preisabweichung überschreitet die Grenze.',
    whyNot: 'Nicht bevorzugt, weil Preisabweichung und Lieferzeit höher sind.',
    paymentTerms: '14 Tage netto',
    negotiationHistory: [],
    recommended: false,
  },
  {
    id: 'offer-sensortech',
    supplier: 'SensorTech AG',
    startPrice: '52.400 €',
    currentPrice: '48.700 €',
    targetDeviation: '+24,7 %',
    deliveryTime: '7 Tage',
    risk: 'Niedrig',
    quality: '91/100',
    history: 'Schnelle Lieferung, aber eingeschränkte Zahlungsbedingungen.',
    aiReason: 'Schnellste Lieferung, aber Preis und Konditionen sind schwächer.',
    whyNot: 'Nicht empfohlen, weil Vorkasse und höchster Preis den Vorteil überwiegen.',
    paymentTerms: 'Vorkasse',
    negotiationHistory: [],
    recommended: false,
  },
]

const initialApprovalCases = [
  {
    id: 'APR-1001',
    title: 'Preisabweichung über 10 %',
    reason: 'Angebot liegt 12,4 % über Zielpreis.',
    riskLevel: 'Hoch',
    aiRecommendation: 'Preis neu verhandeln oder Alternativlieferant prüfen.',
    dataSource: 'RFQ-1024 · Angebotsdaten',
    relatedSupplier: 'Northline Supply',
    relatedMaterial: 'Stahlrohre 40×40mm',
    proposedPrice: '43.900 €',
    status: 'Offen',
  },
  {
    id: 'APR-1002',
    title: 'Neuer Lieferant erkannt',
    reason: 'Zertifikate und Bonitätsdaten sind unvollständig.',
    riskLevel: 'Mittel',
    aiRecommendation: 'Lieferant erst nach Compliance-Prüfung freigeben.',
    dataSource: 'Lieferantendatenbank',
    relatedSupplier: 'PackPro AG',
    relatedMaterial: 'Verpackungsmaterial Typ B',
    proposedPrice: '12.400 €',
    status: 'Offen',
  },
  {
    id: 'APR-1003',
    title: 'Vertragsänderung außerhalb Standardbedingungen',
    reason: 'Zahlungsziel wurde auf 90 Tage angepasst.',
    riskLevel: 'Mittel',
    aiRecommendation: 'Einkaufsleiter entscheidet.',
    dataSource: 'Vertragsdaten',
    relatedSupplier: 'Müller Industriebedarf',
    relatedMaterial: 'Ersatzteile Linie 2',
    proposedPrice: '18.700 €',
    status: 'Offen',
  },
]

const initialOrders = [
  {
    orderId: 'B-10241',
    material: 'Stahlrohre 40×40mm',
    supplier: 'Northline Supply',
    price: '45.200 €',
    status: 'Bestellung erstellt',
    deliveryDate: '18.07.',
    risk: 'niedrig',
  },
  {
    orderId: 'B-10238',
    material: 'Sensor X-200',
    supplier: 'SensorTech AG',
    price: '22.900 €',
    status: 'ERP-Übergabe erfolgt',
    deliveryDate: '22.07.',
    risk: 'mittel',
  },
]

const initialSuppliers = [
  {
    id: 'SUP-001',
    name: 'Northline Supply',
    category: 'Industriebedarf',
    priceLevel: 'Niedrig',
    deliveryTime: '9 Tage',
    risk: 'Niedrig',
    rating: '94/100',
    certificates: ['ISO 9001', 'Nachhaltigkeitsnachweis'],
    status: 'Verifiziert',
  },
  {
    id: 'SUP-002',
    name: 'Müller Industriebedarf',
    category: 'Metallteile',
    priceLevel: 'Mittel',
    deliveryTime: '12 Tage',
    risk: 'Mittel',
    rating: '87/100',
    certificates: ['ISO 9001'],
    status: 'Bestehender Lieferant',
  },
  {
    id: 'SUP-003',
    name: 'SensorTech AG',
    category: 'Elektronik',
    priceLevel: 'Hoch',
    deliveryTime: '7 Tage',
    risk: 'Niedrig',
    rating: '91/100',
    certificates: ['ISO 9001', 'CE'],
    status: 'Verifiziert',
  },
  {
    id: 'SUP-004',
    name: 'PackPro AG',
    category: 'Verpackungsmaterial',
    priceLevel: 'Niedrig',
    deliveryTime: '14 Tage',
    risk: 'Mittel',
    rating: '82/100',
    certificates: ['Unvollständig'],
    status: 'Prüfung erforderlich',
  },
  {
    id: 'SUP-005',
    name: 'HydroTech GmbH',
    category: 'Hydraulik',
    priceLevel: 'Mittel',
    deliveryTime: '16 Tage',
    risk: 'Hoch',
    rating: '76/100',
    certificates: ['ISO 9001'],
    status: 'Risiko erkannt',
  },
]

const initialGovernanceSettings = {
  autonomyLimits: {
    priceRange: 10,
    orderLimit: 5000,
    negotiationDuration: 48,
    priceLimit: 10000,
    approvalThreshold: 5000,
    timeLimitDays: 7,
    riskThreshold: 'mittel',
  },
  escalationRules: {
    priceDeviation: true,
    newSuppliers: true,
    contractChanges: true,
    deliveryDelay: true,
  },
  compliance: {
    decisionLog: true,
    showDataSources: true,
    auditLog: true,
  },
}

const readSavedGovernanceSettings = () => {
  try {
    const savedSettings = window.localStorage.getItem('procura-governance-settings')
    if (!savedSettings) {
      return initialGovernanceSettings
    }

    const parsedSettings = JSON.parse(savedSettings)
    return {
      ...initialGovernanceSettings,
      ...parsedSettings,
      autonomyLimits: {
        ...initialGovernanceSettings.autonomyLimits,
        ...parsedSettings.autonomyLimits,
      },
      escalationRules: {
        ...initialGovernanceSettings.escalationRules,
        ...parsedSettings.escalationRules,
      },
      compliance: {
        ...initialGovernanceSettings.compliance,
        ...parsedSettings.compliance,
      },
    }
  } catch {
    return initialGovernanceSettings
  }
}

const initialAgentAutonomyLevels = {
  'Sourcing Agent': 'Mittel',
  'Negotiation Agent': 'Mittel',
  'Intelligence Agent': 'Hoch',
  'Reporting Agent': 'Hoch',
}

const initialActivityLog = [
  'RFQ wurde versendet',
  'Angebot wurde ausgewählt',
  'Verhandlungsergebnis vorbereitet',
  'Freigabe wurde erteilt',
  'Bestellung wurde an das ERP-System übergeben',
]

const createNegotiationCase = (offer, rfq = demoRFQ) => ({
  rfqId: rfq.id,
  material: rfq.material,
  supplier: offer.supplier,
  initialPrice: offer.price,
  targetPrice: Math.round(offer.price * 0.94),
  currentPrice: offer.price,
  status: 'Bereit zur Verhandlung',
  offer,
})

const mapApprovalRiskToOrderRisk = (riskLevel) => (riskLevel === 'Hoch' ? 'hoch' : 'mittel')

const createProcessSteps = (status = 'Offen') => [
  {
    id: 'demand',
    title: 'Bedarf erkannt',
    description: 'Bedarf aus Bestand, Planung und Prognose erkannt.',
    status: 'abgeschlossen',
    time: 'vor 3 Tagen',
  },
  {
    id: 'rfq',
    title: 'Lieferanten angefragt',
    description: 'RFQ an passende Lieferanten versendet.',
    status: 'abgeschlossen',
    time: 'vor 2 Tagen',
  },
  {
    id: 'offers',
    title: 'Angebote erhalten',
    description: '3 Angebote eingegangen und normalisiert.',
    status: 'abgeschlossen',
    time: 'vor 1 Tag',
  },
  {
    id: 'negotiation',
    title: 'KI-Vorverhandlung abgeschlossen',
    description: 'Preise und Konditionen wurden innerhalb der Regeln verhandelt.',
    status: 'abgeschlossen',
    time: 'vor 4 Stunden',
  },
  {
    id: 'review',
    title: status === 'Offen' ? 'Menschliche Prüfung erforderlich' : 'Entscheidung dokumentiert',
    description: status === 'Offen' ? 'Preisabweichung über Freigabegrenze.' : `Status wurde auf ${status} gesetzt.`,
    status: status === 'Offen' ? 'aktuell' : 'abgeschlossen',
    time: status === 'Offen' ? 'vor 3 Minuten' : 'gerade eben',
  },
  {
    id: 'order',
    title: 'Bestellung vorbereiten',
    description: 'Bestellung und ERP-Übergabe nach Entscheidung vorbereiten.',
    status: status === 'Freigegeben' ? 'aktuell' : 'ausstehend',
    time: status === 'Freigegeben' ? 'nächster Schritt' : 'ausstehend',
  },
]

const createApprovalCaseDetail = (approval) => ({
  id: approval.id,
  type: 'approval',
  title: `Vorgang: ${approval.relatedMaterial}`,
  status: approval.status === 'Offen' ? 'Prüfung erforderlich' : approval.status,
  updatedAt: 'vor 3 Minuten',
  material: approval.relatedMaterial,
  supplier: approval.relatedSupplier,
  rfqId: approval.dataSource.includes('RFQ') ? approval.dataSource.split(' · ')[0] : 'RFQ-1024',
  riskLevel: approval.riskLevel,
  decision: {
    title: approval.title,
    reason: approval.reason,
    recommendation: approval.aiRecommendation,
    context: `${approval.relatedSupplier} · ${approval.proposedPrice}`,
  },
  offers: centralOfferComparison,
  selectedOfferId: centralOfferComparison[0].id,
  processSteps: createProcessSteps(approval.status),
  sources: [
    {
      title: approval.dataSource,
      type: approval.dataSource.includes('RFQ') ? 'RFQ-Daten' : 'Datenquelle',
      content: `Kontext zu ${approval.relatedMaterial} und ${approval.relatedSupplier}.`,
      preview: approval.reason,
    },
    {
      title: 'Lieferantenhistorie',
      type: 'Lieferantenhistorie',
      content: `Historische Performance und Risikobewertung für ${approval.relatedSupplier}.`,
      preview: approval.aiRecommendation,
    },
  ],
  history: [
    `${approval.dataSource} geladen`,
    'Governance-Regel geprüft',
    'KI-Empfehlung erzeugt',
    'Fall an Einkauf übergeben',
  ],
})

const createRfqCaseDetail = (rfq) => ({
  id: rfq.id,
  type: 'rfq',
  title: `Vorgang: ${rfq.material || 'RFQ'}`,
  status: rfq.status,
  updatedAt: 'heute',
  material: rfq.material,
  supplier: rfq.suppliers,
  rfqId: rfq.id,
  riskLevel: 'Mittel',
  decision: {
    title: 'Angebote bewerten',
    reason: 'RFQ wartet auf Angebotsbewertung und mögliche Freigabe.',
    recommendation: 'Angebotsvergleich starten und empfohlene Option prüfen.',
    context: `${rfq.quantity || 'Menge offen'} · ${rfq.deadline || 'Frist offen'}`,
  },
  offers: centralOfferComparison,
  selectedOfferId: centralOfferComparison[0].id,
  processSteps: createProcessSteps('Offen'),
  sources: [
    {
      title: rfq.id,
      type: 'RFQ-Daten',
      content: `Anfrage für ${rfq.material}.`,
      preview: `Lieferanten: ${rfq.suppliers}`,
    },
  ],
  history: ['RFQ erstellt', 'Lieferanten ausgewählt', 'Angebote erwartet'],
})

const createOrderCaseDetail = (order) => ({
  id: order.orderId,
  type: 'order',
  title: `Vorgang: ${order.material}`,
  status: order.status,
  updatedAt: order.deliveryDate,
  material: order.material,
  supplier: order.supplier,
  rfqId: order.approvalId || 'RFQ-1024',
  riskLevel: order.risk === 'hoch' ? 'Hoch' : order.risk === 'mittel' ? 'Mittel' : 'Niedrig',
  decision: {
    title: 'Bestellstatus prüfen',
    reason: 'Bestellung muss für ERP-Übergabe und Lieferstatus nachverfolgt werden.',
    recommendation: 'ERP-Status prüfen und Lieferbestätigung überwachen.',
    context: `${order.price} · Liefertermin ${order.deliveryDate}`,
  },
  offers: centralOfferComparison,
  selectedOfferId: centralOfferComparison[0].id,
  processSteps: createProcessSteps(order.status === 'ERP-Übergabe erfolgt' ? 'Freigegeben' : 'Offen'),
  sources: [
    {
      title: order.orderId,
      type: 'ERP-Daten',
      content: `Bestellstatus für ${order.material}.`,
      preview: order.status,
    },
  ],
  history: ['Bestellung vorbereitet', order.status],
})

export function ProcurementProvider({ children }) {
  const [detectedNeeds, setDetectedNeeds] = useState(initialNeeds)
  const [rfqDrafts, setRfqDrafts] = useState([])
  const [activeRFQs, setActiveRFQs] = useState(initialActiveRFQs)
  const [selectedNeedForRFQ, setSelectedNeedForRFQ] = useState(null)
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [supplierOffers] = useState(initialSupplierOffers)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [negotiationCase, setNegotiationCase] = useState(null)
  const [negotiationTimeline, setNegotiationTimeline] = useState(initialNegotiationTimeline)
  const [approvalCases, setApprovalCases] = useState(initialApprovalCases)
  const [orders, setOrders] = useState(initialOrders)
  const [suppliers] = useState(initialSuppliers)
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [selectedSuppliersForComparison, setSelectedSuppliersForComparison] = useState([])
  const [selectedSupplierForRFQ, setSelectedSupplierForRFQ] = useState(null)
  const [governanceSettings, setGovernanceSettings] = useState(readSavedGovernanceSettings)
  const [agentAutonomyLevels, setAgentAutonomyLevels] = useState(initialAgentAutonomyLevels)
  const [activityLog, setActivityLog] = useState(initialActivityLog)

  useEffect(() => {
    window.localStorage.setItem('procura-governance-settings', JSON.stringify(governanceSettings))
  }, [governanceSettings])

  const addActivityLog = (message) => {
    setActivityLog((entries) => [message, ...entries].slice(0, 8))
  }

  const prepareNeedForRfq = (need) => {
    setSelectedNeedForRFQ(need)
    setDetectedNeeds((needs) =>
      needs.map((item) =>
        item.id === need.id ? { ...item, status: 'RFQ vorbereitet' } : item,
      ),
    )
  }

  const saveRfqDraft = (formData) => {
    const draft = {
      ...formData,
      id: `DRAFT-${String(rfqDrafts.length + 1).padStart(3, '0')}`,
      status: 'Entwurf',
    }
    setRfqDrafts((drafts) => [draft, ...drafts])
    addActivityLog('RFQ-Entwurf wurde gespeichert')
  }

  const sendRfq = (formData) => {
    const rfq = {
      ...formData,
      id: `RFQ-${1032 + activeRFQs.length}`,
      suppliers: formData.suppliers || '3 Lieferanten',
      status: 'Versendet',
      deadline: formData.deliveryDate || 'Offen',
    }
    setActiveRFQs((rfqs) => [rfq, ...rfqs])
    setSelectedRFQ(rfq)
    setSelectedNeedForRFQ(null)
    addActivityLog('RFQ wurde versendet')
  }

  const startNegotiationForOffer = (offer, rfq = selectedRFQ || demoRFQ) => {
    setSelectedOffer(offer)
    setSelectedRFQ(rfq)
    setNegotiationCase(createNegotiationCase(offer, rfq))
    setNegotiationTimeline([
      `${rfq.id} ausgewählt.`,
      `Initialangebot von ${offer.supplier} über ${offer.priceLabel} erhalten.`,
    ])
    addActivityLog('Angebot wurde ausgewählt')
  }

  const addNegotiationTimelineItem = (item) => {
    setNegotiationTimeline((timeline) => [...timeline, item])
    addActivityLog(item)
  }

  const updateNegotiationCase = (updates) => {
    setNegotiationCase((currentCase) => ({
      ...(currentCase || createNegotiationCase(initialSupplierOffers[0])),
      ...updates,
    }))
  }

  const resolveApproval = (approval, status) => {
    const nextStatus = status === 'approved' ? 'Freigegeben' : 'Abgelehnt'

    setApprovalCases((cases) =>
      cases.map((item) =>
        item.id === approval.id ? { ...item, status: nextStatus } : item,
      ),
    )
    addActivityLog(status === 'approved' ? 'Freigabe wurde erteilt' : 'Freigabe wurde abgelehnt')

    if (status === 'approved') {
      setOrders((currentOrders) => {
        if (currentOrders.some((order) => order.approvalId === approval.id)) {
          return currentOrders
        }

        const createdCount = currentOrders.filter((order) => order.orderId.startsWith('B-NEW-')).length + 1
        return [
          {
            approvalId: approval.id,
            orderId: `B-NEW-${String(createdCount).padStart(3, '0')}`,
            material: approval.relatedMaterial,
            supplier: approval.relatedSupplier,
            price: approval.proposedPrice,
            status: 'Bestellung vorbereitet',
            deliveryDate: 'offen',
            risk: mapApprovalRiskToOrderRisk(approval.riskLevel),
          },
          ...currentOrders,
        ]
      })
    }
  }

  const updateOrderStatus = (orderId, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderId === orderId ? { ...order, status } : order,
      ),
    )
    setSelectedOrder((currentOrder) =>
      currentOrder?.orderId === orderId ? { ...currentOrder, status } : currentOrder,
    )
    addActivityLog(status === 'ERP-Übergabe erfolgt' ? 'Bestellung wurde an das ERP-System übergeben' : `Bestellung wurde auf ${status} gesetzt`)
  }

  const updateGovernanceSetting = (section, key, value) => {
    setGovernanceSettings((settings) => ({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    }))
    addActivityLog('Governance-Einstellung aktualisiert')
  }

  const resetGovernanceSettings = () => {
    setGovernanceSettings(initialGovernanceSettings)
    window.localStorage.removeItem('procura-governance-settings')
    addActivityLog('Governance-Einstellungen wurden zurückgesetzt')
  }

  const updateAgentAutonomyLevel = (agentName, level) => {
    setAgentAutonomyLevels((levels) => ({
      ...levels,
      [agentName]: level,
    }))
    addActivityLog('Agenten-Autonomie wurde aktualisiert')
  }

  const selectSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    addActivityLog(`${supplier.name} wurde als Lieferant ausgewählt`)
  }

  const requestRfqForSupplier = (supplier) => {
    setSelectedSupplierForRFQ(supplier)
    addActivityLog(`${supplier.name} wurde für eine RFQ übernommen`)
  }

  const toggleSupplierComparison = (supplier) => {
    setSelectedSuppliersForComparison((selectedSuppliers) => {
      const isSelected = selectedSuppliers.some((item) => item.id === supplier.id)

      if (isSelected) {
        return selectedSuppliers.filter((item) => item.id !== supplier.id)
      }

      return [...selectedSuppliers, supplier]
    })
  }

  const resolvedApprovals = approvalCases.filter((approval) => approval.status !== 'Offen')
  const procurementCases = [
    ...approvalCases.map(createApprovalCaseDetail),
    ...activeRFQs.map(createRfqCaseDetail),
    ...orders.map(createOrderCaseDetail),
  ]
  const getProcurementCase = (caseId) =>
    procurementCases.find((procurementCase) => procurementCase.id === caseId) || null

  const value = {
    activeRFQs,
    activeRfqs: activeRFQs,
    addNegotiationTimelineItem,
    activityLog,
    agentAutonomyLevels,
    approvalCases,
    detectedNeeds,
    governanceSettings,
    negotiationCase,
    negotiationTimeline,
    orders,
    prepareNeedForRfq,
    procurementCases,
    resolvedApprovals,
    resolveApproval,
    rfqDrafts,
    saveRfqDraft,
    selectedApproval,
    selectedNeed: selectedNeedForRFQ,
    selectedNeedForRFQ,
    selectedOffer,
    selectedOrder,
    selectedSupplier,
    selectedSupplierForRFQ,
    selectedSuppliersForComparison,
    selectedRFQ,
    sendRfq,
    setNegotiationCase,
    setNegotiationTimeline,
    setSelectedApproval,
    setSelectedNeed: setSelectedNeedForRFQ,
    setSelectedNeedForRFQ,
    setSelectedOffer,
    setSelectedOrder,
    setSelectedSupplierForRFQ,
    setSelectedRFQ,
    startNegotiationForOffer,
    suppliers,
    supplierOffers,
    requestRfqForSupplier,
    resetGovernanceSettings,
    selectSupplier,
    toggleSupplierComparison,
    updateAgentAutonomyLevel,
    updateGovernanceSetting,
    updateNegotiationCase,
    updateOrderStatus,
    getProcurementCase,
  }

  return (
    <ProcurementContext.Provider value={value}>
      {children}
    </ProcurementContext.Provider>
  )
}
