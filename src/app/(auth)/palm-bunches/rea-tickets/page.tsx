'use client'

// icons-materials
import BackupTable from '@mui/icons-material/BackupTable'
import ReceiptIcon from '@mui/icons-material/Receipt'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
// vendors
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// local components
import MainForm from '@/app/(auth)/palm-bunches/rea-tickets/_form'
// components
import Datatable, {
    type DataTableProps,
    getRowData,
    mutate,
} from '@/components/data-table'
import UlInsideMuiDatatableCell from '@/components/datatable.ul-inside-cell'
import Fab from '@/components/fab'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'
import Link from '@/components/next-link'
import PageTitle from '@/components/page-title'
import PalmBunchApiUrlEnum from '@/components/pages/palm-bunch/ApiUrlEnum'
import ScrollableXBox from '@/components/scrollable-x-box'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
import Role from '@/enums/role'
// hooks
import useAuthInfo from '@/hooks/use-auth-info'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import type Land from '@/modules/clm/types/orms/land'
import type PalmBunchesReaTicket from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import blinkSxValue from '@/utils/blink-sx-value'
// utils
import formatNumber from '@/utils/format-number'

let currentUserUuid: UUID | undefined

export default function Page() {
    const user = useAuthInfo()
    const isAuthHasPermission = useIsAuthHasPermission()

    currentUserUuid = user?.uuid

    return (
        <>
            <PageTitle title="Daftar Tiket REA" />
            {isAuthHasPermission(PalmBunch.READ_STATISTIC) && (
                <Box display="flex" gap={1} mb={4}>
                    <Button
                        href="rea-tickets/export"
                        LinkComponent={Link}
                        startIcon={<BackupTable />}>
                        Data Tiket
                    </Button>

                    <Button
                        href="rea-tickets/summary-per-user"
                        LinkComponent={Link}
                        startIcon={<BackupTable />}>
                        Data Per Pengguna
                    </Button>
                </Box>
            )}

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </>
    )
}

function Crud() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const searchParams = useSearchParams()

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
    } = useFormData<PalmBunchesReaTicket>()

    return (
        <>
            <ScrollableXBox mb={3}>
                <FilterChips />
            </ScrollableXBox>

            <Datatable
                apiUrl={PalmBunchApiUrlEnum.TICKET_DATATABLE_DATA}
                apiUrlParams={{
                    filter: searchParams?.get('filter') ?? '',
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData<PalmBunchesReaTicket>(dataIndex)
                        if (data) return handleEdit(data)
                    }
                }}
                tableId="PalmBunchDeliveryRateDatatable"
                title="Riwayat"
            />

            <Dialog
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
                maxWidth="sm"
                middleHead={
                    isNew ? (
                        <FormDataDraftsCrud
                            dataKeyForNameId="ticket_no"
                            modelName="PalmBuncesReaTicket"
                        />
                    ) : undefined
                }
                open={formOpen}
                title={`${isNew ? 'Masukkan' : 'Perbarui'} Data Tiket`}>
                <MainForm
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
                    data={data}
                    loading={loading}
                    onSubmitted={() => {
                        mutate()
                        handleClose()
                    }}
                    setSubmitting={setSubmitting}
                />
            </Dialog>

            <Fab
                disabled={formOpen}
                in={isAuthHasPermission(PalmBunch.CREATE_TICKET)}
                onClick={handleCreate}>
                <ReceiptIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'NO. SPB',
        name: 'spb_no',
        options: {
            display: false,
        },
    },
    {
        label: 'NO. VEBEWE',
        name: 'vebewe_no',
        options: {
            display: false,
        },
    },
    {
        label: 'NO. GRADIS',
        name: 'gradis_no',
        options: {
            display: false,
        },
    },
    {
        label: 'NO. TIKET WB',
        name: 'wb_ticket_no',
        options: {
            display: false,
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: (value: string) =>
                dayjs(value).format('DD-MM-YYYY'),
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Pabrik',
        name: 'delivery.to_oil_mill_code',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData<PalmBunchesReaTicket>(dataIndex)?.delivery
                    .to_oil_mill_code,
        },
    },
    {
        label: 'NO. Tiket',
        name: 'ticket_no',
    },
    {
        label: 'Info Land ID',
        name: 'land',
        options: {
            customBodyRender: (value: Land | undefined) => {
                if (!value) return ''

                return `${value.rea_land_id}

                ${value.note ?? ''}`
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Pengangkut',
        name: 'delivery.courierUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const courier_user =
                    getRowData<PalmBunchesReaTicket>(dataIndex)?.delivery
                        .courier_user

                return courier_user
                    ? `#${courier_user.id} — ${courier_user.name}`
                    : ''
            },
            setCellProps: (_, rowIndex) => {
                const isCurrentUserData =
                    getRowData<PalmBunchesReaTicket>(rowIndex)?.delivery
                        .courier_user?.uuid === currentUserUuid

                return {
                    sx: {
                        color: isCurrentUserData ? 'success.main' : undefined,
                        fontWeight: isCurrentUserData ? 'bold' : undefined,
                        whiteSpace: 'nowrap',
                    },
                }
            },
        },
    },
    {
        name: 'delivery.courierUser.nickname',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Pemilik TBS',
        name: 'delivery.palmBunches.ownerUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const palmBunches =
                    getRowData<PalmBunchesReaTicket>(dataIndex)?.delivery
                        ?.palm_bunches ?? []

                return (
                    <UlInsideMuiDatatableCell>
                        {palmBunches.map(palmBunch => (
                            <Box
                                component="li"
                                key={palmBunch.uuid}
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
                        ))}
                    </UlInsideMuiDatatableCell>
                )
            },
            setCellProps: () => {
                return {
                    sx: {
                        whiteSpace: 'nowrap',
                    },
                }
            },
            sort: false,
        },
    },
    {
        name: 'delivery.palmBunches.ownerUser.nickname',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Janjang',
        name: 'delivery.n_bunches',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<PalmBunchesReaTicket>(dataIndex)

                if (!data) return ''

                return data.delivery?.n_bunches
                    ? formatNumber(data.delivery.n_bunches)
                    : ''
            },
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Bobot (kg)',
        name: 'delivery.n_kg',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<PalmBunchesReaTicket>(dataIndex)

                if (!data) return ''

                return data.delivery.n_kg
                    ? `${formatNumber(data.delivery.n_kg)}`
                    : ''
            },
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Status',
        name: 'status',
        options: {
            customBodyRender: (value: string) => (
                <Typography
                    color={value === 'Lunas' ? 'success.main' : 'warning.main'}
                    component="div"
                    variant="body2">
                    {value}
                </Typography>
            ),
            searchable: false,
            sort: false,
        },
    },
]

const SX_FOR_BADGE = {
    ':after': {
        backgroundColor: 'error.main',
        borderRadius: '50%',
        content: '""',
        height: '1em',
        position: 'absolute',
        right: -3,
        top: 0,
        width: '1em',
        ...blinkSxValue,
    },
}

function FilterChips() {
    const isAuthHasRole = useIsAuthHasRole()
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const filter = searchParams?.get('filter')

    function handleTabChange(tab: string) {
        const params = new URLSearchParams(searchParams ?? '')
        params.set('filter', tab)

        replace(`?${params.toString()}`)
    }

    const { data: stats } = useSWR<{
        unvalidated: number
        waiting: number
        unsynced: number
    }>(PalmBunchApiUrlEnum.TICKET_FILTERS_STATS)

    return (
        <>
            <Chip
                color={!filter ? 'success' : undefined}
                label="Semua"
                onClick={() => handleTabChange('')}
            />

            <div>
                <Collapse
                    in={isAuthHasRole(Role.PALM_BUNCH_MANAGER)}
                    orientation="horizontal">
                    <Chip
                        color={filter === 'unvalidated' ? 'success' : undefined}
                        disabled={!stats?.unvalidated}
                        label={
                            'Belum Divalidasi' +
                            (stats?.unvalidated
                                ? ` (${stats?.unvalidated})`
                                : '')
                        }
                        onClick={() => handleTabChange('unvalidated')}
                        sx={stats?.unvalidated ? SX_FOR_BADGE : undefined}
                    />
                </Collapse>
            </div>

            <Chip
                color={filter === 'waiting' ? 'success' : undefined}
                disabled={!stats?.waiting}
                label={
                    'Menunggu REA' +
                    (stats?.waiting ? ` (${stats?.waiting})` : '')
                }
                onClick={() => handleTabChange('waiting')}
            />

            <Chip
                color={filter === 'unsynced' ? 'success' : undefined}
                disabled={!stats?.unsynced}
                label={
                    'Data Tidak Sinkron' +
                    (stats?.unsynced ? ` (${stats?.unsynced})` : '')
                }
                onClick={() => handleTabChange('unsynced')}
                sx={stats?.unsynced ? SX_FOR_BADGE : undefined}
            />
        </>
    )
}
