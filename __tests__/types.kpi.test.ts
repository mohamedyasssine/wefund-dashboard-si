import { describe, it, expect } from 'vitest'
import { isError, isLoaded, toKpiLoadError, type AsyncResult } from '@/types/kpi'

describe('types/kpi utilities', () => {
  it('isLoaded retourne true uniquement pour status loaded', () => {
    const loadedState: AsyncResult<number> = { status: 'loaded', data: 42 }
    const idleState: AsyncResult<number> = { status: 'idle' }

    expect(isLoaded(loadedState)).toBe(true)
    expect(isLoaded(idleState)).toBe(false)
  })

  it('isError retourne true uniquement pour status error', () => {
    const errorState: AsyncResult<number> = {
      status: 'error',
      error: { message: 'boom', code: 'UNKNOWN' },
    }
    const loadingState: AsyncResult<number> = { status: 'loading' }

    expect(isError(errorState)).toBe(true)
    expect(isError(loadingState)).toBe(false)
  })

  it('toKpiLoadError mappe une erreur reseau', () => {
    const result = toKpiLoadError(new TypeError('fetch failed'))
    expect(result.code).toBe('NETWORK')
  })

  it('toKpiLoadError mappe AbortError en timeout', () => {
    const abortError = new DOMException('aborted', 'AbortError')
    const result = toKpiLoadError(abortError)
    expect(result.code).toBe('TIMEOUT')
  })

  it('toKpiLoadError mappe Error standard en unknown', () => {
    const result = toKpiLoadError(new Error('generic-error'))
    expect(result.code).toBe('UNKNOWN')
    expect(result.message).toBe('generic-error')
  })

  it('toKpiLoadError mappe une valeur inconnue en unknown', () => {
    const result = toKpiLoadError('not-an-error')
    expect(result.code).toBe('UNKNOWN')
    expect(result.message).toBe('Une erreur inattendue est survenue.')
  })
})
