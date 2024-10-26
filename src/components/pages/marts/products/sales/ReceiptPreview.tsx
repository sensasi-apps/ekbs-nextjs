import type {
    FormikStatusType,
    FormValuesType,
} from '@/components/pages/marts/products/sales/formik-component'
// vendors
import { memo, useEffect } from 'react'
import { Box, Collapse, Fade, IconButton, Paper, Tooltip } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useFormikContext } from 'formik'
import {
    Save as SaveIcon,
    AddBox as AddBoxIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import useSWR from 'swr'
// global components
import PrintHandler from '@/components/PrintHandler'
// subcomponents
import CreateSaleForm from './ReceiptPreview/CreateSaleForm'
import Receipt from './ReceiptPreview/Receipt'
// utils
import useAuth from '@/providers/Auth'
import ApiUrl from './@enums/api-url'

function ReceiptPreview() {
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
    const { mutate } = useSWR(ApiUrl.NEW_SALE_NUMBER)

    useEffect(() => {
        if (isFormOpen) {
            mutate()
        }
    }, [isFormOpen, mutate])

    const isSubmitted = Boolean(submittedData)

    return (
        <Paper
            sx={{
                p: 2.5,
            }}>
            <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                    <LoadingButton
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
                    </LoadingButton>

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
                                    saleNo: submittedData.no,
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

export default memo(ReceiptPreview)
