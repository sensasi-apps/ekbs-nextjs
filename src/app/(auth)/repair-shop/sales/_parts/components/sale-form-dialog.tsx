// vendors

// materials
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Formik, type FormikProps, useFormikContext } from 'formik'
import SparePartsArrayField from '@/app/(auth)/repair-shop/sales/_parts/components/spare-parts-array-field'
// formik
import BooleanField from '@/components/formik-fields/boolean-field'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
import UserSelect from '@/components/formik-fields/user-select'
import FormikForm from '@/components/formik-form-v2'
// utils
import myAxios from '@/lib/axios'
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'
import calculateTotals from '@/modules/repair-shop/utils/calculate-totals'
import handle422 from '@/utils/handle-422'

import numberToCurrency from '@/utils/number-to-currency'
// features
import PaymentInputs from './payment-inputs'
import ServicesArrayField from './services-array-field'

export default function SaleFormDialog({
    status,
    formData,
    handleClose,
}: {
    status: {
        isDisabled: boolean
    }
    formData: SaleFormValues
    handleClose: () => void
}) {
    const isNew = !formData?.uuid

    return (
        <Dialog disablePortal fullScreen maxWidth="md" open>
            <DialogTitle
                sx={{
                    px: {
                        md: 12,
                        sm: undefined,
                    },
                }}>
                {isNew ? 'Tambah' : 'Rincian'} Data Penjualan
            </DialogTitle>

            <DialogContent
                sx={{
                    px: {
                        md: 12,
                        sm: undefined,
                    },
                }}>
                <Formik<SaleFormValues>
                    component={SaleFormikForm}
                    initialStatus={status}
                    initialValues={formData}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors, resetForm }) => {
                        values.is_finished = true

                        const axiosInstance = values.uuid
                            ? myAxios.put(
                                  `repair-shop/sales/${values.uuid}`,
                                  values,
                              )
                            : myAxios.post('repair-shop/sales', values)

                        return axiosInstance
                            .then(resetForm)
                            .catch(error => handle422(error, setErrors))
                    }}
                    validateOnChange={false}
                />
            </DialogContent>
        </Dialog>
    )
}

function SaleFormikForm({
    status,
    isSubmitting,
    values,
}: FormikProps<SaleFormValues>) {
    const isDisabled = isSubmitting || status?.isDisabled || values.uuid

    return (
        <FormikForm>
            <Grid container spacing={4}>
                <LeftGrid isDisabled={isDisabled} values={values} />
                <RightGrid />
            </Grid>
        </FormikForm>
    )
}

interface InnerGrid {
    isDisabled: boolean
    values: SaleFormValues
}

function LeftGrid({ isDisabled, values }: InnerGrid) {
    return (
        <Grid size={{ sm: 8, xs: 12 }}>
            <DateField disabled={isDisabled} label="Tanggal" name="at" />

            <UserSelect
                label="Pekerja"
                name="worker_user_uuid"
                slotProps={{
                    textField: {
                        required: false,
                    },
                }}
            />

            {values.payment_method !== 'business-unit' && (
                <UserSelect
                    label="Pelanggan"
                    name="customer_uuid"
                    slotProps={{
                        textField: {
                            required: values.payment_method === 'installment',
                        },
                    }}
                />
            )}

            <TextField
                disabled={isDisabled}
                label="Catatan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                    rows: 2,
                }}
            />

            <Box mt={4}>
                <ServicesArrayField isDisabled={isDisabled} />
            </Box>

            <Box my={4}>
                <SparePartsArrayField
                    isDisabled={isDisabled}
                    name="spare_parts"
                />
            </Box>

            <BooleanField
                disabled={true}
                label="Selesaikan Transaksi"
                name="is_finished"
                switch
            />

            {values.is_finished && <PaymentInputs name="payment_method" />}
        </Grid>
    )
}

function RightGrid() {
    const { values, errors } = useFormikContext<SaleFormValues>()
    const { totalMovementRp, totalServiceRp, totalInterest, totalRp } =
        calculateTotals(values)

    return (
        <Grid size={{ sm: 4, xs: 12 }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: {
                        sm: 0,
                        xs: undefined,
                    },
                }}>
                <Box
                    sx={{
                        border: '1px solid #555',
                        borderRadius: 2,
                        p: 3,
                    }}>
                    <Typography gutterBottom>Rangkuman</Typography>

                    <Typography color="textDisabled" variant="body2">
                        Layanan
                    </Typography>

                    <Typography gutterBottom>
                        {numberToCurrency(totalServiceRp ?? 0)}
                    </Typography>

                    <Typography color="textDisabled" variant="body2">
                        Suku Cadang
                    </Typography>

                    <Typography gutterBottom>
                        {numberToCurrency(totalMovementRp ?? 0)}
                    </Typography>

                    {values.payment_method === 'cash' &&
                        Boolean(values.adjustment_rp) &&
                        values.adjustment_rp !== 0 && (
                            <>
                                <Typography
                                    color="textDisabled"
                                    variant="body2">
                                    Penyesuaian
                                </Typography>

                                <Typography gutterBottom>
                                    {numberToCurrency(
                                        values.adjustment_rp ?? 0,
                                    )}
                                </Typography>
                            </>
                        )}

                    {values.payment_method === 'installment' && (
                        <>
                            <Typography color="textDisabled" variant="body2">
                                Jasa
                            </Typography>

                            <Typography gutterBottom>
                                {numberToCurrency(totalInterest ?? 0)}
                            </Typography>
                        </>
                    )}

                    <Typography color="textDisabled" variant="body2">
                        Total Keseluruhan
                    </Typography>

                    <Typography>{numberToCurrency(totalRp)}</Typography>
                </Box>

                {Object.values(errors).length > 0 && (
                    <Box mt={4} sx={{ color: 'error.main', width: '100%' }}>
                        <Typography fontWeight="bold" variant="caption">
                            Terjadi kesalahan:
                        </Typography>

                        <ul
                            style={{
                                marginTop: 0,
                            }}>
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>
                                    {typeof value === 'string'
                                        ? value
                                        : (value as string[]).join(', ')}
                                </li>
                            ))}
                        </ul>
                    </Box>
                )}
            </Box>
        </Grid>
    )
}
