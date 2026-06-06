import { useContext } from 'react'
import { ProcurementContext } from './procurementContext.js'

export function useProcurement() {
  const context = useContext(ProcurementContext)

  if (!context) {
    throw new Error('useProcurement must be used inside ProcurementProvider')
  }

  return context
}
