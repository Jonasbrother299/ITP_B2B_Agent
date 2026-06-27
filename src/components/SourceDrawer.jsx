import { useUi } from '../context/useUi.js'

function SourceDrawer() {
  const { closeSourceDrawer, sourceDrawer } = useUi()

  if (!sourceDrawer.isOpen) {
    return null
  }

  const { source } = sourceDrawer

  return (
    <div className="side-drawer" role="presentation">
      <button className="side-drawer__backdrop" type="button" aria-label="Quelle schließen" onClick={closeSourceDrawer} />
      <aside className="side-drawer__panel" aria-label="Originalquelle">
        <header className="side-drawer__header">
          <div>
            <span>{source.type}</span>
            <h2>{source.title}</h2>
          </div>
          <button className="btn btn--ghost btn--small" type="button" onClick={closeSourceDrawer}>×</button>
        </header>
        <section className="side-drawer__context">
          <h3>Originalquelle</h3>
          <p>{source.content}</p>
        </section>
        <div className="source-preview">
          <span>Vorschau</span>
          <p>{source.preview || 'Im Prototyp wird hier die Originalquelle aus ERP, Lieferantenhistorie oder Dokumenten angezeigt.'}</p>
        </div>
      </aside>
    </div>
  )
}

export default SourceDrawer
