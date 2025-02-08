import type { UUID } from 'crypto'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type PalmBunchType from '@/dataTypes/PalmBunch'
import type Land from '@/types/Land'
// vendors
import { useRouter } from 'next/router'
import Link from 'next/link'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
// icons-materials
import BackupTable from '@mui/icons-material/BackupTable'
import ReceiptIcon from '@mui/icons-material/Receipt'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    DatatableProps,
    getRowData,
    mutate,
} from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import FormActions from '@/components/Global/Form/Actions'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'
import ListInsideMuiDatatableCell from '@/components/ListInsideMuiDatatableCell'
import ScrollableXBox from '@/components/ScrollableXBox'
// local components
import MainForm from '@/components/PalmBunchesReaTicket/Form'
import PalmBunchApiUrlEnum from '@/components/pages/palm-bunch/ApiUrlEnum'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import useAuth from '@/providers/Auth'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
import Role from '@/enums/Role'
// utils
import formatNumber from '@/utils/formatNumber'
import blinkSxValue from '@/utils/blinkSxValue'

let currentUserUuid: UUID | undefined

export default function Page() {
    const { userHasPermission, user } = useAuth()

    currentUserUuid = user?.uuid

    return (
        <AuthLayout title="Daftar Tiket REA">
            {userHasPermission(PalmBunch.READ_STATISTIC) && (
                <Box mb={4} display="flex" gap={1}>
                    <Button
                        startIcon={<BackupTable />}
                        href="rea-tickets/export"
                        LinkComponent={Link}>
                        Data Tiket
                    </Button>

                    <Button
                        startIcon={<BackupTable />}
                        href="rea-tickets/summary-per-user"
                        LinkComponent={Link}>
                        Data Per Pengguna
                    </Button>
                </Box>
            )}

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

function Crud() {
    const { userHasPermission } = useAuth()
    const { query } = useRouter()

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
            <ScrollableXBox mb={3}>
                <FilterChips />
            </ScrollableXBox>

            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={PalmBunchApiUrlEnum.TICKET_DATATABLE_DATA}
                apiUrlParams={{
                    filter: query.filter as string,
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

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
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
        label: 'TGL',
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
            customBodyRender: (value: Land | undefined) => {
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
            setCellProps: (_, rowIndex) => {
                const isCurrentUserData =
                    getRowData<PalmBunchesReaTicketType>(rowIndex)?.delivery
                        .courier_user?.uuid === currentUserUuid

                return {
                    sx: {
                        whiteSpace: 'nowrap',
                        color: isCurrentUserData ? 'success.main' : undefined,
                        fontWeight: isCurrentUserData ? 'bold' : undefined,
                    },
                }
            },

            customBodyRenderLite: dataIndex => {
                const courier_user =
                    getRowData<PalmBunchesReaTicketType>(dataIndex)?.delivery
                        .courier_user

                return courier_user
                    ? `#${courier_user.id} — ${courier_user.name}`
                    : ''
            },
        },
    },
    {
        name: 'delivery.courierUser.nickname',
        options: {
            sort: false,
            display: 'excluded',
        },
    },
    {
        name: 'delivery.palmBunches.ownerUser.name',
        label: 'Pemilik TBS',
        options: {
            sort: false,
            setCellProps: () => {
                return {
                    sx: {
                        whiteSpace: 'nowrap',
                    },
                }
            },
            customBodyRenderLite: dataIndex => (
                <ListInsideMuiDatatableCell
                    listItems={
                        getRowData<PalmBunchesReaTicketType>(dataIndex)
                            ?.delivery?.palm_bunches ?? []
                    }
                    renderItem={(palmBunch: PalmBunchType) => (
                        <Box
                            component="span"
                            sx={() => ({
                                color:
                                    palmBunch.owner_user?.uuid ===
                                    currentUserUuid
                                        ? 'success.main'
                                        : undefined,
                                fontWeight:
                                    palmBunch.owner_user?.uuid ===
                                    currentUserUuid
                                        ? 'bold'
                                        : undefined,
                            })}>
                            #{palmBunch.owner_user?.id + ' — '}
                            {palmBunch.owner_user?.name + ' '}(
                            {formatNumber(palmBunch.n_kg ?? 0)} kg)
                        </Box>
                    )}
                />
            ),
        },
    },
    {
        name: 'delivery.palmBunches.ownerUser.nickname',
        options: {
            sort: false,
            display: 'excluded',
        },
    },
    {
        name: 'delivery.n_bunches',
        label: 'Janjang',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
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
        label: 'Bobot (kg)',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                },
            }),
            customBodyRenderLite: dataIndex => {
                const data = getRowData<PalmBunchesReaTicketType>(dataIndex)

                if (!data) return ''

                return data.delivery.n_kg
                    ? `${formatNumber(data.delivery.n_kg)}`
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

const SX_FOR_BADGE = {
    ':after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: -3,
        width: '1em',
        height: '1em',
        backgroundColor: 'error.main',
        borderRadius: '50%',
        ...blinkSxValue,
    },
}

function FilterChips() {
    const { userHasRole } = useAuth()
    const { query, replace } = useRouter()
    const filter = query.filter

    const { data: stats } = useSWR<{
        unvalidated: number
        waiting: number
        unsynced: number
    }>(PalmBunchApiUrlEnum.TICKET_FILTERS_STATS)

    return (
        <>
            <Chip
                label="Semua"
                color={!filter ? 'success' : undefined}
                onClick={() =>
                    replace({
                        query: {
                            filter: '',
                        },
                    })
                }
            />

            <div>
                <Collapse
                    in={userHasRole(Role.PALM_BUNCH_MANAGER)}
                    orientation="horizontal">
                    <Chip
                        sx={stats?.unvalidated ? SX_FOR_BADGE : undefined}
                        label={
                            'Belum Divalidasi' +
                            (stats?.unvalidated
                                ? ` (${stats?.unvalidated})`
                                : '')
                        }
                        disabled={!stats?.unvalidated}
                        color={filter === 'unvalidated' ? 'success' : undefined}
                        onClick={() =>
                            replace({
                                query: {
                                    filter: 'unvalidated',
                                },
                            })
                        }
                    />
                </Collapse>
            </div>

            <Chip
                label={
                    'Menunggu REA' +
                    (stats?.waiting ? ` (${stats?.waiting})` : '')
                }
                color={filter === 'waiting' ? 'success' : undefined}
                disabled={!stats?.waiting}
                onClick={() =>
                    replace({
                        query: {
                            filter: 'waiting',
                        },
                    })
                }
            />

            <Chip
                label={
                    'Data Tidak Sinkron' +
                    (stats?.unsynced ? ` (${stats?.unsynced})` : '')
                }
                color={filter === 'unsynced' ? 'success' : undefined}
                disabled={!stats?.unsynced}
                sx={stats?.unsynced ? SX_FOR_BADGE : undefined}
                onClick={() =>
                    replace({
                        query: {
                            filter: 'unsynced',
                        },
                    })
                }
            />
        </>
    )
}
