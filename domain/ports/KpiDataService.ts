import type { KpiId, KpiMetadata, Period, KpiData } from '@/domain/kpi'

export interface KpiDataService {
  getKpiData(kpiId: KpiId, period: Period): Promise<KpiData>
  getKpiMetadata(): Promise<KpiMetadata[]>
}
