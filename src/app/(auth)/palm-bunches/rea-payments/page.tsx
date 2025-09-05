'use client'

// types
import type { UUID } from 'crypto'
import type PalmBunchesReaPaymentDataType from '@/modules/palm-bunch/types/orms/palm-bunches-rea-payment'
// vendors
import { useState } from 'react'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import FormActions from '@/components/Global/Form/Actions'
import PalmBunchesReaPaymentForm from '@/components/PalmBunchesReaPayment/Form'
import PalmBuncesReaPaymentDetailDatatableModal from '@/components/PalmBunchesReaPayment/DetailDatatable'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
// utils
import toDmy from '@/utils/to-dmy'
import ApiUrlEnum from '@/components/PalmBunchesReaPayment/ApiUrlEnum'
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import PageTitle from '@/components/page-title'

let getRowData: GetRowDataType<PalmBunchesReaPaymentDataType>
let mutate: MutateType<PalmBunchesReaPaymentDataType>

export default function PalmBuncesReaPaymentsPage() {
    return (
        <>
            <PageTitle title="Pembayaran dari REA" />
            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </>
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
    const [unvalidatedDetailsOnPaymentUuid, setUnvalidatedDetailsPaymentUuid] =
        useState<UUID>()
    const [unsyncedDetailsOnPaymentUuid, setUnsyncedDetailsPaymentUuid] =
        useState<UUID>()
    const [paidDetailsOnPaymentUuid, setPaidDetailsOnPaymentUuid] =
        useState<UUID>()

    return (
        <>
            <Box
                sx={{
                    '& tbody td': {
                        whiteSpace: 'nowrap',
                    },
                    '& .all-paid': {
                        backgroundColor: 'green',
                    },
                }}>
                <Datatable
                    title="Riwayat"
                    tableId="PalmBunchDeliveryRateDatatable"
                    apiUrl={ApiUrlEnum.REA_PAYMENT_DATATABLE}
                    onRowClick={
                        !notFoundDetailsOnPaymentUuid &&
                        !unsyncedDetailsOnPaymentUuid &&
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
                                    const {
                                        uuid,
                                        n_details_not_found_on_system,
                                    } = getRowData(dataIndex) ?? {}

                                    if (
                                        !uuid ||
                                        !n_details_not_found_on_system ||
                                        n_details_not_found_on_system == 0
                                    )
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
                                            <Typography
                                                fontWeight="bold"
                                                component="span">
                                                {n_details_not_found_on_system}
                                            </Typography>
                                        </Button>
                                    )
                                },
                                hint: 'Data Tiket dari file Excel REA (farmer name) yang tidak/belum tercatat pada EKBS',
                            },
                        },
                        {
                            name: 'n_details_unvalidated',
                            label: 'Belum Divalidasi',
                            options: {
                                sort: false,
                                searchable: false,
                                customBodyRenderLite: dataIndex => {
                                    const data = getRowData(dataIndex)
                                    const { uuid, n_details_unvalidated } =
                                        data ?? {}

                                    if (!uuid || !n_details_unvalidated)
                                        return ''

                                    return (
                                        <Button
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            onClick={() =>
                                                setUnvalidatedDetailsPaymentUuid(
                                                    uuid,
                                                )
                                            }>
                                            <Typography
                                                fontWeight="bold"
                                                component="span">
                                                {n_details_unvalidated}
                                            </Typography>
                                        </Button>
                                    )
                                },
                            },
                        },
                        {
                            name: 'n_details_unsynced',
                            label: 'Data Asinkron',
                            options: {
                                sort: false,
                                searchable: false,
                                customBodyRenderLite: dataIndex => {
                                    const data = getRowData(dataIndex)
                                    const { uuid, n_details_unsynced } =
                                        data ?? {}

                                    if (!uuid || !n_details_unsynced) return ''

                                    return (
                                        <Button
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            onClick={() =>
                                                setUnsyncedDetailsPaymentUuid(
                                                    uuid,
                                                )
                                            }>
                                            <Typography
                                                fontWeight="bold"
                                                component="span">
                                                {n_details_unsynced}
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

                                    const {
                                        uuid,
                                        n_details_has_paid,
                                        n_tickets,
                                    } = data ?? {}

                                    if (
                                        !uuid ||
                                        !n_details_has_paid ||
                                        !n_tickets
                                    )
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
                                                    n_details_has_paid ===
                                                    n_tickets
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                                onClick={() =>
                                                    setPaidDetailsOnPaymentUuid(
                                                        uuid,
                                                    )
                                                }>
                                                <Typography
                                                    fontWeight="bold"
                                                    component="span">
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
                    setRowProps={(_, dataIndex) => {
                        const { n_tickets, n_details_has_paid } =
                            getRowData(dataIndex) ?? {}

                        if (!n_tickets || !n_details_has_paid) return {}

                        return {
                            sx:
                                n_tickets === n_details_has_paid
                                    ? { '& td': { color: 'GrayText' } }
                                    : undefined,
                        }
                    }}
                />
            </Box>

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

            <PalmBuncesReaPaymentDetailDatatableModal
                uuid={
                    notFoundDetailsOnPaymentUuid ??
                    unsyncedDetailsOnPaymentUuid ??
                    paidDetailsOnPaymentUuid ??
                    unvalidatedDetailsOnPaymentUuid
                }
                title="Rincian"
                open={Boolean(
                    notFoundDetailsOnPaymentUuid ??
                        unsyncedDetailsOnPaymentUuid ??
                        paidDetailsOnPaymentUuid ??
                        unvalidatedDetailsOnPaymentUuid,
                )}
                onClose={() => {
                    setNotFoundDetailsOnPaymentUuid(undefined)
                    setUnsyncedDetailsPaymentUuid(undefined)
                    setPaidDetailsOnPaymentUuid(undefined)
                    setUnvalidatedDetailsPaymentUuid(undefined)
                }}
                type={
                    notFoundDetailsOnPaymentUuid
                        ? 'not-found'
                        : unsyncedDetailsOnPaymentUuid
                          ? 'unsynced'
                          : paidDetailsOnPaymentUuid
                            ? 'done'
                            : 'unvalidated'
                }
            />

            <Fab in={!formOpen} onClick={handleCreate}>
                <BackupTableIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<PalmBunchesReaPaymentDataType>['columns'] =
    [
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
                customBodyRender: (value: number) => numberToCurrency(value),
            },
        },
        {
            name: 'transactions.at',
            label: 'Tanggal Pelunasan oleh REA',
            options: {
                customBodyRenderLite: dataIndex => {
                    const data = getRowData(dataIndex)

                    if (
                        !data ||
                        !data.transactions ||
                        data.transactions.length < 0
                    )
                        return ''

                    return data.transactions[0]
                        ? toDmy(data.transactions[0].at)
                        : ''
                },
            },
        },
    ]
