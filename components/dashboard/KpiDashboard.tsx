'use client'

import { useEffect, useState } from 'react'
import type { KpiId, Period } from '@/types'
import type { KpiChartConfig, KpiData } from '@/types/kpi'
import {
  fetchKpiData,
  fetchKpiMetadata,
  KPI_METADATA,
} from '@/lib/data/mock'
import KpiSelector from '@/components/dashboard/KpiSelector'
import KpiCard from '@/components/ui/KpiCard'
import PeriodSelector from '@/components/ui/PeriodSelector'
import LineKpiChart from '@/components/ui/LineKpiChart'
import BarKpiChart from '@/components/ui/BarKpiChart'
import PieKpiChart from '@/components/ui/PieKpiChart'

const DEFAULT_KPI_ID: KpiId = 'active-campaigns'
const DEFAULT_PERIOD: Period = 'month'

type KpiDashboardState = {
  selectedKpiId: KpiId
  period: Period
}

type KpiDashboardDataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: KpiData }
  | { status: 'error'; message: string }

const DEFAULT_CHART_CONFIG: KpiChartConfig = {
  title: 'Indicateur',
  showGrid: true,
}

function getChartConfig(kpiId: KpiId): KpiChartConfig {
  const metadata = KPI_METADATA.find((meta) => meta.id === kpiId)

  if (!metadata) {
    return DEFAULT_CHART_CONFIG
  }

  return {
    ...DEFAULT_CHART_CONFIG,
    title: metadata.title,
    yAxisLabel: metadata.unit,
  }
}

export default function KpiDashboard() {
  const [viewState, setViewState] = useState<KpiDashboardState>({
    selectedKpiId: DEFAULT_KPI_ID,
    period: DEFAULT_PERIOD,
  })

  const [dataState, setDataState] = useState<KpiDashboardDataState>({
    status: 'idle',
  })

  useEffect(() => {
    let cancelled = false

    const { selectedKpiId, period } = viewState

    setDataState({ status: 'loading' })

    fetchKpiData(selectedKpiId, period)
      .then((data) => {
        if (cancelled) return

        setDataState({ status: 'loaded', data })
      })
      .catch(() => {
        if (cancelled) return

        setDataState({
          status: 'error',
          message:
            "Impossible de charger les données pour l'indicateur sélectionné.",
        })
      })

    return () => {
      cancelled = true
    }
  }, [viewState])

  const handlePeriodChange = (nextPeriod: Period) => {
    setViewState((current) =>
      current.period === nextPeriod
        ? current
        : { ...current, period: nextPeriod },
    )
  }

  const selectedMetadata = KPI_METADATA.find(
    (meta) => meta.id === viewState.selectedKpiId,
  )
  const chartConfig = getChartConfig(viewState.selectedKpiId)

  const handleKpiSelect = (nextId: KpiId) => {
    setViewState((current) =>
      current.selectedKpiId === nextId
        ? current
        : {
            ...current,
            selectedKpiId: nextId,
          },
    )
  }

  const renderChart = () => {
    if (dataState.status !== 'loaded') {
      return (
        <div className="kpi-dashboard__chart-placeholder">
          <p className="kpi-dashboard__chart-placeholder-text">
            {dataState.status === 'loading'
              ? 'Chargement des données...'
              : dataState.status === 'error'
                ? dataState.message
                : 'Sélectionnez un indicateur pour afficher le graphique.'}
          </p>
        </div>
      )
    }

    const { data } = dataState

    if (!selectedMetadata) {
      return null
    }

    if (!data.timeSeries || data.timeSeries.length === 0) {
      return (
        <div className="kpi-dashboard__chart-placeholder">
          <p className="kpi-dashboard__chart-placeholder-text">
            Aucune donnée temporelle disponible pour cet indicateur.
          </p>
        </div>
      )
    }

    switch (selectedMetadata.chartType) {
      case 'line':
      case 'area':
        return (
          <LineKpiChart
            data={data.timeSeries}
            config={chartConfig}
            ariaLabel={selectedMetadata.title}
          />
        )

      case 'bar':
        return (
          <BarKpiChart
            data={data.timeSeries}
            config={chartConfig}
            ariaLabel={selectedMetadata.title}
          />
        )

      case 'pie':
        return (
          <PieKpiChart
            data={data.timeSeries.map((point) => ({
              name: point.label ?? point.date,
              value: point.value,
            }))}
            ariaLabel={selectedMetadata.title}
          />
        )

      default:
        return null
    }
  }

  return (
    <section className="page-section kpi-dashboard">
      <header className="kpi-dashboard__header">
        <div>
          <h2 className="page-section__title">Indicateurs de performance</h2>
          <p className="page-section__desc">
            Sélectionnez un indicateur pour visualiser les données.
          </p>
        </div>

        <PeriodSelector
          value={viewState.period}
          onChange={handlePeriodChange}
          aria-label="Sélection de la période"
          availablePeriods={['week', 'month', 'quarter', 'year', 'all']}
        />
      </header>

      <div className="kpi-dashboard__content">
        <div className="kpi-dashboard__summary">
          <KpiSelector
            kpis={KPI_METADATA}
            selectedId={viewState.selectedKpiId}
            onSelect={handleKpiSelect}
          />

          <KpiCard
            title={selectedMetadata?.title ?? 'Indicateur'}
            value={
              dataState.status === 'loaded' && dataState.data.value != null
                ? dataState.data.value.toLocaleString('fr-FR', {
                    maximumFractionDigits: 1,
                  })
                : '—'
            }
            subtitle={selectedMetadata?.description}
          />
        </div>

        <div className="kpi-dashboard__chart">{renderChart()}</div>
      </div>
    </section>
  )
}

