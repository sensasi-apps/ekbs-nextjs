// vendors

import AddBoxIcon from '@mui/icons-material/AddBox'
import CloseIcon from '@mui/icons-material/Close'
// icons
import SaveIcon from '@mui/icons-material/Save'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import { useFormikContext } from 'formik'
import PrintHandler from '@/components/PrintHandler'
// global components
import type {
    FormikStatusType,
    FormValuesType,
} from '@/components/pages/marts/products/sales/formik-wrapper'
// hooks
import useAuthInfo from '@/hooks/use-auth-info'
import Receipt from '../../../../../../../../app/mart-product-sales/_parts/shared-subcomponents/receipt'
// sub-components
import CreateSaleForm from './components/create-sale-form'

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
    const user = useAuthInfo()
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
                        color={isFormOpen ? 'warning' : 'success'}
                        disabled={
                            isSubmitted ||
                            (isFormOpen && (!dirty || isDisabled))
                        }
                        loading={isSubmitting}
                        onClick={() =>
                            isFormOpen
                                ? handleSubmit()
                                : setStatus({ ...status, isFormOpen: true })
                        }
                        size="small"
                        startIcon={isFormOpen ? <SaveIcon /> : <AddBoxIcon />}>
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
                                    costs: values.costs.map(cost => ({
                                        name: cost.name,
                                        rp: cost.rp ?? 0,
                                    })),
                                    details: values.details.map(detail => ({
                                        cost_rp_per_unit: 0,
                                        product: detail.product,
                                        product_id: detail.product_id,
                                        product_state: null,
                                        qty: detail.qty,
                                        rp_per_unit: detail.rp_per_unit,
                                        warehouse_state: null,
                                    })),
                                    saleBuyerUser: submittedData.buyer_user,
                                    servedByUserName: user?.name ?? '-',
                                    totalPayment: submittedData.total_payment,
                                    transactionCashName:
                                        submittedData.cashable_name,
                                }}
                            />
                        )}
                    </PrintHandler>
                </Box>

                <Fade in={isFormOpen}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={isSubmitted ? 'Tutup' : 'Batal'}>
                        <IconButton
                            color={isSubmitted ? undefined : 'error'}
                            disabled={isSubmitting}
                            onClick={() => handleReset()}
                            size="small">
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
