import { useState } from 'react'
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
  const [governanceSettings, setGovernanceSettings] = useState(initialGovernanceSettings)
  const [agentAutonomyLevels, setAgentAutonomyLevels] = useState(initialAgentAutonomyLevels)
  const [activityLog, setActivityLog] = useState(initialActivityLog)

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
    selectSupplier,
    toggleSupplierComparison,
    updateAgentAutonomyLevel,
    updateGovernanceSetting,
    updateNegotiationCase,
    updateOrderStatus,
  }

  return (
    <ProcurementContext.Provider value={value}>
      {children}
    </ProcurementContext.Provider>
  )
}
