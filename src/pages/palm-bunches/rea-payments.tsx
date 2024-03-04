// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type { UUID } from 'crypto'
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
import Datatable, { GetRowDataType, MutateType } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import FormActions from '@/components/Global/Form/Actions'
import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form'
import PalmBuncesReaPaymentDetailDatatableModal from '@/components/PalmBunchesReaPayment/DetailDatatable'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
// utils
import toDmy from '@/utils/toDmy'
import ApiUrlEnum from '../../components/PalmBunchesReaPayment/ApiUrlEnum'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

let getRowData: GetRowDataType<PalmBunchesReaPaymentDataType>
let mutate: MutateType<PalmBunchesReaPaymentDataType>

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

    const [notFoundDetailsOnPaymentUuid, setNotFoundDetailsOnPaymentUuid] =
        useState<UUID>()
    const [incorrectDetailsOnPaymentUuid, setIncorrectDetailsPaymentUuid] =
        useState<UUID>()
    const [paidDetailsOnPaymentUuid, setPaidDetailsOnPaymentUuid] =
        useState<UUID>()

    return (
        <>
            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={ApiUrlEnum.REA_PAYMENT_DATATABLE}
                onRowClick={
                    !notFoundDetailsOnPaymentUuid &&
                    !incorrectDetailsOnPaymentUuid &&
                    !paidDetailsOnPaymentUuid
                        ? (_, { dataIndex }, event) => {
                              if (event.detail === 2) {
                                  const data = getRowData(dataIndex)
                                  if (!data) return

                                  return handleEdit(data)
                              }
                          }
                        : undefined
                }
                columns={[
                    ...DATATABLE_COLUMNS,
                    {
                        name: 'n_details_not_found_on_system',
                        label: 'Tiket Tidak Ditemukan',
                        options: {
                            sort: false,
                            searchable: false,
                            customBodyRenderLite: dataIndex => {
                                const { uuid, n_details_not_found_on_system } =
                                    getRowData(dataIndex) ?? {}

                                if (!uuid || !n_details_not_found_on_system)
                                    return ''

                                return (
                                    <Button
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                        onClick={() =>
                                            setNotFoundDetailsOnPaymentUuid(
                                                uuid,
                                            )
                                        }>
                                        <Typography fontWeight="bold">
                                            {n_details_not_found_on_system}
                                        </Typography>
                                    </Button>
                                )
                            },
                            hint: 'Data Tiket dari file Excel REA (farmer name) yang tidak/belum tercatat pada EKBS',
                        },
                    },
                    {
                        name: 'n_details_incorrect_on_system',
                        label: 'Tiket Tidak Cocok',
                        options: {
                            sort: false,
                            searchable: false,
                            customBodyRenderLite: dataIndex => {
                                const data = getRowData(dataIndex)
                                const { uuid, n_details_incorrect } = data ?? {}

                                if (!uuid || !n_details_incorrect) return ''

                                return (
                                    <Button
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                        onClick={() =>
                                            setIncorrectDetailsPaymentUuid(uuid)
                                        }>
                                        <Typography fontWeight="bold">
                                            {n_details_incorrect}
                                        </Typography>
                                    </Button>
                                )
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
                                const data = getRowData(dataIndex)

                                const { uuid, n_details_has_paid, n_tickets } =
                                    data ?? {}

                                if (!uuid || !n_details_has_paid || !n_tickets)
                                    return ''

                                return (
                                    <Tooltip
                                        title={`${formatNumber(n_details_has_paid)} / ${formatNumber(
                                            n_tickets,
                                        )} Tiket`}
                                        arrow
                                        placement="top">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color={
                                                n_details_has_paid === n_tickets
                                                    ? 'success'
                                                    : 'warning'
                                            }
                                            onClick={() =>
                                                setPaidDetailsOnPaymentUuid(
                                                    uuid,
                                                )
                                            }>
                                            <Typography fontWeight="bold">
                                                {Math.floor(
                                                    (n_details_has_paid /
                                                        n_tickets) *
                                                        100,
                                                )}
                                                %
                                            </Typography>
                                        </Button>
                                    </Tooltip>
                                )
                            },
                        },
                    },
                ]}
                defaultSortOrder={{ name: 'from_at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
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

            {notFoundDetailsOnPaymentUuid && (
                <PalmBuncesReaPaymentDetailDatatableModal
                    uuid={notFoundDetailsOnPaymentUuid}
                    title="Rincian"
                    open={true}
                    onClose={() => setNotFoundDetailsOnPaymentUuid(undefined)}
                    type="not-found"
                />
            )}

            {incorrectDetailsOnPaymentUuid && (
                <PalmBuncesReaPaymentDetailDatatableModal
                    uuid={incorrectDetailsOnPaymentUuid}
                    title="Rincian"
                    open={true}
                    onClose={() => setIncorrectDetailsPaymentUuid(undefined)}
                    type="incorrect"
                />
            )}

            {paidDetailsOnPaymentUuid && (
                <PalmBuncesReaPaymentDetailDatatableModal
                    uuid={paidDetailsOnPaymentUuid}
                    title="Rincian"
                    open={Boolean(paidDetailsOnPaymentUuid)}
                    onClose={() => setPaidDetailsOnPaymentUuid(undefined)}
                    type="done"
                />
            )}

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
                const data = getRowData(dataIndex)

                if (!data || !data.transactions || data.transactions.length < 0)
                    return ''

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
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
]
