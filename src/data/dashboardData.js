export const navigationItems = [
  { label: 'Command Center', active: true },
  { label: 'Sourcing' },
  { label: 'Approvals' },
  { label: 'Suppliers' },
  { label: 'Contracts' },
  { label: 'Analytics' },
]

export const kpis = [
  {
    label: 'Autonomous requests',
    value: '1,284',
    change: '+18.4%',
    detail: 'Processed this month',
  },
  {
    label: 'Spend under review',
    value: '$4.8M',
    change: '-6.2%',
    detail: 'Awaiting human decision',
  },
  {
    label: 'Cycle time saved',
    value: '312h',
    change: '+41h',
    detail: 'Agent-assisted workflows',
  },
  {
    label: 'Policy match rate',
    value: '94%',
    change: '+3.1%',
    detail: 'Across open requests',
  },
]

export const agents = [
  {
    name: 'Sourcing Scout',
    task: 'Comparing supplier quotes for laptop refresh',
    confidence: '91%',
    status: 'Negotiating',
  },
  {
    name: 'Policy Guard',
    task: 'Checking ERP requests against preferred vendor rules',
    confidence: '97%',
    status: 'Monitoring',
  },
  {
    name: 'Contract Reader',
    task: 'Extracting termination windows from SaaS agreements',
    confidence: '88%',
    status: 'Reviewing',
  },
]

export const decisions = [
  {
    title: 'Approve replacement supplier',
    context: 'Current supplier missed SLA twice for packaging materials.',
    recommendation: 'Switch to Northline Supply with capped expedited freight.',
    risk: 'Medium',
  },
  {
    title: 'Release blocked purchase order',
    context: 'AI detected a budget exception for Q3 field equipment.',
    recommendation: 'Request finance confirmation before releasing PO-8842.',
    risk: 'High',
  },
]

export const procurementProcesses = [
  {
    request: 'Manufacturing laptops',
    owner: 'IT Operations',
    supplier: 'Apex Devices',
    stage: 'Supplier comparison',
    spend: '$186,400',
    eta: '2 days',
  },
  {
    request: 'Facility maintenance',
    owner: 'Workplace',
    supplier: 'UrbanWorks',
    stage: 'Human approval',
    spend: '$42,900',
    eta: 'Today',
  },
  {
    request: 'Cloud observability renewal',
    owner: 'Platform Engineering',
    supplier: 'SignalStack',
    stage: 'Contract analysis',
    spend: '$318,000',
    eta: '5 days',
  },
  {
    request: 'Warehouse scanners',
    owner: 'Logistics',
    supplier: 'Northline Supply',
    stage: 'PO generation',
    spend: '$74,250',
    eta: 'Tomorrow',
  },
]

export const recommendations = [
  'Consolidate three facilities vendors into a regional master agreement to reduce duplicated service fees.',
  'Renegotiate payment terms with Apex Devices before the laptop order is finalized.',
  'Route high-risk SaaS renewals through legal when auto-detected liability caps fall below policy.',
]
