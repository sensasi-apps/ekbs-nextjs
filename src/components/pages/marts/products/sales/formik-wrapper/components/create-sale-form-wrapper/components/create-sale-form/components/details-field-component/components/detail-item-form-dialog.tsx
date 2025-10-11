// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { useFormikContext } from 'formik'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import NumericFormat from '@/components/NumericFormat'
//
import type { FormValuesType } from '../../../../../../..'

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
        <Dialog fullWidth maxWidth="xs" open={Boolean(data)}>
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
                        <Typography fontWeight="bold" mb={2}>
                            {data.product?.name}
                        </Typography>

                        <Box display="flex" gap={2}>
                            <NumericFormat
                                defaultValue={data.qty}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            {data.product?.unit ?? ''}
                                        </InputAdornment>
                                    ),
                                }}
                                label="QTY"
                                name="qty"
                                size="medium"
                                variant="standard"
                            />

                            <NumericFormat
                                defaultValue={data.rp_per_unit}
                                InputProps={{
                                    startAdornment: <RpInputAdornment />,
                                }}
                                label="Harga"
                                name="rp_per_unit"
                                size="medium"
                                variant="standard"
                            />
                        </Box>
                    </form>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button
                    color="primary"
                    form="item-detail-form"
                    type="submit"
                    variant="contained">
                    Simpan
                </Button>
            </DialogActions>
        </Dialog>
    )
}
