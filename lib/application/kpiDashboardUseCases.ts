import type { KpiId, KpiMetadata, Period } from '@/domain/kpi'
import type { KpiDataService } from '@/domain/ports/KpiDataService'
import type { KpiDashboardDataState } from '@/types/kpi'
import { toKpiLoadError } from '@/types/kpi'

export type LoadKpiDataInput = {
  kpiId: KpiId
  period: Period
}

export interface KpiDashboardUseCases {
  loadMetadata(): Promise<KpiMetadata[]>
  loadKpiData(input: LoadKpiDataInput): Promise<KpiDashboardDataState>
}

export function createKpiDashboardUseCases(
  service: KpiDataService,
): KpiDashboardUseCases {
  return {
    async loadMetadata() {
      return service.getKpiMetadata()
    },

    async loadKpiData({ kpiId, period }) {
      try {
        const data = await service.getKpiData(kpiId, period)
        return { status: 'loaded', data }
      } catch (error: unknown) {
        return {
          status: 'error',
          error: toKpiLoadError(error),
        }
      }
    },
  }
}
