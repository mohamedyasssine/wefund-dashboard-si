'use client'

import { useEffect, useState } from 'react'
import type { KpiId, KpiMetadata, Period } from '@/types'
import type {
  KpiChartConfig,
  KpiDashboardDataState,
  KpiData,
} from '@/types/kpi'
import { isLoaded, toKpiLoadError } from '@/types/kpi'
import type { KpiLoadError } from '@/types/kpi'
import { useKpiDataService } from '@/context/KpiDataServiceContext'
import {
  AVAILABLE_PERIODS,
  DEFAULT_KPI_ID,
  DEFAULT_PERIOD,
} from '@/lib/constants/dashboard'
import KpiSelector from '@/components/dashboard/KpiSelector'
import KpiCard from '@/components/ui/KpiCard'
import PeriodSelector from '@/components/ui/PeriodSelector'
import LineKpiChart from '@/components/ui/LineKpiChart'
import BarKpiChart from '@/components/ui/BarKpiChart'
import PieKpiChart from '@/components/ui/PieKpiChart'

type KpiDashboardState = {
  selectedKpiId: KpiId
  period: Period
}

const DEFAULT_CHART_CONFIG: KpiChartConfig = {
  title: 'Indicateur',
  showGrid: true,
}

function getChartConfig(kpiId: KpiId, metadataList: KpiMetadata[]): KpiChartConfig {
  const metadata = metadataList.find((meta) => meta.id === kpiId)

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
  const service = useKpiDataService()

  const [metadata, setMetadata] = useState<KpiMetadata[] | null>(null)
  const [metadataError, setMetadataError] = useState<KpiLoadError | null>(null)
  const [viewState, setViewState] = useState<KpiDashboardState>({
    selectedKpiId: DEFAULT_KPI_ID,
    period: DEFAULT_PERIOD,
  })

  const [dataState, setDataState] = useState<KpiDashboardDataState>({
    status: 'idle',
  })

  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = () => setRetryCount((n) => n + 1)

  useEffect(() => {
    let cancelled = false
    setMetadataError(null)
    service
      .getKpiMetadata()
      .then((list) => {
        if (!cancelled) setMetadata(list)
      })
      .catch((err: unknown) => {
        if (!cancelled) setMetadataError(toKpiLoadError(err))
      })
    return () => {
      cancelled = true
    }
  }, [service, retryCount])

  useEffect(() => {
    let cancelled = false

    const { selectedKpiId, period } = viewState

    setDataState({ status: 'loading' })

    service
      .getKpiData(selectedKpiId, period)
      .then((data) => {
        if (cancelled) return

        setDataState({ status: 'loaded', data })
      })
      .catch((err: unknown) => {
        if (cancelled) return

        setDataState({
          status: 'error',
          error: toKpiLoadError(err),
        })
      })

    return () => {
      cancelled = true
    }
  }, [viewState, service, retryCount])

  const handlePeriodChange = (nextPeriod: Period) => {
    setViewState((current) =>
      current.period === nextPeriod
        ? current
        : { ...current, period: nextPeriod },
    )
  }

  const selectedMetadata = metadata?.find(
    (meta) => meta.id === viewState.selectedKpiId,
  )
  const chartConfig = getChartConfig(
    viewState.selectedKpiId,
    metadata ?? [],
  )

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

  const formatValue = (value: number, unit?: string) => {
    if (unit === '€') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value)
    }

    if (unit === '%') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value / 100)
    }

    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1,
    }).format(value)
  }

  const isLoading = dataState.status === 'loading'

  const renderChart = () => {
    if (dataState.status === 'error') {
      return (
        <div className="kpi-dashboard__error" role="alert">
          <p className="kpi-dashboard__error-icon" aria-hidden="true">⚠️</p>
          <p className="kpi-dashboard__error-message">
            {dataState.error.message}
          </p>
          <p className="kpi-dashboard__error-code">
            Code&nbsp;: {dataState.error.code}
          </p>
          <button
            type="button"
            className="kpi-dashboard__retry-button"
            onClick={handleRetry}
          >
            Réessayer
          </button>
        </div>
      )
    }

    if (!isLoaded(dataState)) {
      return (
        <div
          className="kpi-dashboard__chart-placeholder"
          role="status"
          aria-live="polite"
        >
          <p className="kpi-dashboard__chart-placeholder-text">
            {dataState.status === 'loading'
              ? 'Chargement des données…'
              : 'Sélectionnez un indicateur pour afficher le graphique.'}
          </p>
        </div>
      )
    }

    const { data } = dataState

    if (!selectedMetadata) {
      return null
    }

    if (selectedMetadata.chartType === 'number') {
      return (
        <div className="kpi-dashboard__chart-placeholder">
          <p className="kpi-dashboard__chart-placeholder-text">
            Cet indicateur est affiché sous forme de valeur (pas de graphique).
          </p>
        </div>
      )
    }

    if (!data.timeSeries || data.timeSeries.length === 0) {
      return (
        <div className="kpi-dashboard__chart-placeholder">
          <p className="kpi-dashboard__chart-placeholder-text">
            Aucune donnée disponible sur la période sélectionnée.
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
    <section
      className="page-section kpi-dashboard"
      aria-label="Tableau de bord des indicateurs de performance"
    >
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
          aria-label="Sélection de la période d'affichage"
          availablePeriods={[...AVAILABLE_PERIODS]}
        />
      </header>

      <div className="kpi-dashboard__content">
        <div className="kpi-dashboard__summary">
          {metadataError ? (
            <div className="kpi-dashboard__error kpi-dashboard__error--inline" role="alert">
              <p className="kpi-dashboard__error-message">
                {metadataError.message}
              </p>
              <p className="kpi-dashboard__error-code">
                Code&nbsp;: {metadataError.code}
              </p>
              <button
                type="button"
                className="kpi-dashboard__retry-button"
                onClick={handleRetry}
              >
                Réessayer
              </button>
            </div>
          ) : metadata ? (
            <KpiSelector
              kpis={metadata}
              selectedId={viewState.selectedKpiId}
              onSelect={handleKpiSelect}
            />
          ) : (
            <p className="kpi-dashboard__loading" role="status" aria-live="polite">
              Chargement des indicateurs…
            </p>
          )}

          <KpiCard
            title={selectedMetadata?.title ?? 'Indicateur'}
            value={
              isLoaded(dataState) && dataState.data.value != null
                ? formatValue(dataState.data.value, selectedMetadata?.unit)
                : '—'
            }
            subtitle={selectedMetadata?.description}
          />
        </div>

        {/* Zone live : les technologies d'assistance annoncent les changements */}
        <div
          className="kpi-dashboard__chart"
          role="region"
          aria-label="Graphique de l'indicateur sélectionné"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {renderChart()}
        </div>
      </div>
    </section>
  )
}

