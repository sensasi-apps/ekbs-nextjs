import { FC } from 'react'
import Head from 'next/head'
import moment from 'moment'
import useSWR, { mutate } from 'swr'
import 'moment/locale/id'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AuthLayout from '@/components/Layouts/AuthLayout'

import FabWithUseFormData from '@/components/Global/Fab/WithUseFormData'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import FormActionsBox from '@/components/Global/FormActionsBox'
import DialogWithUseFormData from '@/components/Global/Dialog/WithUseFormData'
import NumericFormat from '@/components/Global/NumericFormat'

import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form/index'
import useFormData, { FormDataProvider } from '@/providers/useFormData'

import PalmBunchesReaPaymentDataType from '@/dataTypes/PalmBunchesReaPayment.type'
import axios from '@/lib/axios'

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

    const { data: paymentsNotFound = [] } = useSWR(
        '/palm-bunches/rea-payments/ticket-data-not-found',
        url => axios.get(url).then(res => res.data),
    )

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
                customBodyRender: (value: string) =>
                    moment(value).format('DD-MM-YYYY'),
            },
        },
        {
            name: 'to_at',
            label: 'Tanggal Tiket Akhir',
            options: {
                customBodyRender: (value: string) =>
                    moment(value).format('DD-MM-YYYY'),
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
                sort: false,
                customBodyRender: (value: number) => (
                    <NumericFormat value={value} displayType="text" />
                ),
            },
        },
        {
            name: 'n_tickets_has_paid',
            label: 'Tiket lunas',
            options: {
                sort: false,
                customBodyRender: (value: number, rowMeta: any) => (
                    <Typography
                        color={
                            rowMeta.rowData.n_details === value
                                ? 'success.main'
                                : 'warning.main'
                        }
                        fontWeight="bold">
                        <NumericFormat value={value} displayType="text" />
                    </Typography>
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

            <DialogWithUseFormData title="Pembayaran" maxWidth="sm">
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

            {paymentsNotFound.map((payment: any, index: number) => (
                <Box mb={3} key={index}>
                    <Alert severity="warning">
                        <Tooltip
                            title={payment.details.map((detail: any) => (
                                <div key={detail.wb_ticket_no}>
                                    {detail.wb_ticket_no}
                                </div>
                            ))}>
                            <span
                                style={{
                                    textDecoration: 'underline',
                                    textDecorationStyle: 'dotted',
                                    cursor: 'pointer',
                                }}>
                                <b>{payment.details.length} tiket</b> tidak
                                memiliki data tiket
                            </span>
                        </Tooltip>{' '}
                        pada pembayaran dengan UUID: <b>{payment.uuid}</b>
                    </Alert>
                </Box>
            ))}

            <FabWithUseFormData>
                <BackupTableIcon />
            </FabWithUseFormData>
        </Box>
    )
}

export default PalmBuncesReaPaymentsPage
