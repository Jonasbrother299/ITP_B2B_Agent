import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

const actionMenuEvent = 'procura-action-menu-open'
const menuGap = 8
const menuWidth = 196

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function ActionMenu({ actions, id, label = 'Aktionen' }) {
  const generatedId = useId()
  const menuId = id || generatedId
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current

    if (!trigger) {
      return
    }

    const rect = trigger.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight || actions.length * 38 + 12
    const availableBelow = window.innerHeight - rect.bottom
    const opensUp = availableBelow < menuHeight + menuGap && rect.top > menuHeight
    const top = opensUp
      ? Math.max(menuGap, rect.top - menuHeight - menuGap)
      : Math.min(rect.bottom + menuGap, window.innerHeight - menuHeight - menuGap)
    const left = clamp(rect.right - menuWidth, menuGap, window.innerWidth - menuWidth - menuGap)

    setPosition({ left, top })
  }, [actions.length])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    updatePosition()
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleGlobalOpen = (event) => {
      if (event.detail !== menuId) {
        setIsOpen(false)
      }
    }

    const handlePointerDown = (event) => {
      const target = event.target

      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener(actionMenuEvent, handleGlobalOpen)
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener(actionMenuEvent, handleGlobalOpen)
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, menuId, updatePosition])

  const toggleMenu = () => {
    setIsOpen((open) => {
      const nextOpen = !open

      if (nextOpen) {
        window.dispatchEvent(new CustomEvent(actionMenuEvent, { detail: menuId }))
      }

      return nextOpen
    })
  }

  const closeMenu = () => setIsOpen(false)

  const menu = (
    <div
      className="action-menu__list"
      ref={menuRef}
      role="menu"
      style={{ left: `${position.left}px`, top: `${position.top}px` }}
    >
      {actions.map((action) => (
        action.to && !action.disabled ? (
          <Link
            className="action-menu__item"
            key={action.label}
            role="menuitem"
            to={action.to}
            onClick={closeMenu}
          >
            {action.label}
          </Link>
        ) : (
          <button
            className="action-menu__item"
            disabled={action.disabled}
            key={action.label}
            role="menuitem"
            type="button"
            onClick={() => {
              action.onClick?.()
              closeMenu()
            }}
          >
            {action.label}
          </button>
        )
      ))}
    </div>
  )

  return (
    <div className="action-menu">
      <button
        aria-expanded={isOpen}
        aria-label={label}
        className="btn btn--ghost btn--small action-menu__trigger"
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
      >
        ⋯
      </button>
      {isOpen && createPortal(menu, document.body)}
    </div>
  )
}

export default ActionMenu
