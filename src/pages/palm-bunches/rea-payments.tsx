import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesReaPaymentsPage() {
    return (
        <AuthLayout title="Pembayaran dari REA">
            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type PalmBunchesReaPaymentDataType from '@/dataTypes/PalmBunchesReaPayment'

// vendors
import useSWR from 'swr'
// materials
import Alert from '@mui/material/Alert'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import NumericFormat from '@/components/Global/NumericFormat'
import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form'
// providers
import useFormData from '@/providers/useFormData'
// utils
import toDmy from '@/utils/toDmy'

function PalmBunchDeliveryRatesCrudWithUseFormData() {
    const {
        data,
        submitting,
        loading,
        formOpen,
        setSubmitting,
        handleClose,
        handleEdit,
        handleCreate,
    } = useFormData()

    const { data: paymentsNotFound = [] } = useSWR(
        '/palm-bunches/rea-payments/ticket-data-not-found',
    )

    return (
        <>
            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl="/palm-bunches/rea-payments/datatable"
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getDataRow<PalmBunchesReaPaymentDataType>(dataIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'from_at', direction: 'desc' }}
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginTop: '2rem',
                }}>
                {paymentsNotFound.map((payment: any, index: number) => (
                    <Alert key={index} severity="warning">
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
                ))}
            </div>

            <Dialog
                open={formOpen}
                closeButtonProps={{
                    onClick: handleClose,
                    disabled: loading,
                }}
                title="Pembayaran"
                maxWidth="sm">
                <PalmBunchesReaPaymentForm
                    data={data as PalmBunchesReaPaymentDataType}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onSubmitted={() => {
                        mutate()
                        handleClose()
                    }}
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </Dialog>

            <Fab
                disabled={formOpen}
                onClick={handleCreate}
                color="success"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <BackupTableIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS = [
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
            customBodyRender: toDmy,
        },
    },
    {
        name: 'to_at',
        label: 'Tanggal Tiket Akhir',
        options: {
            customBodyRender: toDmy,
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
