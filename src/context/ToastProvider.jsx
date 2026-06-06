import { useCallback, useRef, useState } from 'react'
import { ToastContext } from './toastContext.js'

function createToastId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, tone = 'success') => {
    const id = createToastId()
    let shouldScheduleNewTimer = true

    setToasts((currentToasts) => {
      const existingToast = currentToasts.find((toast) => toast.message === message && toast.tone === tone)

      if (existingToast) {
        shouldScheduleNewTimer = false
        window.clearTimeout(timers.current.get(existingToast.id))
        timers.current.set(existingToast.id, window.setTimeout(() => dismissToast(existingToast.id), 3000))
        return currentToasts
      }

      const nextToasts = [...currentToasts, { id, message, tone }]
      const visibleToasts = nextToasts.slice(-3)
      const hiddenToasts = nextToasts.slice(0, Math.max(nextToasts.length - 3, 0))

      hiddenToasts.forEach((toast) => {
        window.clearTimeout(timers.current.get(toast.id))
        timers.current.delete(toast.id)
      })

      return visibleToasts
    })

    if (shouldScheduleNewTimer) {
      const timeout = window.setTimeout(() => dismissToast(id), 3000)
      timers.current.set(id, timeout)
    }
  }, [dismissToast])

  return (
    <ToastContext.Provider value={{ dismissToast, showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.tone}`} key={toast.id} role="status">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
