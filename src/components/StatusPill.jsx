function StatusPill({ children, tone = 'neutral' }) {
  const badgeTone =
    {
      active: 'success',
      risk: 'danger',
      blue: 'info',
    }[tone] ?? tone

  return (
    <span className={`badge badge--${badgeTone} status-pill status-pill--${tone}`}>
      {children}
    </span>
  )
}

export default StatusPill
