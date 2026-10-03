'use client'

import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { AxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import ConfirmationDialog from '@/components/confirmation-dialog'
import Role from '@/enums/role'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import myAxios from '@/lib/axios'

export type DeleteRepairShopRecordButtonProps = {
    recordUuid: string
    kind: 'sale' | 'purchase'
    disabled: boolean
    onDeleted: () => void
    onDeletingChange?: (deleting: boolean) => void
}

export default function DeleteRepairShopRecordButton({
    recordUuid,
    kind,
    disabled,
    onDeleted,
    onDeletingChange,
}: DeleteRepairShopRecordButtonProps) {
    const hasRole = useIsAuthHasRole()
    const { mutate } = useSWRConfig()
    const [open, setOpen] = useState(false)
    const [code, setCode] = useState('')
    const [reason, setReason] = useState('')
    const [message, setMessage] = useState<string>()
    const [loading, setLoading] = useState(false)
    const inFlight = useRef(false)
    const recordCode = recordUuid.slice(-7).toUpperCase()
    const isSale = kind === 'sale'
    const recordName = isSale ? 'Penjualan' : 'Pembelian'
    if (!hasRole(Role.SUPERMAN)) return null

    async function remove() {
        if (
            disabled ||
            inFlight.current ||
            code !== recordCode ||
            !reason.trim() ||
            reason.length > 1000
        )
            return
        inFlight.current = true
        setLoading(true)
        onDeletingChange?.(true)
        setMessage(undefined)
        try {
            try {
                await myAxios.delete(
                    isSale
                        ? `repair-shop/sales/${recordUuid}/permanent`
                        : `repair-shop/spare-parts/purchases/${recordUuid}/permanent`,
                    { data: { reason: reason.trim() } },
                )
            } catch (error) {
                if ((error as AxiosError).response?.status !== 404) throw error
            }
            onDeleted()
            void mutate(key => {
                const path = Array.isArray(key) ? key[0] : key
                if (typeof path !== 'string') return false
                return /^(repair-shop|receivables|transactions|cashes|business-unit-cashes)(\/|$)/.test(
                    path.replace(/^\//, ''),
                )
            }).catch(() => undefined)
        } catch (error) {
            const failure = error as AxiosError<{
                message?: string
                errors?: Record<string, string[]>
            }>
            setMessage(
                Object.values(failure.response?.data?.errors ?? {})
                    .flat()
                    .join(' ') ||
                    failure.response?.data?.message ||
                    'Hasil penghapusan belum dapat dipastikan. Periksa koneksi lalu coba lagi.',
            )
        } finally {
            inFlight.current = false
            setLoading(false)
            onDeletingChange?.(false)
        }
    }

    return (
        <>
            <Button
                color="error"
                disabled={disabled}
                onClick={() => setOpen(true)}
                size="small"
                startIcon={<DeleteIcon />}
                variant="outlined">
                Hapus Permanen
            </Button>
            <ConfirmationDialog
                cancelButtonProps={{ disabled: loading }}
                color="error"
                confirmButtonProps={{
                    disabled:
                        disabled ||
                        code !== recordCode ||
                        !reason.trim() ||
                        reason.length > 1000,
                }}
                loading={loading}
                onCancel={() => {
                    if (!inFlight.current) setOpen(false)
                }}
                onClose={() => {
                    if (!inFlight.current) setOpen(false)
                }}
                onConfirm={remove}
                open={open}
                title={`Hapus ${recordName} ${recordCode}`}>
                <Stack spacing={2}>
                    <Alert severity="warning">
                        {isSale
                            ? 'Penjualan, pembayaran, angsuran, dan retur terkait akan dihapus. Stok dan saldo akan disesuaikan.'
                            : 'Pembelian dan pembayaran terkait akan dihapus. Stok, harga dasar, saldo kas, dan saldo unit bisnis akan disesuaikan.'}{' '}
                        Tindakan ini tidak dapat dibatalkan.
                    </Alert>
                    <TextField
                        disabled={loading}
                        helperText={`Ketik ${recordCode} untuk mengonfirmasi.`}
                        label={`Kode ${recordName.toLowerCase()}`}
                        onChange={event => setCode(event.target.value)}
                        value={code}
                    />
                    <TextField
                        disabled={loading}
                        label="Alasan penghapusan"
                        minRows={2}
                        multiline
                        onChange={event => setReason(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 1000 } }}
                        value={reason}
                    />
                    {message && <Alert severity="error">{message}</Alert>}
                </Stack>
            </ConfirmationDialog>
        </>
    )
}
