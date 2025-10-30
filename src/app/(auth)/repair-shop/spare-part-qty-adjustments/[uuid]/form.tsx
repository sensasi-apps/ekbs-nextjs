'use client'

import PrintIcon from '@mui/icons-material/Print'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import type { AxiosError } from 'axios'
import { Formik } from 'formik'
import { memo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import LoadingCenter from '@/components/loading-center'
import myAxios from '@/lib/axios'
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import DetailTable from './detail-table'
import SummaryTable from './summary-table'

const Form = memo(function Form({
    uuid,
    data,
    finished,
}: {
    uuid: SparePartMovementORM['uuid']
    data: SparePartMovementORM
    finished: boolean
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submitFormRef = useRef<() => Promise<void>>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef,
        pageStyle: '@media print { body { margin: auto; } }',
    })

    const [errorMsg, setErrorMsg] =
        useState<LaravelValidationExceptionResponse['message']>()

    const values = data.details.map(detail => ({
        id: detail.id,
        physical_qty: detail.qty + detail.spare_part_state.warehouses[0].qty,
    }))

    if (isSubmitting) return <LoadingCenter />

    return (
        <>
            <Box alignItems="center" display="flex" mb={1} mt={3}>
                <Typography component="p" variant="h6">
                    Rincian
                </Typography>

                <Box ml={4}>
                    <IconButton onClick={handlePrint}>
                        <PrintIcon onClick={handlePrint} />
                    </IconButton>
                </Box>

                {!finished && (
                    <Button
                        onClick={() => submitFormRef.current?.()}
                        size="small"
                        sx={{
                            ml: 4,
                        }}
                        variant="contained">
                        Simpan Perubahan
                    </Button>
                )}
            </Box>

            {errorMsg && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                    }}
                    variant="outlined">
                    {errorMsg}
                </Alert>
            )}

            <Formik
                enableReinitialize
                initialValues={values}
                onSubmit={async values => {
                    setIsSubmitting(true)

                    return myAxios
                        .put(
                            `repair-shop/spare-parts/qty-adjustments/${uuid}/update-quantities`,
                            values,
                        )
                        .then(() => {
                            location.reload()
                        })
                        .catch(
                            (
                                err: AxiosError<LaravelValidationExceptionResponse>,
                            ) => {
                                setIsSubmitting(false)

                                if (err.response?.status === 422) {
                                    setErrorMsg(err.response.data.message)
                                }
                            },
                        )
                }}>
                {({ submitForm }) => {
                    submitFormRef.current = submitForm

                    return (
                        <div ref={contentRef}>
                            <Box display="none" displayPrint="block">
                                <Typography fontWeight="bold" gutterBottom>
                                    Opname Suku Cadang{' '}
                                    {finished ? '' : '— DRAF'}
                                </Typography>

                                <Typography fontWeight="bold" variant="body2">
                                    Rangkuman
                                </Typography>

                                <SummaryTable data={data} />

                                <Typography
                                    fontWeight="bold"
                                    mt={2}
                                    variant="body2">
                                    Rincian
                                </Typography>
                            </Box>

                            <DetailTable
                                data={data.details}
                                finished={finished}
                                print={false}
                            />
                        </div>
                    )
                }}
            </Formik>
        </>
    )
})

export default Form
