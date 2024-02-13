import type { MUIDataTableColumn } from 'mui-datatables'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type PalmBunchType from '@/dataTypes/PalmBunch'
// vendors
import { FC, useState } from 'react'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// icons
import ReceiptIcon from '@mui/icons-material/Receipt'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import FormActions from '@/components/Global/Form/Actions'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'
// local components
import MainForm from '@/components/PalmBunchesReaTicket/Form'
// providers
import { FormDataProvider } from '@/providers/useFormData'
import useFormData from '@/providers/useFormData'
import useAuth from '@/providers/Auth'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
// utils
import PalmBunchApiUrlEnum from '@/components/pages/palm-bunch/ApiUrlEnum'
import ListInsideMuiDatatableCell from '@/components/ListInsideMuiDatatableCell'
import formatNumber from '@/utils/formatNumber'

export default function PalmBuncesReaTickets() {
    return (
        <AuthLayout title="Daftar Tiket REA">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

const Crud: FC = () => {
    const { userHasPermission } = useAuth()
    const [filter, setFilter] = useState<
        '' | 'not-found' | 'unmatched' | 'unvalidated'
    >('')

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
                    color={filter === '' ? 'success' : undefined}
                    onClick={() => setFilter('')}
                />

                <Chip
                    label="Menunggu Validasi"
                    color={filter === 'unvalidated' ? 'success' : undefined}
                    onClick={() => setFilter('unvalidated')}
                />

                <Chip
                    label="Data pembayaran tidak cocok"
                    color={filter === 'unmatched' ? 'success' : undefined}
                    onClick={() => setFilter('unmatched')}
                />

                <Chip
                    label="Data pembayaran tidak ditemukan"
                    color={filter === 'not-found' ? 'success' : undefined}
                    onClick={() => setFilter('not-found')}
                />
            </Box>

            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={PalmBunchApiUrlEnum.TICKET_DATATABLE_DATA}
                apiUrlParams={{
                    filter,
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchesReaTicketType>(dataIndex)
                        if (data) return handleEdit(data)
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <Dialog
                title={`${isNew ? 'Masukkan' : 'Perbarui'} Data Tiket`}
                maxWidth="sm"
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
                in={userHasPermission(PalmBunch.CREATE_TICKET)}
                disabled={formOpen}
                onClick={handleCreate}>
                <ReceiptIcon />
            </Fab>
        </>
    )
}

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
                getRowData<PalmBunchesReaTicketType>(dataIndex)?.delivery
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
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),

            customBodyRenderLite: dataIndex => {
                const courier_user =
                    getRowData<PalmBunchesReaTicketType>(dataIndex)?.delivery
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
                <ListInsideMuiDatatableCell
                    listItems={
                        getRowData<PalmBunchesReaTicketType>(dataIndex)
                            ?.delivery?.palm_bunches
                    }
                    renderItem={(palmBunch: PalmBunchType) => (
                        <>
                            #{palmBunch.owner_user?.id + ' '}
                            {palmBunch.owner_user?.name + ' '}({palmBunch.n_kg}{' '}
                            kg)
                        </>
                    )}
                />
            ),
        },
    },
    {
        name: 'delivery.n_bunches',
        label: 'Janjang',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<PalmBunchesReaTicketType>(dataIndex)

                if (!data) return ''

                return data.delivery?.n_bunches
                    ? formatNumber(data.delivery.n_bunches)
                    : ''
            },
        },
    },
    {
        name: 'delivery.n_kg',
        label: 'Bobot',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<PalmBunchesReaTicketType>(dataIndex)

                if (!data) return ''

                return data.delivery.n_kg
                    ? `${formatNumber(data.delivery.n_kg)} kg`
                    : ''
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
