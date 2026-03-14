/**
 * Port "récupération des données KPI" (architecture hexagonale).
 * Le dashboard dépend de cette abstraction, pas d'un adaptateur concret.
 */

import type { KpiId, KpiMetadata, Period } from '@/types'
import type { KpiData } from '@/types/kpi'

/**
 * Contrat du service de données KPI.
 * Implémenté par l'adaptateur mock (POC) puis par l'adaptateur API (production).
 */
export interface KpiDataService {
  getKpiData(kpiId: KpiId, period: Period): Promise<KpiData>
  getKpiMetadata(): Promise<KpiMetadata[]>
}
