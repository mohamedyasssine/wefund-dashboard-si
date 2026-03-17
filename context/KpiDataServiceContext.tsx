'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { KpiDataService } from '@/domain/ports/KpiDataService'
import { mockKpiDataAdapter } from '@/lib/adapters/mockKpiDataAdapter'

const KpiDataServiceContext = createContext<KpiDataService | null>(null)

type KpiDataServiceProviderProps = {
  children: ReactNode
  service?: KpiDataService
}

export function KpiDataServiceProvider({
  children,
  service = mockKpiDataAdapter,
}: KpiDataServiceProviderProps) {
  const value = useMemo(() => service, [service])

  return (
    <KpiDataServiceContext.Provider value={value}>
      {children}
    </KpiDataServiceContext.Provider>
  )
}

export function useKpiDataService(): KpiDataService {
  const context = useContext(KpiDataServiceContext)

  if (context == null) {
    throw new Error(
      'useKpiDataService doit être utilisé dans un KpiDataServiceProvider',
    )
  }

  return context
}
