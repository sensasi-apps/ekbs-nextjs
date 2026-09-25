// icons
import DeleteIcon from '@mui/icons-material/Delete'
// materials
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Formik, type FormikProps, useFormikContext } from 'formik'
import { useSWRConfig } from 'swr'
import SparePartsArrayField from '@/app/(auth)/repair-shop/sales/_parts/components/spare-parts-array-field'
// formik
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'
import BooleanField from '@/components/formik-fields/boolean-field'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
import UserSelect from '@/components/formik-fields/user-select'
import FormikForm from '@/components/formik-form-v2'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// utils
import myAxios from '@/lib/axios'
import Permission from '@/modules/repair-shop/enums/permission'
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
    const hasPermission = useIsAuthHasPermission()
    const { mutate } = useSWRConfig()
    const saleUuid = formData.uuid
    const canDelete =
        saleUuid &&
        formData.payment_method == null &&
        !status.isDisabled &&
        hasPermission(Permission.UPDATE_SALE)

    return (
        <Dialog disablePortal fullScreen maxWidth="md" open>
            <DialogTitle
                sx={{
                    px: {
                        md: 12,
                        sm: undefined,
                    },
                }}>
                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between">
                    <span>{isNew ? 'Tambah' : 'Rincian'} Data Penjualan</span>
                    {canDelete && saleUuid && (
                        <ConfirmationDialogWithButton
                            buttonProps={{
                                size: 'small',
                                startIcon: <DeleteIcon />,
                                variant: 'outlined',
                            }}
                            buttonText="Hapus"
                            color="error"
                            onConfirm={() =>
                                myAxios
                                    .delete(`repair-shop/sales/${saleUuid}`)
                                    .then(async () => {
                                        await mutate(
                                            key =>
                                                Array.isArray(key) &&
                                                key[0] ===
                                                    'repair-shop/sales/datatable',
                                        )
                                        handleClose()
                                    })
                            }
                            shouldConfirm
                            title="Konfirmasi Hapus Penjualan">
                            Penjualan yang belum dibayar akan dihapus permanen.
                            Data ini tidak dapat dikembalikan.
                        </ConfirmationDialogWithButton>
                    )}
                </Box>
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
                    initialValues={{
                        ...formData,
                        installment_data: formData.installment_data ?? {
                            n_term: 1,
                        },
                        spare_part_margins: formData.spare_parts.map(
                            (sparePart, index) =>
                                formData.spare_part_margins?.[index] ?? {
                                    _base_rp_per_unit:
                                        sparePart.spare_part_state
                                            ?.warehouses?.[0]
                                            ?.base_rp_per_unit ?? 0,
                                    margin_percentage:
                                        sparePart.spare_part_state
                                            ?.warehouses?.[0]
                                            ?.installment_margin_percent ?? 0,
                                    spare_part_warehouse_id:
                                        sparePart.spare_part_warehouse_id ?? 0,
                                },
                        ),
                    }}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors, resetForm }) => {
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
    const isDisabled = isSubmitting || status?.isDisabled

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

            <BooleanField checkbox label="Sudah Dibayar" name="is_finished" />

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
