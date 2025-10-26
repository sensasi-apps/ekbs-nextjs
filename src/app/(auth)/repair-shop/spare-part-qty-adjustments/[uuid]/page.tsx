'use client'

import DeleteIcon from '@mui/icons-material/Delete'
// icons-materials
import LockIcon from '@mui/icons-material/Lock'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// vendors
import type { AxiosError } from 'axios'
import { Formik } from 'formik'
import { useParams } from 'next/navigation'
import { memo, useRef, useState } from 'react'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'
import FlexBox from '@/components/flex-box'
import PrintHandler from '@/components/print-handler'
// libs
import axios from '@/lib/axios'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
// local components
import DetailTable from './detail-table'
import SummaryTable from './summary-table'

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

    if (uuid === undefined || data === undefined) return null

    return (
        <>
            <Fade in={!data.finalized_at} unmountOnExit>
                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                    }}
                    variant="outlined">
                    Pastikan untuk tidak melakukan transaksi pada produk yang
                    sedang di-opname hingga proses opname selesai.
                </Alert>
            </Fade>

            <FlexBox justifyContent="space-between" mb={2}>
                <BackButton />

                {!data.finalized_at && (
                    <FlexBox gap={4}>
                        <DeleteButton uuid={data.uuid} />
                        <SavePermanentButton uuid={data.uuid} />
                    </FlexBox>
                )}
            </FlexBox>

            <Typography component="p" variant="h6">
                Rangkuman
            </Typography>

            {data && (
                <SummaryTable
                    data={data}
                    handleRefreshData={handleRefreshData}
                />
            )}

            <Box alignItems="center" display="flex" mb={1} mt={3}>
                <Typography component="p" variant="h6">
                    Rincian
                </Typography>

                {data && (
                    <Box ml={4}>
                        <PrintButton data={data} />
                    </Box>
                )}

                {!data.finalized_at && (
                    <Button
                        disabled={
                            mainIsLoading
                            // || !isQtyChanged
                        }
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

            <Fade in={mainIsLoading} unmountOnExit>
                <LinearProgress />
            </Fade>

            {data && (
                <Formik
                    enableReinitialize
                    initialValues={data.details.map(detail => ({
                        id: detail.id,
                        physical_qty:
                            detail.qty +
                            detail.spare_part_state.warehouses[0].qty,
                    }))}
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
                                data={data.details}
                                finished={Boolean(data.finalized_at)}
                                print={false}
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
            <Typography fontWeight="bold" gutterBottom>
                Opname Suku Cadang {data.finalized_at ? '' : '— DRAF'}
            </Typography>

            <Typography fontWeight="bold" variant="body2">
                Rangkuman
            </Typography>

            {data && <SummaryTable data={data} />}

            <Typography fontWeight="bold" mt={2} variant="body2">
                Rincian
            </Typography>

            <DetailTable
                data={data.details ?? []}
                finished={Boolean(data.finalized_at)}
                print
            />
        </PrintHandler>
    )
})

function SavePermanentButton({ uuid }: { uuid: SparePartMovementORM['uuid'] }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>()

    const handleSubmit = async () => {
        setIsSubmitting(true)

        return axios
            .put(`repair-shop/spare-parts/qty-adjustments/${uuid}/finish`)
            .then(() => {
                location.reload()
            })
            .catch(
                (
                    error: AxiosError<{
                        message: string
                    }>,
                ) => {
                    setIsSubmitting(false)
                    setError(error.response?.data.message)

                    return error
                },
            )
    }

    return (
        <ConfirmationDialogWithButton
            buttonProps={{
                children: 'Simpan Permanen',
                size: 'small',
                startIcon: <LockIcon />,
                variant: 'outlined',
            }}
            color="warning"
            loading={isSubmitting}
            onConfirm={handleSubmit}
            shouldConfirm
            title="Konfirmasi Simpan Permanen">
            Data yang sudah disimpan permanen tidak dapat diubah lagi.
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                    }}>
                    {error}
                </Alert>
            )}
        </ConfirmationDialogWithButton>
    )
}

function DeleteButton({ uuid }: { uuid: SparePartMovementORM['uuid'] }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>()

    const handleSubmit = async () => {
        setIsSubmitting(true)

        return axios
            .delete(`repair-shop/spare-parts/qty-adjustments/${uuid}`)
            .then(() => {
                history.back()
            })
            .catch(
                (
                    error: AxiosError<{
                        message: string
                    }>,
                ) => {
                    setIsSubmitting(false)
                    setError(error.response?.data.message)

                    throw error
                },
            )
    }

    return (
        <ConfirmationDialogWithButton
            buttonProps={{
                children: 'Hapus',
                size: 'small',
                startIcon: <DeleteIcon />,
                variant: 'outlined',
            }}
            color="error"
            loading={isSubmitting}
            onConfirm={handleSubmit}
            shouldConfirm
            title="Konfirmasi Hapus">
            Data yang sudah dihapus tidak dapat dikembalikan.
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                    }}>
                    {error}
                </Alert>
            )}
        </ConfirmationDialogWithButton>
    )
}
