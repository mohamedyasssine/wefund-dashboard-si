/**
 * Adaptateur mock pour le port KpiDataService.
 * Délègue aux fonctions du module de données mockées (POC).
 */

import type { KpiDataService } from '@/domain/ports/KpiDataService'
import { fetchKpiData, fetchKpiMetadata } from '@/lib/data/mock'

export const mockKpiDataAdapter: KpiDataService = {
  getKpiData: (kpiId, period) => fetchKpiData(kpiId, period),
  getKpiMetadata: () => fetchKpiMetadata(),
}
