'use client'

// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// types
import type { UUID } from 'crypto'
// vendors
import { useState } from 'react'
// components
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/data-table'
import Fab from '@/components/fab'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import type PalmBunchesReaPaymentDataType from '@/modules/palm-bunch/types/orms/palm-bunches-rea-payment'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'
import PalmBunchesReaPaymentDetailDatatableModal from './detail-datatable'
import PalmBunchesReaPaymentForm from './form'

let getRowData: GetRowDataType<PalmBunchesReaPaymentDataType>
let mutate: MutateType<PalmBunchesReaPaymentDataType>

export default function PageClient() {
    return (
        <FormDataProvider>
            <PalmBunchDeliveryRatesCrudWithUseFormData />
        </FormDataProvider>
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
                    '& .all-paid': {
                        backgroundColor: 'green',
                    },
                    '& tbody td': {
                        whiteSpace: 'nowrap',
                    },
                }}>
                <Datatable
                    apiUrl="palm-bunches/rea-payments/datatable"
                    columns={[
                        ...DATATABLE_COLUMNS,
                        {
                            label: 'Tiket Tidak Ditemukan',
                            name: 'n_details_not_found_on_system',
                            options: {
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
                                            color="warning"
                                            onClick={() =>
                                                setNotFoundDetailsOnPaymentUuid(
                                                    uuid,
                                                )
                                            }
                                            size="small"
                                            variant="outlined">
                                            <Typography
                                                component="span"
                                                fontWeight="bold">
                                                {n_details_not_found_on_system}
                                            </Typography>
                                        </Button>
                                    )
                                },
                                hint: 'Data Tiket dari file Excel REA (farmer name) yang tidak/belum tercatat pada EKBS',
                                searchable: false,
                                sort: false,
                            },
                        },
                        {
                            label: 'Belum Divalidasi',
                            name: 'n_details_unvalidated',
                            options: {
                                customBodyRenderLite: dataIndex => {
                                    const data = getRowData(dataIndex)
                                    const { uuid, n_details_unvalidated } =
                                        data ?? {}

                                    if (!uuid || !n_details_unvalidated)
                                        return ''

                                    return (
                                        <Button
                                            color="warning"
                                            onClick={() =>
                                                setUnvalidatedDetailsPaymentUuid(
                                                    uuid,
                                                )
                                            }
                                            size="small"
                                            variant="outlined">
                                            <Typography
                                                component="span"
                                                fontWeight="bold">
                                                {n_details_unvalidated}
                                            </Typography>
                                        </Button>
                                    )
                                },
                                searchable: false,
                                sort: false,
                            },
                        },
                        {
                            label: 'Data Asinkron',
                            name: 'n_details_unsynced',
                            options: {
                                customBodyRenderLite: dataIndex => {
                                    const data = getRowData(dataIndex)
                                    const { uuid, n_details_unsynced } =
                                        data ?? {}

                                    if (!uuid || !n_details_unsynced) return ''

                                    return (
                                        <Button
                                            color="warning"
                                            onClick={() =>
                                                setUnsyncedDetailsPaymentUuid(
                                                    uuid,
                                                )
                                            }
                                            size="small"
                                            variant="outlined">
                                            <Typography
                                                component="span"
                                                fontWeight="bold">
                                                {n_details_unsynced}
                                            </Typography>
                                        </Button>
                                    )
                                },
                                hint: 'Data Tiket dari file Excel REA (farmer name) tidak cocok dengan tiket yang tercatat pada EKBS',
                                searchable: false,
                                sort: false,
                            },
                        },
                        {
                            label: 'Tiket Lunas',
                            name: 'n_details_has_paid',
                            options: {
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
                                            arrow
                                            placement="top"
                                            title={`${formatNumber(n_details_has_paid)} / ${formatNumber(
                                                n_tickets,
                                            )} Tiket`}>
                                            <Button
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
                                                }
                                                size="small"
                                                variant="outlined">
                                                <Typography
                                                    component="span"
                                                    fontWeight="bold">
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
                                searchable: false,
                                sort: false,
                            },
                        },
                    ]}
                    defaultSortOrder={{ direction: 'desc', name: 'from_at' }}
                    getRowDataCallback={fn => (getRowData = fn)}
                    mutateCallback={fn => (mutate = fn)}
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
                    tableId="PalmBunchDeliveryRateDatatable"
                    title="Riwayat"
                />
            </Box>

            <Dialog
                closeButtonProps={{
                    disabled: loading,
                    onClick: handleClose,
                }}
                maxWidth="sm"
                open={formOpen}
                title="Pembayaran">
                <PalmBunchesReaPaymentForm
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                    data={data as PalmBunchesReaPaymentDataType}
                    loading={loading}
                    onSubmitted={() => {
                        mutate()
                        handleClose()
                    }}
                    setSubmitting={setSubmitting}
                />
            </Dialog>

            <PalmBunchesReaPaymentDetailDatatableModal
                onClose={() => {
                    setNotFoundDetailsOnPaymentUuid(undefined)
                    setUnsyncedDetailsPaymentUuid(undefined)
                    setPaidDetailsOnPaymentUuid(undefined)
                    setUnvalidatedDetailsPaymentUuid(undefined)
                }}
                open={Boolean(
                    notFoundDetailsOnPaymentUuid ??
                        unsyncedDetailsOnPaymentUuid ??
                        paidDetailsOnPaymentUuid ??
                        unvalidatedDetailsOnPaymentUuid,
                )}
                title="Rincian"
                type={
                    notFoundDetailsOnPaymentUuid
                        ? 'not-found'
                        : unsyncedDetailsOnPaymentUuid
                          ? 'unsynced'
                          : paidDetailsOnPaymentUuid
                            ? 'done'
                            : 'unvalidated'
                }
                uuid={
                    notFoundDetailsOnPaymentUuid ??
                    unsyncedDetailsOnPaymentUuid ??
                    paidDetailsOnPaymentUuid ??
                    unvalidatedDetailsOnPaymentUuid
                }
            />

            <Fab in={!formOpen} onClick={handleCreate}>
                <BackupTableIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps<PalmBunchesReaPaymentDataType>['columns'] =
    [
        {
            label: 'uuid',
            name: 'uuid',
            options: {
                display: false,
            },
        },
        {
            label: 'Tanggal Tiket Awal',
            name: 'from_at',
            options: {
                customBodyRender: toDmy,
            },
        },
        {
            label: 'Tanggal Tiket Akhir',
            name: 'to_at',
            options: {
                customBodyRender: toDmy,
            },
        },
        {
            label: 'Nilai Akhir',
            name: 'final_rp',
            options: {
                customBodyRender: (value: number) => numberToCurrency(value),
            },
        },
        {
            label: 'Tanggal Pelunasan oleh REA',
            name: 'transactions.at',
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
