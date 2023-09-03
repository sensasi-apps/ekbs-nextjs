import { FC } from 'react'
import Head from 'next/head'
import moment from 'moment'
import { mutate } from 'swr'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import BackupTableIcon from '@mui/icons-material/BackupTable'

import AuthLayout from '@/components/Layouts/AuthLayout'

import FabWithUseFormData from '@/components/Global/Fab/WithUseFormData'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import FormActionsBox from '@/components/Global/FormActionsBox'
import DialogWithUseFormData from '@/components/Global/Dialog/WithUseFormData'
import NumericFormat from '@/components/Global/NumericFormat'

import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form/index'
import useFormData, { FormDataProvider } from '@/providers/useFormData'

import PalmBunchesReaPaymentDataType from '@/dataTypes/PalmBunchesReaPayment.type'

const PalmBuncesReaPaymentsPage: FC = () => {
    return (
        <AuthLayout title="Pembayaran dari REA">
            <Head>
                <title>{`Pembayaran dari REA — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </AuthLayout>
    )
}

const PalmBunchDeliveryRatesCrudWithUseFormData: FC = () => {
    const {
        data,
        submitting,
        loading,
        setSubmitting,
        handleClose,
        handleEdit,
    } = useFormData()

    const title = 'Pembayaran'

    const columns = [
        {
            name: 'uuid',
            label: 'uuid',
            options: {
                display: false,
            },
        },
        {
            name: 'from_at',
            label: 'Tanggal Tiket Awal',
            options: {
                customBodyRender: (value: string) => moment(value).format('LL'),
            },
        },
        {
            name: 'to_at',
            label: 'Tanggal Tiket Akhir',
            options: {
                customBodyRender: (value: string) => moment(value).format('LL'),
            },
        },
        {
            name: 'final_rp',
            label: 'Nilai Akhir',
            options: {
                customBodyRender: (value: number) => (
                    <NumericFormat value={value} displayType="text" />
                ),
            },
        },
        {
            name: 'n_details',
            label: 'Jumlah Tiket',
            options: {
                customBodyRender: (value: number) => (
                    <NumericFormat value={value} displayType="text" />
                ),
            },
        },
    ]

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl="/palm-bunches/rea-payments/datatable"
                onRowClick={(_, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                columns={columns}
                defaultSortOrder={{ name: 'from_at', direction: 'desc' }}
            />

            <DialogWithUseFormData title={title} maxWidth="sm">
                <PalmBunchesReaPaymentForm
                    data={data as PalmBunchesReaPaymentDataType}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    handleClose={() => {
                        mutate('/palm-bunches/rea-payments/datatable')
                        handleClose()
                    }}
                    actionsSlot={
                        <FormActionsBox
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </DialogWithUseFormData>

            <FabWithUseFormData>
                <BackupTableIcon />
            </FabWithUseFormData>
        </Box>
    )
}

export default PalmBuncesReaPaymentsPage
