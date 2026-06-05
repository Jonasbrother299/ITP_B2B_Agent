export const pageContent = {
  bedarfserkennung: {
    title: 'Bedarfserkennung',
    description:
      'Automatische Erkennung von Beschaffungsbedarfen aus Bestandsdaten, Planung, offenen Bestellungen und Prognosen.',
    cards: [
      { title: 'Erkannte Bedarfe', value: '18', text: 'Aus ERP, Planung und Forecasts konsolidiert.' },
      { title: 'Kritische Lagerbestände', value: '5', text: 'Materialien unter Mindestbestand.' },
      { title: 'Prognosebasierte Vorschläge', value: '9', text: 'KI-gestützte Nachbestellungen vorbereitet.' },
    ],
    table: {
      title: 'Erkannte Bedarfe',
      columns: ['Material', 'Aktueller Bestand', 'Mindestbestand', 'Prognose', 'Priorität', 'Vorschlag', 'Aktion'],
      rows: [
        ['Stahlrohre 40×40mm', '220 Stk.', '500 Stk.', 'Bedarf in 9 Tagen', { label: 'hoch', tone: 'risk' }, 'RFQ für 800 Stk.', { label: 'RFQ erstellen', path: '/rfqs' }],
        ['Sensor X-200', '48 Stk.', '120 Stk.', 'Bedarf in 14 Tagen', { label: 'mittel', tone: 'warning' }, 'Lieferanten prüfen', { label: 'RFQ erstellen', path: '/rfqs' }],
        ['Schmierstoff Klasse 3', '18 Kanister', '40 Kanister', 'Bedarf in 21 Tagen', { label: 'niedrig', tone: 'active' }, 'Rahmenvertrag nutzen', { label: 'RFQ erstellen', path: '/rfqs' }],
      ],
    },
  },
  lieferantensuche: {
    title: 'Lieferantensuche',
    description:
      'Identifikation geeigneter Lieferanten anhand von Bedarf, Marktinformationen, Vertragsdaten und Risikobewertungen.',
    cards: [
      { title: 'Neue Lieferanten gefunden', value: '12', text: 'Aus Marktquellen und Datenbanken.' },
      { title: 'Bestehende Lieferanten', value: '48', text: 'Mit Vertrags- und Performancehistorie.' },
      { title: 'Lieferanten mit Risiko', value: '3', text: 'Erfordern Prüfung vor RFQ.' },
    ],
    table: {
      title: 'Lieferantenvergleich',
      columns: ['Lieferant', 'Kategorie', 'Preisniveau', 'Lieferzeit', 'Risiko', 'Bewertung', 'Aktion'],
      rows: [
        ['Northline Supply', 'Industriebedarf', 'Niedrig', '9 Tage', { label: 'niedrig', tone: 'active' }, '94/100', [{ label: 'Angebot anfragen', path: '/rfqs' }, { label: 'Vergleichen', path: '/angebotsvergleich' }]],
        ['Müller Industriebedarf', 'Metallteile', 'Mittel', '12 Tage', { label: 'mittel', tone: 'warning' }, '87/100', [{ label: 'Angebot anfragen', path: '/rfqs' }, { label: 'Vergleichen', path: '/angebotsvergleich' }]],
        ['SensorTech AG', 'Elektronik', 'Hoch', '7 Tage', { label: 'niedrig', tone: 'active' }, '91/100', [{ label: 'Angebot anfragen', path: '/rfqs' }, { label: 'Vergleichen', path: '/angebotsvergleich' }]],
      ],
    },
  },
  rfqs: {
    title: 'RFQs',
    description:
      'Automatisierte Erstellung und Verwaltung von Angebotsanfragen an geeignete Lieferanten.',
    cards: [
      { title: 'RFQ-Entwürfe', value: '4', text: 'Bereit zur Prüfung.' },
      { title: 'Versendete RFQs', value: '12', text: 'Diese Woche automatisiert.' },
      { title: 'Antworten im Eingang', value: '7', text: 'Für Vergleich verfügbar.' },
    ],
    form: {
      title: 'Neue RFQ erstellen',
      fields: ['Material / Produkt', 'Menge', 'Gewünschter Liefertermin', 'Lieferanten auswählen', 'Anfragetext'],
      actions: ['Entwurf speichern', 'RFQ versenden'],
    },
    table: {
      title: 'Aktive RFQs',
      columns: ['RFQ-ID', 'Material', 'Lieferanten', 'Status', 'Frist', 'Aktion'],
      rows: [
        ['RFQ-1024', 'Stahlrohre 40×40mm', '3 Lieferanten', { label: 'Angebote eingegangen', tone: 'active' }, 'Heute', { label: 'Angebote prüfen', path: '/angebotsvergleich' }],
        ['RFQ-1028', 'Sensor X-200', '5 Lieferanten', { label: 'Versendet', tone: 'blue' }, '2 Tage', { label: 'Angebote prüfen', path: '/angebotsvergleich' }],
        ['RFQ-1031', 'Hydraulikpumpen HY-40', '2 Lieferanten', { label: 'Entwurf', tone: 'neutral' }, '5 Tage', { label: 'Angebote prüfen', path: '/angebotsvergleich' }],
      ],
    },
  },
  angebotsvergleich: {
    title: 'Angebotsvergleich',
    description:
      'Vergleich eingegangener Angebote nach Preis, Lieferzeit, Konditionen, Risiko und Lieferantenperformance.',
    offerCards: [
      { supplier: 'Northline Supply', price: '45.200 €', delivery: '9 Tage', risk: 'Niedrig', quality: '94/100', terms: '30 Tage netto', badge: 'KI-Empfehlung', tone: 'active' },
      { supplier: 'Müller Industriebedarf', price: '48.100 €', delivery: '12 Tage', risk: 'Mittel', quality: '88/100', terms: '14 Tage netto', badge: 'Solide Option', tone: 'blue' },
      { supplier: 'SensorTech AG', price: '51.700 €', delivery: '7 Tage', risk: 'Niedrig', quality: '91/100', terms: 'Vorkasse', badge: 'Schnellste Lieferung', tone: 'warning' },
    ],
    comparisonBars: [
      { label: 'Preisvergleich', values: [72, 82, 92], tones: ['active', 'blue', 'warning'] },
      { label: 'Lieferzeitvergleich', values: [64, 78, 48], tones: ['active', 'blue', 'warning'] },
      { label: 'Risikoindikator', values: [28, 52, 34], tones: ['active', 'warning', 'blue'] },
    ],
    recommendation:
      'Die KI empfiehlt Northline Supply, da der Preis 6 % unter dem aktuellen Lieferanten liegt und die Lieferzeit stabil ist.',
    actions: [
      { label: 'Verhandlung starten', path: '/verhandlungen' },
      { label: 'Zur Freigabe senden', path: '/freigaben' },
    ],
  },
  verhandlungen: {
    title: 'Verhandlungen',
    description:
      'Überwachung automatisierter Preisverhandlungen innerhalb definierter Parameter.',
    cards: [
      { title: 'Aktive Verhandlungen', value: '6', text: 'Durch Agenten gesteuert.' },
      { title: 'Durchschnittliche Einsparung', value: '4,8 %', text: 'Über laufende Vorgänge.' },
      { title: 'Eskalationen', value: '2', text: 'Außerhalb definierter Grenzen.' },
    ],
    timeline: [
      'RFQ-1024: Initialangebot erhalten',
      'Negotiation Agent: Gegenangebot gesendet',
      'Lieferant: Rabatt von 4 % angeboten',
      'System: Verhandlung innerhalb ±10 % Spielraum',
    ],
    parameterCard: {
      title: 'Verhandlungsparameter',
      items: ['Preis-Spielraum ±10 %', 'Maximale Laufzeit 48h', 'Eskalation bei Vertragsänderung'],
    },
    actions: [
      { label: 'Freigabe prüfen', path: '/freigaben' },
      { label: 'Angebote vergleichen', path: '/angebotsvergleich' },
    ],
  },
  freigaben: {
    title: 'Freigaben',
    description:
      'Kritische oder komplexe Entscheidungen werden zur menschlichen Prüfung weitergeleitet.',
    approvals: [
      { title: 'Preisabweichung über 10 %', reason: 'Angebot liegt 12,4 % über Zielpreis.', risk: 'Hoch', recommendation: 'Preis neu verhandeln oder Alternativlieferant prüfen.', source: 'RFQ-1024 · Angebotsdaten' },
      { title: 'Neuer Lieferant erkannt', reason: 'Zertifikate und Bonitätsdaten sind unvollständig.', risk: 'Mittel', recommendation: 'Lieferant erst nach Compliance-Prüfung freigeben.', source: 'Lieferantendatenbank' },
      { title: 'Vertragsänderung außerhalb Standardbedingungen', reason: 'Zahlungsziel wurde auf 90 Tage angepasst.', risk: 'Mittel', recommendation: 'Einkaufsleiter entscheidet.', source: 'DocuSign Vertrag' },
      { title: 'Lieferverzug bei kritischem Material', reason: 'Produktionslinie wäre ab KW 48 betroffen.', risk: 'Hoch', recommendation: 'Alternativlieferant aktivieren.', source: 'ERP & Lieferstatus' },
    ],
    infoBox: {
      title: 'Warum wurde eskaliert?',
      text: 'Human-in-the-Loop wird ausgelöst, wenn Preisgrenzen, Risikoschwellen, Vertragsregeln oder Lieferkritikalität außerhalb der definierten Governance liegen.',
    },
  },
  bestellungen: {
    title: 'Bestellungen',
    description:
      'Übersicht über erstellte Bestellungen, ERP-Übergaben und laufende Auftragsabwicklung.',
    cards: [
      { title: 'Offene Bestellungen', value: '31', text: 'In laufender Abwicklung.' },
      { title: 'Wartet auf Lieferbestätigung', value: '8', text: 'Rückmeldung vom Lieferanten offen.' },
      { title: 'Verzögerungsrisiken', value: '3', text: 'Mögliche Lieferabweichungen.' },
    ],
    table: {
      title: 'Bestellübersicht',
      columns: ['Bestellung', 'Material', 'Lieferant', 'Status', 'Liefertermin', 'Risiko', 'Aktion'],
      rows: [
        ['B-10241', 'Stahlrohre 40×40mm', 'Northline Supply', { label: 'Bestellung erstellt', tone: 'active' }, '18.07.', { label: 'niedrig', tone: 'active' }, { label: 'Lieferstatus prüfen', path: '/bestellungen' }],
        ['B-10238', 'Sensor X-200', 'SensorTech AG', { label: 'ERP-Übergabe erfolgt', tone: 'blue' }, '22.07.', { label: 'mittel', tone: 'warning' }, { label: 'Lieferstatus prüfen', path: '/bestellungen' }],
        ['B-10235', 'Verpackungsmaterial Typ B', 'PackPro AG', { label: 'Lieferbestätigung offen', tone: 'warning' }, '25.07.', { label: 'mittel', tone: 'warning' }, { label: 'Lieferstatus prüfen', path: '/bestellungen' }],
        ['B-10231', 'Hydraulikpumpen HY-40', 'HydroTech GmbH', { label: 'Lieferverzug möglich', tone: 'risk' }, '29.07.', { label: 'hoch', tone: 'risk' }, { label: 'Lieferstatus prüfen', path: '/bestellungen' }],
      ],
    },
  },
  reporting: {
    title: 'Reporting',
    description:
      'Visualisierung von Einkaufskennzahlen, Einsparpotenzialen, Risiken und Lieferantenperformance.',
    cards: [
      { title: 'Einsparpotenzial', value: '8,4 %', text: 'Gegenüber aktuellem Lieferantenmix.' },
      { title: 'Durchschnittliche Lieferzeit', value: '11 Tage', text: 'Über aktive Beschaffungsvorgänge.' },
      { title: 'Automatisierungsquote', value: '72 %', text: 'Ohne manuelle Eingriffe.' },
      { title: 'Risikoquote', value: '14 %', text: 'Vorgänge mit erhöhtem Risiko.' },
    ],
    charts: {
      savings: [34, 48, 42, 62, 74, 68],
      rfqStatus: [
        { label: 'Entwurf', value: 28, tone: 'blue' },
        { label: 'Versendet', value: 52, tone: 'purple' },
        { label: 'Bewertet', value: 74, tone: 'active' },
      ],
      supplierRisks: [
        { label: 'Niedrig', value: 64, tone: 'active' },
        { label: 'Mittel', value: 31, tone: 'warning' },
        { label: 'Hoch', value: 12, tone: 'risk' },
      ],
      performance: [
        { label: 'Qualität', value: 88, tone: 'active' },
        { label: 'Termintreue', value: 76, tone: 'blue' },
        { label: 'Preisniveau', value: 69, tone: 'purple' },
      ],
    },
    reportCard: {
      title: 'Monatsreport generieren',
      text: 'Fasst Einsparungen, Risiken, RFQ-Status und Agentenleistung in einem Management-Report zusammen.',
      action: 'Report exportieren',
    },
  },
  regelnGovernance: {
    title: 'Regeln & Governance',
    description:
      'Konfiguration von Einkaufsregeln, Freigabegrenzen, Compliance-Prüfungen und Agenten-Leitplanken.',
    cards: ['Einkaufsregeln', 'Freigabegrenzen', 'Compliance-Prüfungen'],
  },
}
