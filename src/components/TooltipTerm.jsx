function TooltipTerm({ children, icon = false, label }) {
  return (
    <span className={icon ? 'tooltip-term tooltip-term--icon' : 'tooltip-term'} tabIndex="0" aria-label={label}>
      {icon ? <span className="tooltip-term__icon" aria-hidden="true">i</span> : children}
      <span className="tooltip-term__bubble" role="tooltip">
        {label}
      </span>
    </span>
  )
}

export default TooltipTerm
