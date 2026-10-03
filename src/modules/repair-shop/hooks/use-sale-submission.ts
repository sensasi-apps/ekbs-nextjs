'use client'

import type { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import myAxios from '@/lib/axios'
import type SaleFormValues from '../types/sale-form-values'

interface SaleSubmission {
    key: string
    method: 'POST' | 'PUT'
    path: string
    expiresAt: number
    values: SaleFormValues
}

export default function useSaleSubmission(
    userUuid?: string,
    saleUuid?: string,
) {
    const path = saleUuid
        ? 'repair-shop/sales/' + saleUuid
        : 'repair-shop/sales'
    const method = saleUuid ? 'PUT' : 'POST'
    const storageKey = userUuid
        ? 'repair-shop:sale-submission:' +
          userUuid +
          ':' +
          (saleUuid ?? 'create')
        : undefined
    const [pending, setPending] = useState<SaleSubmission | null>(null)
    const [ready, setReady] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState<string>()
    const pendingRef = useRef<SaleSubmission | null>(null)
    const inFlight = useRef(false)
    const scope = useRef(storageKey)

    useEffect(() => {
        scope.current = storageKey
        pendingRef.current = null
        setPending(null)
        setBlocked(false)
        setMessage(undefined)
        if (storageKey) {
            try {
                const saved = sessionStorage.getItem(storageKey)
                if (saved) {
                    const attempt: SaleSubmission = JSON.parse(saved)
                    if (
                        typeof attempt.key !== 'string' ||
                        typeof attempt.expiresAt !== 'number' ||
                        attempt.path !== path ||
                        attempt.method !== method ||
                        !Array.isArray(attempt.values?.services) ||
                        !Array.isArray(attempt.values?.spare_parts)
                    )
                        throw new Error('Invalid pending submission')
                    pendingRef.current = attempt
                    setPending(attempt)
                    if (attempt.expiresAt <= Date.now()) {
                        setBlocked(true)
                        setMessage(
                            'Pengiriman sudah melewati batas 24 jam. Periksa riwayat penjualan sebelum membuat pengiriman baru.',
                        )
                    }
                }
            } catch {
                setBlocked(true)
                setMessage(
                    'Data pengiriman belum dapat dipulihkan. Pastikan penyimpanan tab peramban tersedia sebelum melanjutkan.',
                )
            }
        }
        setReady(true)
    }, [storageKey, path, method])

    function clearAttempt() {
        if (storageKey) {
            try {
                sessionStorage.removeItem(storageKey)
            } catch {
                // Retaining the original attempt is safer than replacing its key.
            }
        }
        if (scope.current === storageKey) {
            pendingRef.current = null
            setPending(null)
            setMessage(undefined)
        }
    }

    async function send(values?: SaleFormValues): Promise<boolean> {
        if (inFlight.current || !ready || blocked) return false
        if (!storageKey) {
            setMessage(
                'Sesi pengguna belum tersedia. Masuk kembali sebelum menyimpan penjualan.',
            )
            return false
        }
        const attempt: SaleSubmission | null =
            pendingRef.current ??
            (values
                ? {
                      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                      key: crypto.randomUUID(),
                      method,
                      path,
                      values: JSON.parse(
                          JSON.stringify(values),
                      ) as SaleFormValues,
                  }
                : null)
        if (!attempt) return false
        if (attempt.expiresAt <= Date.now()) {
            setBlocked(true)
            setMessage(
                'Pengiriman sudah melewati batas 24 jam. Periksa riwayat penjualan sebelum membuat pengiriman baru.',
            )
            return false
        }
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(attempt))
        } catch {
            setBlocked(true)
            setMessage(
                'Pengiriman belum dimulai karena penyimpanan tab tidak tersedia. Aktifkan penyimpanan peramban sebelum mencoba lagi.',
            )
            return false
        }
        pendingRef.current = attempt
        setPending(attempt)
        inFlight.current = true
        setSending(true)
        setMessage(undefined)
        try {
            await myAxios.request({
                data: attempt.values,
                headers: { 'Idempotency-Key': attempt.key },
                method: attempt.method,
                url: attempt.path,
            })
            clearAttempt()
            return true
        } catch (error) {
            const failure = error as AxiosError<{
                code?: string
                message?: string
            }>
            if (failure.response?.status === 422) {
                clearAttempt()
                throw error
            }
            if (scope.current === storageKey) {
                setMessage(
                    failure.response?.data?.message ??
                        'Hasil penyimpanan belum dapat dipastikan. Periksa koneksi lalu coba kembali pengiriman yang sama.',
                )
            }
            return false
        } finally {
            inFlight.current = false
            if (scope.current === storageKey) setSending(false)
        }
    }

    return {
        blocked,
        message,
        pending,
        ready,
        retry: () => send(),
        sending,
        submit: (values: SaleFormValues) => send(values),
    }
}
