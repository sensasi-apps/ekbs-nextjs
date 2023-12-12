import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesReaTickets() {
    return (
        <AuthLayout title="Daftar Tiket REA">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'

import { FC, useState } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'

import ReceiptIcon from '@mui/icons-material/Receipt'

import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'

import MainForm from '@/components/PalmBunchesReaTicket/Form'
import useFormData from '@/providers/useFormData'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'

const Crud: FC = () => {
    const [filter, setFilter] = useState<string | undefined>()

    const {
        data,
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isDirty,
        isNew,
        loading,
        setSubmitting,
        submitting,
    } = useFormData<PalmBunchesReaTicketType>()

    return (
        <>
            <Box
                sx={{
                    overflowX: 'auto',
                }}
                mb={3}
                display="flex"
                gap={1}>
                <Chip
                    label="Semua"
                    color={filter === undefined ? 'success' : undefined}
                    onClick={() => setFilter(undefined)}
                />

                <Chip
                    label="Data pembayaran tidak cocok"
                    color={
                        filter === 'filter=unmatched' ? 'success' : undefined
                    }
                    onClick={() => setFilter('filter=unmatched')}
                />

                <Chip
                    label="Data pembayaran tidak ditemukan"
                    color={
                        filter === 'filter=not-found' ? 'success' : undefined
                    }
                    onClick={() => setFilter('filter=not-found')}
                />
            </Box>

            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={'/palm-bunches/rea-tickets/datatable?' + (filter || '')}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getDataRow<PalmBunchesReaTicketType>(dataIndex)
                        if (data) return handleEdit(data)
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <Dialog
                title={`${isNew ? 'Masukkan' : 'Perbarui'} Data Pengangkutan`}
                maxWidth="lg"
                open={formOpen}
                closeButtonProps={{
                    onClick: () => {
                        if (
                            isDirty &&
                            !window.confirm(
                                'Perubahan belum tersimpan, yakin ingin membatalkan?',
                            )
                        ) {
                            return
                        }

                        return handleClose()
                    },
                }}
                middleHead={
                    isNew ? (
                        <FormDataDraftsCrud
                            modelName="PalmBuncesReaTicket"
                            dataKeyForNameId="ticket_no"
                        />
                    ) : undefined
                }>
                <MainForm
                    data={data}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onSubmitted={() => {
                        mutate()
                        handleClose()
                    }}
                    actionsSlot={
                        <FormActions
                            onCancel={() => {
                                if (
                                    isDirty &&
                                    !window.confirm(
                                        'Perubahan belum tersimpan, yakin ingin membatalkan?',
                                    )
                                ) {
                                    return
                                }

                                return handleClose()
                            }}
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
                <ReceiptIcon />
            </Fab>
        </>
    )
}

import type { MUIDataTableColumn } from 'mui-datatables'

import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import Typography from '@mui/material/Typography'
import numericFormatDefaultProps from '@/utils/numericFormatDefaultProps'

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'spb_no',
        label: 'NO. SPB',
        options: {
            display: false,
        },
    },
    {
        name: 'vebewe_no',
        label: 'NO. VEBEWE',
        options: {
            display: false,
        },
    },
    {
        name: 'gradis_no',
        label: 'NO. GRADIS',
        options: {
            display: false,
        },
    },
    {
        name: 'wb_ticket_no',
        label: 'NO. TIKET WB',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: string) =>
                dayjs(value).format('DD-MM-YYYY'),
        },
    },
    {
        name: 'delivery.to_oil_mill_code',
        label: 'Pabrik',
        options: {
            customBodyRenderLite: dataIndex =>
                getDataRow<PalmBunchesReaTicketType>(dataIndex)?.delivery
                    .to_oil_mill_code,
        },
    },
    {
        name: 'ticket_no',
        label: 'NO. Tiket',
    },
    {
        name: 'land',
        label: 'Info Land ID',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: any) => {
                if (!value) return ''

                return `${value.rea_land_id}

                ${value.note ?? ''}`
            },
        },
    },
    {
        name: 'delivery.courierUser.name',
        label: 'Pengangkut',
        options: {
            customBodyRenderLite: dataIndex => {
                const courier_user =
                    getDataRow<PalmBunchesReaTicketType>(dataIndex)?.delivery
                        .courier_user

                return courier_user
                    ? `#${courier_user.id} ${courier_user.name}`
                    : ''
            },
        },
    },
    {
        name: 'delivery.palmBunches.ownerUser.name',
        label: 'Pemilik TBS',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => (
                <ul
                    style={{
                        margin: 0,
                        paddingLeft: '1em',
                    }}>
                    {getDataRow<PalmBunchesReaTicketType>(
                        dataIndex,
                    )?.delivery?.palm_bunches?.map(
                        (palmBunches: any, index: number) => (
                            <li key={index} style={{ marginBottom: `.5em` }}>
                                #{palmBunches.owner_user?.id + ' '}
                                {palmBunches.owner_user?.name + ' '}(
                                {palmBunches.n_kg} kg)
                            </li>
                        ),
                    )}
                </ul>
            ),
        },
    },
    {
        name: 'delivery.n_bunches',
        label: 'Janjang',
        options: {
            customBodyRenderLite(dataIndex) {
                return (
                    <NumericFormat
                        {...numericFormatDefaultProps}
                        value={
                            getDataRow<PalmBunchesReaTicketType>(dataIndex)
                                ?.delivery.n_bunches
                        }
                        displayType="text"
                    />
                )
            },
        },
    },
    {
        name: 'delivery.n_kg',
        label: 'Bobot',
        options: {
            customBodyRenderLite(dataIndex) {
                return (
                    <NumericFormat // TODO: use formatNumber instead NumericFormat
                        {...numericFormatDefaultProps}
                        value={
                            getDataRow<PalmBunchesReaTicketType>(dataIndex)
                                ?.delivery.n_kg
                        }
                        suffix=" kg"
                        displayType="text"
                    />
                )
            },
        },
    },
    {
        name: 'net_rp',
        label: 'Pembayaran REA',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: null | number) => {
                if (value === null) return '-'

                return (
                    <NumericFormat
                        {...numericFormatDefaultProps}
                        value={value}
                        prefix="Rp "
                        displayType="text"
                    />
                )
            },
        },
    },
    {
        name: 'status',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: string) => (
                <Typography
                    color={value === 'Lunas' ? 'success.main' : 'warning.main'}
                    variant="body2"
                    component="div">
                    {value}
                </Typography>
            ),
        },
    },
]
