import { Link } from 'react-router-dom'
import InfoCard from '../components/cards/InfoCard.jsx'
import StatusPill from '../components/StatusPill.jsx'

function TableCell({ value }) {
  if (Array.isArray(value)) {
    return (
      <div className="inline-actions">
        {value.map((action) => (
          <Link className="btn btn--secondary btn--small table-action" key={action.label} to={action.path}>
            {action.label}
          </Link>
        ))}
      </div>
    )
  }

  if (value?.path) {
    return (
      <Link className="btn btn--secondary btn--small table-action" to={value.path}>
        {value.label}
      </Link>
    )
  }

  if (value?.tone) {
    return <StatusPill tone={value.tone}>{value.label}</StatusPill>
  }

  return value
}

function DataTable({ table }) {
  return (
    <section className="panel basic-page__section">
      <div className="section-header">
        <h2>{table.title}</h2>
        <span>{table.rows.length} Einträge im Prototyp</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={`${table.title}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${table.title}-${index}-${cellIndex}`}>
                    <TableCell value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function RfqForm({ form }) {
  return (
    <section className="panel basic-page__section">
      <div className="section-header">
        <h2>{form.title}</h2>
        <span>Statischer Formular-Prototyp</span>
      </div>
      <form className="prototype-form">
        {form.fields.map((field) => (
          <label className="form-field" key={field}>
            <span className="form-field__label">{field}</span>
            {field === 'Anfragetext' ? (
              <textarea className="form-field__textarea" placeholder={`${field} eingeben`} rows="4" />
            ) : (
              <input className="form-field__input" placeholder={`${field} eingeben`} type="text" />
            )}
          </label>
        ))}
        <div className="prototype-form__actions">
          {form.actions.map((action, index) => (
            <button className={index === 1 ? 'btn btn--primary' : 'btn btn--secondary'} key={action} type="button">
              {action}
            </button>
          ))}
        </div>
      </form>
    </section>
  )
}

function OfferComparison({ page }) {
  return (
    <>
      <section className="basic-page__offer-grid">
        {page.offerCards.map((offer) => (
          <article className="offer-card" key={offer.supplier}>
            <div>
              <h2>{offer.supplier}</h2>
              <StatusPill tone={offer.tone}>{offer.badge}</StatusPill>
            </div>
            <dl>
              <div><dt>Preis</dt><dd>{offer.price}</dd></div>
              <div><dt>Lieferzeit</dt><dd>{offer.delivery}</dd></div>
              <div><dt>Risiko</dt><dd>{offer.risk}</dd></div>
              <div><dt>Qualität</dt><dd>{offer.quality}</dd></div>
              <div><dt>Konditionen</dt><dd>{offer.terms}</dd></div>
            </dl>
          </article>
        ))}
      </section>

      <section className="panel basic-page__section">
        <div className="section-header">
          <h2>Vergleichsindikatoren</h2>
          <span>CSS-basierte Balken ohne Chart-Bibliothek</span>
        </div>
        <div className="comparison-bars">
          {page.comparisonBars.map((group) => (
            <article className="comparison-bar-card" key={group.label}>
              <h3>{group.label}</h3>
              {group.values.map((value, index) => (
                <div className="status-bar" key={`${group.label}-${index}`}>
                  <div>
                    <span>{page.offerCards[index].supplier}</span>
                    <strong>{value}%</strong>
                  </div>
                  <i>
                    <b className={`tone-${group.tones[index]}`} style={{ width: `${value}%` }} />
                  </i>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="recommendation-box">
        <p>{page.recommendation}</p>
        <div>
          {page.actions.map((action) => (
            <Link className="btn btn--primary" key={action.label} to={action.path}>
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function TimelineSection({ page }) {
  return (
    <section className="basic-page__split">
      <div className="panel basic-page__section">
        <div className="section-header">
          <h2>Verhandlungsverlauf</h2>
          <span>Aktivität des Negotiation Agent</span>
        </div>
        <ol className="timeline-list">
          {page.timeline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="panel basic-page__section">
        <div className="section-header">
          <h2>{page.parameterCard.title}</h2>
          <span>Grenzen aus Regeln & Governance</span>
        </div>
        <div className="parameter-list">
          {page.parameterCard.items.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div className="section-actions">
          {page.actions.map((action) => (
            <Link className="btn btn--primary" key={action.label} to={action.path}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ApprovalSection({ page }) {
  return (
    <section className="approval-layout">
      <div className="approval-grid">
        {page.approvals.map((approval) => (
          <article className="approval-card" key={approval.title}>
            <div>
              <h2>{approval.title}</h2>
              <StatusPill tone={approval.risk === 'Hoch' ? 'risk' : 'warning'}>
                Risiko: {approval.risk}
              </StatusPill>
            </div>
            <p>{approval.reason}</p>
            <dl>
              <div><dt>KI-Empfehlung</dt><dd>{approval.recommendation}</dd></div>
              <div><dt>Datenquelle</dt><dd>{approval.source}</dd></div>
            </dl>
            <div className="approval-card__actions">
              <button className="btn btn--success btn--small" type="button">Freigeben</button>
              <button className="btn btn--danger btn--small" type="button">Ablehnen</button>
              <button className="btn btn--ghost btn--small" type="button">Details prüfen</button>
            </div>
          </article>
        ))}
      </div>
      <aside className="info-panel">
        <h2>{page.infoBox.title}</h2>
        <p>{page.infoBox.text}</p>
      </aside>
    </section>
  )
}

function ChartSection({ page }) {
  return (
    <section className="panel chart-section">
      <div className="section-header">
        <h2>Einkaufskennzahlen</h2>
        <span>CSS-basierte Vorschau ohne Chart-Bibliothek</span>
      </div>
      <div className="chart-grid">
        <article className="chart-card">
          <h3>Einsparpotenzial pro Monat</h3>
          <div className="bar-chart" aria-label="Einsparpotenzial pro Monat">
            {page.charts.savings.map((value, index) => (
              <span key={`${value}-${index}`} style={{ height: `${value}%` }} />
            ))}
          </div>
        </article>
        {[
          ['RFQs nach Status', page.charts.rfqStatus],
          ['Lieferantenrisiken', page.charts.supplierRisks],
          ['Lieferantenperformance', page.charts.performance],
        ].map(([title, items]) => (
          <article className="chart-card" key={title}>
            <h3>{title}</h3>
            <div className="status-bars">
              {items.map((item) => (
                <div className="status-bar" key={item.label}>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <i>
                    <b className={`tone-${item.tone}`} style={{ width: `${item.value}%` }} />
                  </i>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BasicPage({ page }) {
  return (
    <section className="basic-page">
      <div className="basic-page__hero">
        <span>ProcureAI Modul</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      {page.cards && (
        <div className={`basic-page__cards ${page.cards.length === 4 ? 'basic-page__cards--four' : ''}`}>
          {page.cards.map((card) => (
            <InfoCard
              key={typeof card === 'string' ? card : card.title}
              title={typeof card === 'string' ? card : card.title}
              text={typeof card === 'string' ? 'Dieser Bereich wird später mit Einkaufsdaten, KI-Signalen und passenden Prozessschritten gefüllt.' : card.text}
              value={typeof card === 'string' ? undefined : card.value}
            />
          ))}
        </div>
      )}

      {page.form && <RfqForm form={page.form} />}
      {page.offerCards && <OfferComparison page={page} />}
      {page.timeline && <TimelineSection page={page} />}
      {page.approvals && <ApprovalSection page={page} />}
      {page.table && <DataTable table={page.table} />}
      {page.charts && <ChartSection page={page} />}
      {page.reportCard && (
        <section className="report-card">
          <div>
            <h2>{page.reportCard.title}</h2>
            <p>{page.reportCard.text}</p>
          </div>
          <button className="btn btn--primary" type="button">
            {page.reportCard.action}
          </button>
        </section>
      )}
    </section>
  )
}

export default BasicPage
