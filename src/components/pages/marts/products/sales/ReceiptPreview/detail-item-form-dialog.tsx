import NumericFormat from '@/components/NumericFormat'
import type { FormValuesType } from '../FormikComponent'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    Typography,
} from '@mui/material'
import { useFormikContext } from 'formik'
import RpInputAdornment from '@/components/InputAdornment/Rp'

export function DetailItemFormDialog({
    data,
    onClose,
}: {
    data: FormValuesType['details'][0] | null
    onClose: () => void
}) {
    const {
        setFieldValue,
        values: { details: value },
    } = useFormikContext<FormValuesType>()

    return (
        <Dialog open={Boolean(data)} maxWidth="xs" fullWidth>
            <DialogContent>
                {data && (
                    <form
                        id="item-detail-form"
                        onSubmit={ev => {
                            ev.preventDefault()

                            if (!ev.currentTarget.reportValidity()) return

                            const formData = new FormData(ev.currentTarget)

                            const newQty = Number(
                                formData
                                    .get('qty')
                                    ?.toString()
                                    .replace(/\D/g, ''),
                            )
                            const newHarga = Number(
                                formData
                                    .get('rp_per_unit')
                                    ?.toString()
                                    .replace(/\D/g, ''),
                            )

                            if (newQty <= 0 || newHarga <= 0) return

                            setFieldValue(
                                'details',
                                value.map(detail =>
                                    detail.product_id === data.product_id
                                        ? {
                                              ...data,
                                              qty: newQty,
                                              rp_per_unit: newHarga,
                                          }
                                        : detail,
                                ),
                            )

                            onClose()
                        }}>
                        <Typography mb={2} fontWeight="bold">
                            {data.product?.name}
                        </Typography>

                        <Box display="flex" gap={2}>
                            <NumericFormat
                                variant="standard"
                                name="qty"
                                size="medium"
                                label="QTY"
                                defaultValue={data.qty}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            {data.product?.unit ?? ''}
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <NumericFormat
                                variant="standard"
                                size="medium"
                                name="rp_per_unit"
                                label="Harga"
                                defaultValue={data.rp_per_unit}
                                InputProps={{
                                    startAdornment: <RpInputAdornment />,
                                }}
                            />
                        </Box>
                    </form>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button
                    form="item-detail-form"
                    type="submit"
                    color="primary"
                    variant="contained">
                    Simpan
                </Button>
            </DialogActions>
        </Dialog>
    )
}
