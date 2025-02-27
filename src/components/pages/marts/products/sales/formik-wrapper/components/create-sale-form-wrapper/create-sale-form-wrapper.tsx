// vendors
import { useFormikContext } from 'formik'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
// icons
import SaveIcon from '@mui/icons-material/Save'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CloseIcon from '@mui/icons-material/Close'
// global components
import type {
    FormikStatusType,
    FormValuesType,
} from '@/components/pages/marts/products/sales/formik-wrapper'
import PrintHandler from '@/components/PrintHandler'
// sub-components
import CreateSaleForm from './components/create-sale-form'
import Receipt from '../../../@shared-subcomponents/receipt'
// utils
import useAuth from '@/providers/Auth'

export function CreateSaleFormWrapper() {
    const {
        handleSubmit,
        handleReset,
        setStatus,
        isSubmitting,
        dirty,
        status,
        values,
    } = useFormikContext<FormValuesType>()
    const { user } = useAuth()
    const { isDisabled, isFormOpen, submittedData } = status as FormikStatusType

    const isSubmitted = Boolean(submittedData)

    return (
        <Paper
            sx={{
                p: 2.5,
            }}>
            <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                    <Button
                        startIcon={isFormOpen ? <SaveIcon /> : <AddBoxIcon />}
                        color={isFormOpen ? 'warning' : 'success'}
                        size="small"
                        onClick={() =>
                            isFormOpen
                                ? handleSubmit()
                                : setStatus({ ...status, isFormOpen: true })
                        }
                        disabled={
                            isSubmitted ||
                            (isFormOpen && (!dirty || isDisabled))
                        }
                        loading={isSubmitting}>
                        {isFormOpen ? 'Simpan' : 'Penjualan Baru'}
                    </Button>

                    <PrintHandler
                        slotProps={{
                            printButton: {
                                size: 'small',
                                sx: {
                                    display: isSubmitted ? undefined : 'none',
                                },
                            },
                        }}>
                        {submittedData && (
                            <Receipt
                                data={{
                                    at: submittedData.at,
                                    servedByUserName: user?.name ?? '-',
                                    saleBuyerUser: submittedData.buyer_user,
                                    transactionCashName:
                                        submittedData.cashable_name,
                                    details: values.details.map(detail => ({
                                        product: detail.product,
                                        product_id: detail.product_id,
                                        qty: detail.qty,
                                        rp_per_unit: detail.rp_per_unit,
                                        cost_rp_per_unit: 0,
                                        product_state: null,
                                        warehouse_state: null,
                                    })),
                                    costs: values.costs.map(cost => ({
                                        name: cost.name,
                                        rp: cost.rp ?? 0,
                                    })),
                                    totalPayment: submittedData.total_payment,
                                }}
                            />
                        )}
                    </PrintHandler>
                </Box>

                <Fade in={isFormOpen}>
                    <Tooltip
                        title={isSubmitted ? 'Tutup' : 'Batal'}
                        arrow
                        placement="top">
                        <IconButton
                            size="small"
                            onClick={() => handleReset()}
                            disabled={isSubmitting}
                            color={isSubmitted ? undefined : 'error'}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Fade>
            </Box>

            <Collapse in={isFormOpen}>
                <Box mt={2}>
                    <CreateSaleForm />
                </Box>
            </Collapse>
        </Paper>
    )
}
