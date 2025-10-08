'use client'

// vendors
import { useParams } from 'next/navigation'
import { memo, useRef, useState } from 'react'
import { Formik } from 'formik'
import useSWR from 'swr'
// materials
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons-materials
import LockIcon from '@mui/icons-material/Lock'
// libs
import axios from '@/lib/axios'
//
import BackButton from '@/components/back-button'
import PrintHandler from '@/components/PrintHandler'
// local components
import DetailTable from './detail-table'
import SummaryTable from './summary-table'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'

export default function OpnameDetail() {
    const submitFormRef = useRef<() => Promise<void>>(null)

    const params = useParams()
    const uuid = params?.uuid

    const { data, isLoading, isValidating, mutate } =
        useSWR<SparePartMovementORM>(
            uuid
                ? `repair-shop/spare-parts/qty-adjustments/${uuid}`
                : undefined,
        )

    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleRefreshData() {
        mutate()
    }

    const mainIsLoading = isLoading || isValidating || isSubmitting

    if (uuid === undefined) return null

    return (
        <>
            <Fade in={!data?.finalized_at} unmountOnExit>
                <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{
                        mb: 2,
                    }}>
                    Pastikan untuk tidak melakukan transaksi pada produk yang
                    sedang di-opname hingga proses opname selesai.
                </Alert>
            </Fade>

            <BackButton />

            <Box display="flex" gap={2} mt={2}>
                <Typography variant="h6" component="p">
                    Rangkuman
                </Typography>

                {!data?.finalized_at && (
                    <Button
                        startIcon={<LockIcon />}
                        variant="outlined"
                        disabled={mainIsLoading}
                        color="warning"
                        size="small"
                        onClick={() => {
                            setIsSubmitting(true)

                            axios
                                .put(
                                    `repair-shop/spare-parts/qty-adjustments/${uuid}/finish`,
                                )
                                .then(() => {
                                    location.reload()
                                })
                        }}>
                        Simpan Permanen
                    </Button>
                )}
            </Box>

            {data && (
                <SummaryTable
                    data={data}
                    handleRefreshData={handleRefreshData}
                />
            )}

            <Box display="flex" alignItems="center" mt={3} mb={1}>
                <Typography variant="h6" component="p">
                    Rincian
                </Typography>

                {data && (
                    <Box ml={4}>
                        <PrintButton data={data} />
                    </Box>
                )}

                {!data?.finalized_at && (
                    <Button
                        variant="contained"
                        sx={{
                            ml: 4,
                        }}
                        onClick={() => submitFormRef.current?.()}
                        size="small"
                        disabled={
                            mainIsLoading
                            // || !isQtyChanged
                        }>
                        Simpan Perubahan
                    </Button>
                )}
            </Box>

            <Fade in={mainIsLoading} unmountOnExit>
                <LinearProgress />
            </Fade>

            {data && (
                <Formik
                    initialValues={data.details.map(detail => ({
                        id: detail.id,
                        physical_qty:
                            detail.qty +
                            detail.spare_part_state.warehouses[0].qty,
                    }))}
                    enableReinitialize
                    onSubmit={async values => {
                        setIsSubmitting(true)

                        return axios
                            .put(
                                `repair-shop/spare-parts/qty-adjustments/${uuid}/update-quantities`,
                                values,
                            )
                            .then(() => {
                                location.reload()
                            })
                    }}>
                    {({ submitForm }) => {
                        submitFormRef.current = submitForm

                        return (
                            <DetailTable
                                print={false}
                                finished={Boolean(data?.finalized_at)}
                                data={data?.details ?? []}
                            />
                        )
                    }}
                </Formik>
            )}
        </>
    )
}

const PrintButton = memo(function PrintButton({
    data,
}: {
    data: SparePartMovementORM
}) {
    return (
        <PrintHandler>
            <Typography gutterBottom fontWeight="bold">
                Opname Suku Cadang {data.finalized_at ? '' : '— DRAF'}
            </Typography>

            <Typography variant="body2" fontWeight="bold">
                Rangkuman
            </Typography>

            {data && <SummaryTable data={data} />}

            <Typography variant="body2" mt={2} fontWeight="bold">
                Rincian
            </Typography>

            <DetailTable
                print
                data={data?.details ?? []}
                finished={Boolean(data?.finalized_at)}
            />
        </PrintHandler>
    )
})
