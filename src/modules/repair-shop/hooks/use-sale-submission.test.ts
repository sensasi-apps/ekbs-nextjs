import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import myAxios from '@/lib/axios'
import type SaleFormValues from '../types/sale-form-values'
import useSaleSubmission from './use-sale-submission'

vi.mock('@/lib/axios', () => ({ default: { request: vi.fn() } }))

const values: SaleFormValues = {
    at: '2026-10-03',
    is_finished: false,
    services: [{ rp: 50000, service_id: '1' }],
    spare_parts: [],
}
const request = vi.mocked(myAxios.request)

beforeEach(() => {
    sessionStorage.clear()
    request.mockReset()
})

test('retries a lost response with the same key and exact payload', async () => {
    request.mockRejectedValueOnce({ code: 'ERR_NETWORK' })
    const { result } = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    await act(async () => {
        expect(await result.current.submit(values)).toBe(false)
    })
    const first = request.mock.calls[0][0]
    expect(result.current.pending?.values).toEqual(values)
    request.mockResolvedValueOnce({ status: 202 })
    await act(async () => {
        expect(await result.current.retry()).toBe(true)
    })
    expect(request.mock.calls[1][0]).toEqual(first)
    expect(result.current.pending).toBeNull()
    expect(sessionStorage.length).toBe(0)
})

test('restores the pending update after remount and retains its original request', async () => {
    request.mockRejectedValueOnce({ response: { status: 500 } })
    const firstHook = renderHook(() => useSaleSubmission('actor', 'sale'))
    await waitFor(() => expect(firstHook.result.current.ready).toBe(true))
    await act(async () => {
        await firstHook.result.current.submit(values)
    })
    const original = request.mock.calls[0][0]
    firstHook.unmount()
    const restored = renderHook(() => useSaleSubmission('actor', 'sale'))
    await waitFor(() =>
        expect(restored.result.current.pending?.values).toEqual(values),
    )
    request.mockResolvedValueOnce({ status: 202 })
    await act(async () => {
        await restored.result.current.retry()
    })
    expect(request.mock.calls[1][0]).toEqual(original)
    expect(original?.method).toBe('PUT')
})

test('blocks overlapping calls before React updates the loading state', async () => {
    let resolve: (value: unknown) => void = () => {}
    request.mockImplementationOnce(
        () =>
            new Promise(done => {
                resolve = done
            }),
    )
    const { result } = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    await act(async () => {
        const first = result.current.submit(values)
        expect(await result.current.submit(values)).toBe(false)
        expect(request).toHaveBeenCalledTimes(1)
        resolve({ status: 202 })
        expect(await first).toBe(true)
    })
})

test('unlocks a validation failure and assigns a fresh key to corrected data', async () => {
    request.mockRejectedValueOnce({
        response: { data: { errors: { at: ['Invalid'] } }, status: 422 },
    })
    const { result } = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    await act(async () => {
        await expect(result.current.submit(values)).rejects.toMatchObject({
            response: { status: 422 },
        })
    })
    expect(result.current.pending).toBeNull()
    request.mockResolvedValueOnce({ status: 202 })
    await act(async () => {
        await result.current.submit({ ...values, at: '2026-10-04' })
    })
    expect(request.mock.calls[1][0]?.headers).not.toEqual(
        request.mock.calls[0][0]?.headers,
    )
})

test('retains an unresolved conflict and isolates another account', async () => {
    request.mockRejectedValueOnce({
        response: { data: { code: 'submission_key_reused' }, status: 409 },
    })
    const first = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    await act(async () => {
        await first.result.current.submit(values)
    })
    expect(first.result.current.pending).not.toBeNull()
    const other = renderHook(() => useSaleSubmission('another-actor'))
    await waitFor(() => expect(other.result.current.ready).toBe(true))
    expect(other.result.current.pending).toBeNull()
})

test('blocks an expired pending attempt instead of submitting a new sale', async () => {
    sessionStorage.setItem(
        'repair-shop:sale-submission:actor:create',
        JSON.stringify({
            expiresAt: Date.now() - 1,
            key: crypto.randomUUID(),
            method: 'POST',
            path: 'repair-shop/sales',
            values,
        }),
    )
    const { result } = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.blocked).toBe(true)
    await act(async () => {
        expect(await result.current.retry()).toBe(false)
        expect(await result.current.submit(values)).toBe(false)
    })
    expect(request).not.toHaveBeenCalled()
    expect(result.current.pending?.values).toEqual(values)
})

test('does not submit if the pending request cannot be saved for recovery', async () => {
    const { result } = renderHook(() => useSaleSubmission('actor'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    vi.stubGlobal('sessionStorage', {
        setItem: vi.fn(() => {
            throw new Error('Storage unavailable')
        }),
    })
    try {
        await act(async () => {
            expect(await result.current.submit(values)).toBe(false)
        })
        expect(request).not.toHaveBeenCalled()
        expect(result.current.blocked).toBe(true)
    } finally {
        vi.unstubAllGlobals()
    }
})
