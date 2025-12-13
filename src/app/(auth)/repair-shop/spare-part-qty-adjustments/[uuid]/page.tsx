'use client'

import DeleteIcon from '@mui/icons-material/Delete'
// icons-materials
import LockIcon from '@mui/icons-material/Lock'
// materials
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
// vendors
import type { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'
import FlexBox from '@/components/flex-box'
import LoadingCenter from '@/components/loading-center'
// libs
import axios from '@/lib/axios'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
// local components
import Form from './form'
import SummaryTable from './summary-table'

export default function OpnameDetail() {
    const params = useParams()
    const uuid = params?.uuid

    const { data, isValidating, mutate } = useSWR<SparePartMovementORM>(
        uuid ? `repair-shop/spare-parts/qty-adjustments/${uuid}` : undefined,
    )

    function handleRefreshData() {
        mutate()
    }

    if (uuid === undefined) return null

    if (data === undefined || isValidating) return <LoadingCenter />

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

            <SummaryTable data={data} handleRefreshData={handleRefreshData} />

            <Form
                data={data}
                finished={Boolean(data.finalized_at)}
                uuid={data.uuid}
            />
        </>
    )
}

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
                size: 'small',
                startIcon: <LockIcon />,
                variant: 'outlined',
            }}
            buttonText="Simpan Permanen"
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
                size: 'small',
                startIcon: <DeleteIcon />,
                variant: 'outlined',
            }}
            buttonText="Hapus"
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
