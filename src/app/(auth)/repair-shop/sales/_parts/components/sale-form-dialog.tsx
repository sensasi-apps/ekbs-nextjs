// vendors
import { type FormikProps, Formik, useFormikContext } from 'formik'
// materials
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// formik
import BooleanField from '@/components/formik-fields/boolean-field'
import DateField from '@/components/formik-fields/date-field'
import FormikForm from '@/components/formik-form-v2'
import TextField from '@/components/formik-fields/text-field'
import UserSelect from '@/components/formik-fields/user-select'
// features
import PaymentInputs from './payment-inputs'
import SparePartsArrayField from '@/app/(auth)/repair-shop/sales/_parts/components/spare-parts-array-field'
import ServicesArrayField from './services-array-field'
// utils
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
import type Service from '@/app/(auth)/repair-shop/services/_parts/types/service'
import type SparePart from '@/app/(auth)/repair-shop/spare-parts/_types/spare-part-model'
import numberToCurrency from '@/utils/number-to-currency'

export type FormData = Partial<{
    uuid: string
    at: string
    note: string

    is_finished: boolean

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
    status,
    formData,
    handleClose,
}: {
    status: {
        isDisabled: boolean
    }
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
                    initialStatus={status}
                    initialValues={formData ?? {}}
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
                    onReset={handleClose}
                    component={SaleFormikForm}
                />
            </DialogContent>
        </Dialog>
    )
}

function SaleFormikForm({
    status,
    isSubmitting,
    values,
}: FormikProps<FormData>) {
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
    values: FormData
}

function LeftGrid({ isDisabled, values }: InnerGrid) {
    return (
        <Grid size={{ xs: 12, sm: 8 }}>
            <DateField name="at" label="Tanggal" disabled={isDisabled} />

            {/* <UserSelect
                name="worker_user_uuid"
                label="Pekerja"
                disabled={isDisabled}
            /> */}

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

            <TextField
                name="note"
                label="Catatan"
                disabled={isDisabled}
                textFieldProps={{
                    required: false,
                    multiline: true,
                    rows: 2,
                }}
            />

            <Box mt={4}>
                <ServicesArrayField isDisabled={isDisabled} />
            </Box>

            <Box my={4}>
                <SparePartsArrayField
                    name="spare_parts"
                    isDisabled={isDisabled}
                />
            </Box>

            <BooleanField
                name="is_finished"
                label="Selesaikan Transaksi"
                disabled={true}
                switch
            />

            {values.is_finished && <PaymentInputs name="payment_method" />}
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
                    position: 'sticky',
                    top: {
                        xs: undefined,
                        sm: 0,
                    },
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
