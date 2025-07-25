// vendors
import { type FormikProps, Formik, useFormikContext } from 'formik'
// materials
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
// components
import FormikForm, { DateField, TextField } from '@/components/FormikForm'
import handle422 from '@/utils/errorCatcher'
import myAxios from '@/lib/axios'
import UserSelect from '@/components/FormikForm/user-select'
// features
import PaymentInputs from './payment-inputs'
import SparePartsArrayField from '@/features/repair-shop--sale/components/spare-parts-array-field'
import ServicesArrayField from './services-array-field'
// utils
import type Service from '@/features/repair-shop--service/types/service'
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'
import numberToCurrency from '@/utils/numberToCurrency'

export type FormData = Partial<{
    uuid: string
    at: string
    note: string

    payment_method: 'cash' | 'business-unit' | 'installment'

    // cash
    adjustment_rp: number
    cash_uuid: string
    costumer_uuid?: string

    // installment
    installment_data: {
        interest_percent: number
        n_term: number
        term_unit: 'minggu' | 'bulan'
    }

    // business unit
    business_unit_cash_uuid: string

    spare_parts: Partial<{
        spare_part_state?: SparePart // if defined, it's an existing sale
        spare_part_warehouse_id: number
        qty: number
        rp_per_unit: number
    }>[]

    services: Partial<{
        state?: Service // if defined, it's an existing sale
        service_id: string
        rp: number
    }>[]
}>

export default function SaleFormDialog({
    formData,
    handleClose,
}: {
    formData: FormData | undefined
    handleClose: () => void
}) {
    const isNew = !formData?.uuid

    return (
        <Dialog open fullScreen disablePortal maxWidth="md">
            <DialogTitle
                sx={{
                    px: {
                        sm: undefined,
                        md: 12,
                    },
                }}>
                {isNew ? 'Tambah' : 'Rincian'} Data Penjualan
            </DialogTitle>

            <DialogContent
                sx={{
                    px: {
                        sm: undefined,
                        md: 12,
                    },
                }}>
                <Formik<FormData>
                    validateOnChange={false}
                    initialStatus={{
                        isDisabled: !isNew,
                    }}
                    initialValues={formData ?? {}}
                    onSubmit={(values, { setErrors, resetForm }) =>
                        myAxios
                            .post('repair-shop/sales', values)
                            .then(resetForm)
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={SaleFormikForm}
                />
            </DialogContent>
        </Dialog>
    )
}

export function SaleFormikForm({
    status,
    dirty,
    isSubmitting,
    values,
}: FormikProps<FormData>) {
    const isDisabled = isSubmitting || status?.isDisabled

    return (
        <FormikForm
            id="repair-shop-sale-form"
            autoComplete="off"
            isNew={!values.uuid}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <Grid container spacing={4}>
                <LeftGrid isDisabled={isDisabled} values={values} />
                <RightGrid />
            </Grid>
        </FormikForm>
    )
}

interface InnerGrid {
    isDisabled: boolean
    values: FormData
}

function LeftGrid({ isDisabled, values }: InnerGrid) {
    return (
        <Grid size={{ xs: 12, sm: 8 }}>
            <DateField name="at" label="Tanggal" disabled={isDisabled} />

            <TextField
                name="note"
                label="Catatan"
                disabled={isDisabled}
                textFieldProps={{
                    required: false,
                    multiline: true,
                }}
            />

            {values.payment_method !== 'business-unit' && (
                <UserSelect
                    name="customer_uuid"
                    label="Pelanggan"
                    disabled={isDisabled}
                    slotProps={{
                        textField: {
                            required: values.payment_method === 'installment',
                        },
                    }}
                />
            )}

            <Box mt={4}>
                <ServicesArrayField isDisabled={isDisabled} />
            </Box>

            <Box my={4}>
                <SparePartsArrayField
                    name="spare_parts"
                    isDisabled={isDisabled}
                />
            </Box>

            <PaymentInputs name="payment_method" />
        </Grid>
    )
}

function RightGrid() {
    const { values, errors } = useFormikContext<FormData>()

    const totalMovementRp =
        values.spare_parts?.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0

    const totalServiceRp =
        values.services?.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const totalRpWithoutInterest =
        totalMovementRp + totalServiceRp + (values.adjustment_rp ?? 0)

    const totalInterest =
        Math.ceil(
            totalRpWithoutInterest *
                ((values.installment_data?.interest_percent ?? 0) / 100),
        ) * (values.installment_data?.n_term ?? 0)

    const totalRp = totalRpWithoutInterest + totalInterest

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <Box
                sx={{
                    border: '1px solid #555',
                    borderRadius: 2,
                    p: 3,
                }}>
                <Typography gutterBottom>Rangkuman</Typography>

                <Typography variant="body2" color="textDisabled">
                    Layanan
                </Typography>

                <Typography gutterBottom>
                    {numberToCurrency(totalServiceRp ?? 0)}
                </Typography>

                <Typography variant="body2" color="textDisabled">
                    Suku Cadang
                </Typography>

                <Typography gutterBottom>
                    {numberToCurrency(totalMovementRp ?? 0)}
                </Typography>

                {values.payment_method === 'cash' &&
                    Boolean(values.adjustment_rp) &&
                    values.adjustment_rp !== 0 && (
                        <>
                            <Typography variant="body2" color="textDisabled">
                                Penyesuaian
                            </Typography>

                            <Typography gutterBottom>
                                {numberToCurrency(values.adjustment_rp ?? 0)}
                            </Typography>
                        </>
                    )}

                {values.payment_method === 'installment' && (
                    <>
                        <Typography variant="body2" color="textDisabled">
                            Jasa
                        </Typography>

                        <Typography gutterBottom>
                            {numberToCurrency(totalInterest ?? 0)}
                        </Typography>
                    </>
                )}

                <Typography variant="body2" color="textDisabled">
                    Total Keseluruhan
                </Typography>

                <Typography>{numberToCurrency(totalRp)}</Typography>
            </Box>

            {Object.values(errors).length > 0 && (
                <Box mt={4} sx={{ color: 'error.main' }}>
                    <Typography variant="caption" fontWeight="bold">
                        Terjadi kesalahan:
                    </Typography>

                    <ul
                        style={{
                            marginTop: 0,
                        }}>
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                </Box>
            )}
        </Grid>
    )
}
