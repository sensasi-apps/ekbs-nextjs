// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type PalmBunchesReaPaymentDataType from '@/dataTypes/PalmBunchesReaPayment'
// vendors
import { useState } from 'react'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import FormActions from '@/components/Global/Form/Actions'
import NumericFormat from '@/components/Global/NumericFormat'
import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form'
import PalmBuncesReaPaymentDetailDatatableModal from '@/components/PalmBunchesReaPayment/DetailDatatable'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
// utils
import toDmy from '@/utils/toDmy'
import ApiUrlEnum from '../../components/PalmBunchesReaPayment/ApiUrlEnum'
import formatNumber from '@/utils/formatNumber'

export default function PalmBuncesReaPaymentsPage() {
    return (
        <AuthLayout title="Pembayaran dari REA">
            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </AuthLayout>
    )
}

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

    return (
        <>
            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={ApiUrlEnum.REA_PAYMENT_DATATABLE}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchesReaPaymentDataType>(dataIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'from_at', direction: 'desc' }}
            />

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

            <Fab in={!formOpen} onClick={handleCreate}>
                <BackupTableIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
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
        name: 'transactions.at',
        label: 'Tanggal Pelunasan oleh REA',
        options: {
            customBodyRenderLite: dataIndex => {
                const data =
                    getRowData<PalmBunchesReaPaymentDataType>(dataIndex)

                if (!data) return ''

                return data.transactions[0]
                    ? toDmy(data.transactions[0].at)
                    : ''
            },
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
        name: 'n_details_not_found_on_system',
        label: 'Tiket Tidak Ditemukan',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data =
                    getRowData<PalmBunchesReaPaymentDataType>(dataIndex)

                if (!data) return ''

                return <DetailNotFoundCell data={data} />
            },
            hint: 'Data Tiket dari file Excel REA (farmer name) yang tidak/belum tercatat pada EKBS',
        },
    },
    {
        name: 'n_details_not_found_on_system',
        label: 'Tiket Tidak Cocok',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data =
                    getRowData<PalmBunchesReaPaymentDataType>(dataIndex)

                if (!data) return ''

                return <DetailIncorrectCell data={data} />
            },
            hint: 'Data Tiket dari file Excel REA (farmer name) tidak cocok dengan tiket yang tercatat pada EKBS',
        },
    },
    {
        name: 'n_details_has_paid',
        label: 'Tiket Lunas',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data =
                    getRowData<PalmBunchesReaPaymentDataType>(dataIndex)

                if (!data) return ''

                return <DetailDoneCell data={data} />
            },
        },
    },
]

function DetailNotFoundCell({ data }: { data: PalmBunchesReaPaymentDataType }) {
    const [isOpen, setIsOpen] = useState(false)

    const { uuid, n_details_not_found_on_system } = data

    if (!n_details_not_found_on_system) return ''

    return (
        <>
            <Button
                size="small"
                color="warning"
                onClick={() => setIsOpen(true)}>
                <Typography color="warning.main" fontWeight="bold">
                    {n_details_not_found_on_system}
                </Typography>
            </Button>

            <PalmBuncesReaPaymentDetailDatatableModal
                uuid={uuid}
                title="Rincian"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                type="not-found"
            />
        </>
    )
}

function DetailIncorrectCell({
    data,
}: {
    data: PalmBunchesReaPaymentDataType
}) {
    const [isOpen, setIsOpen] = useState(false)

    const { uuid, n_details_incorrect } = data

    if (!n_details_incorrect) return ''

    return (
        <>
            <Button
                size="small"
                color="warning"
                onClick={() => setIsOpen(true)}>
                <Typography color="warning.main" fontWeight="bold">
                    {n_details_incorrect}
                </Typography>
            </Button>

            <PalmBuncesReaPaymentDetailDatatableModal
                uuid={uuid}
                title="Rincian"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                type="incorrect"
            />
        </>
    )
}

function DetailDoneCell({ data }: { data: PalmBunchesReaPaymentDataType }) {
    const [isOpen, setIsOpen] = useState(false)

    const { uuid, n_details_has_paid, n_tickets } = data

    return (
        <>
            <Tooltip
                title={`${formatNumber(n_details_has_paid)} / ${formatNumber(
                    n_tickets,
                )} Tiket`}
                arrow
                placement="top">
                <Button
                    size="small"
                    color="warning"
                    onClick={() => setIsOpen(true)}>
                    <Typography color="warning.main" fontWeight="bold">
                        {((n_details_has_paid / n_tickets) * 100).toFixed(0)}%
                    </Typography>
                </Button>
            </Tooltip>

            <PalmBuncesReaPaymentDetailDatatableModal
                uuid={uuid}
                title="Rincian"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                type="done"
            />
        </>
    )
}
