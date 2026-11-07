'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { type FormEvent, useState } from 'react'
import DialogWithTitle from '@/components/dialog-with-title'
import FarmInputPermission from '@/enums/permissions/FarmInput'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import formatNumber from '@/utils/format-number'
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'

export default function RefundHeGasSale({
    sale,
    onRefund,
}: {
    sale: ProductSaleORM
    onRefund: () => void
}) {
    const hasPermission = useIsAuthHasPermission()
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState('')
    const [pending, setPending] = useState(false)
    const [errors, setErrors] = useState<LaravelValidationException['errors']>(
        {},
    )
    const equipment =
        sale.business_unit_product_sale?.inventory_item_checkup?.inventory_item

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (pending) return
        if (!reason.trim()) {
            setErrors({ reason: ['Isi alasan refund.'] })
            return
        }
        setPending(true)
        setErrors({})
        axios
            .post(`farm-inputs/he-gas-sales/${sale.uuid}/refund`, {
                reason: reason.trim(),
            })
            .then(() => {
                setOpen(false)
                setReason('')
                onRefund()
            })
            .catch(error => {
                setErrors({ error: ['Refund gagal. Silakan coba lagi.'] })
                handle422(error, setErrors)
            })
            .finally(() => setPending(false))
    }

    const refund = sale.refund_product_sale
    if (refund) {
        const actor = refund.user_activity_logs?.find(
            log => log.action === 'created',
        )?.user
        return (
            <Box sx={{ maxWidth: 320, overflowWrap: 'anywhere' }}>
                <Typography fontWeight={600} variant="body2">
                    Sudah direfund
                </Typography>
                <Typography variant="body2">{refund.note}</Typography>
                <Typography variant="caption">
                    {refund.created_at && toDmy(refund.created_at)}
                    {actor && ` oleh ${actor.name}`}
                </Typography>
            </Box>
        )
    }

    if (
        !sale.can_refund ||
        !hasPermission(FarmInputPermission.REFUND_PRODUCT_SALE)
    )
        return null

    return (
        <>
            <Button
                color="warning"
                onClick={event => {
                    event.stopPropagation()
                    setOpen(true)
                }}
                sx={{ minHeight: 44 }}
                variant="outlined">
                Refund
            </Button>
            <DialogWithTitle
                aria-label={`Refund penjualan ${sale.short_uuid}`}
                disableRestoreFocus={false}
                onClose={() => {
                    if (!pending) setOpen(false)
                }}
                open={open}
                title={`Refund penjualan ${sale.short_uuid}`}>
                <Box
                    aria-label="Konfirmasi refund"
                    component="form"
                    onSubmit={submit}>
                    <Stack spacing={2} sx={{ overflowWrap: 'anywhere', pt: 1 }}>
                        <Box>
                            <Typography fontWeight={600}>
                                {equipment?.code ? `${equipment.code} - ` : ''}
                                {equipment?.name}
                            </Typography>
                            <Typography variant="body2">
                                Tanggal penjualan: {toDmy(sale.at)}
                            </Typography>
                            {sale.product_movement_details.map(detail => (
                                <Typography key={detail.id} variant="body2">
                                    {detail.product_state.name}:{' '}
                                    {formatNumber(-detail.qty)}{' '}
                                    {detail.product_state.unit}
                                </Typography>
                            ))}
                            <Typography variant="body2">
                                {sale.transaction
                                    ? `Sudah dibayar: ${numberToCurrency(Math.abs(sale.transaction.amount))}`
                                    : 'Belum dibayar'}
                            </Typography>
                        </Box>
                        <Alert role="note" severity="warning">
                            Seluruh stok dikembalikan dan catatan H.M terkait
                            dibatalkan.
                            {sale.transaction &&
                                ' Pembayaran Alat Berat dan SAPRODI dibalik.'}{' '}
                            Refund tidak dapat dibatalkan dan hanya berlaku pada
                            bulan penjualan yang sama.
                        </Alert>
                        <TextField
                            autoFocus
                            disabled={pending}
                            error={Boolean(errors.reason)}
                            fullWidth
                            helperText={errors.reason?.[0]}
                            label="Alasan refund"
                            minRows={2}
                            multiline
                            onChange={event => setReason(event.target.value)}
                            required
                            slotProps={{ htmlInput: { maxLength: 1000 } }}
                            value={reason}
                        />
                        {errors.error && (
                            <Alert severity="error">{errors.error[0]}</Alert>
                        )}
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={1}>
                            <Button
                                disabled={pending}
                                onClick={() => setOpen(false)}
                                sx={{ minHeight: 44 }}>
                                Kembali
                            </Button>
                            <Button
                                color="warning"
                                loading={pending}
                                sx={{ minHeight: 44 }}
                                type="submit"
                                variant="contained">
                                Refund penjualan
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </DialogWithTitle>
        </>
    )
}
