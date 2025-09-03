// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import dayjs from 'dayjs'
// types
import type RentItemRent from '@/types/orms/rent-item-rent'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type OnRowClickType,
} from '@/components/Datatable'
import DatePicker from '@/components/DatePicker'
// utils
import toDmy from '@/utils/to-dmy'
// enums
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'

let getRowData: GetRowDataType<RentItemRent>
const CURRENT_DATE = dayjs()

type DataCategory = 'all' | 'unpaid' | 'unfinished'

export default function HeavyEquipmentRentsDatatable({
    mutateCallback,
    handleRowClick,
    getRowDataCallback,
    as,
}: {
    handleRowClick: OnRowClickType
    mutateCallback: DatatableProps<RentItemRent>['mutateCallback']
    getRowDataCallback: DatatableProps<RentItemRent>['getRowDataCallback']
    as: 'admin' | 'operator'
}) {
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const year = searchParams?.get('year') ?? CURRENT_DATE.format('YYYY')
    const month = searchParams?.get('month') ?? CURRENT_DATE.format('MM')

    const [type, setType] = useState<DataCategory>(
        as === 'operator' ? 'unfinished' : 'all',
    )

    const selectedDate = dayjs(`${year}-${month}-01`)

    let columns = [...DATATABLE_COLUMNS]

    if (as === 'operator') {
        columns = columns.filter(col => col.label !== 'Operator')
    }

    return (
        <Box display="flex" gap={3} flexDirection="column">
            <Box display="flex" gap={1} alignItems="center">
                <DatePicker
                    label="Bulan"
                    openTo="month"
                    format="MMMM YYYY"
                    value={selectedDate}
                    onAccept={date => {
                        if (!date) return

                        const newYear = date.format('YYYY')
                        const newMonth = date.format('MM')

                        replace(`?year=${newYear}&month=${newMonth}`)
                    }}
                    views={['year', 'month']}
                    sx={{
                        mr: 1,
                    }}
                    slotProps={{
                        field: {
                            clearable: true,
                            onClear: () => {
                                replace('')
                            },
                        },
                        textField: {
                            margin: 'none',
                            size: 'small',
                            fullWidth: false,
                        },
                    }}
                />

                <Chip
                    color={type === 'all' ? 'success' : undefined}
                    label="Semua"
                    onClick={() => setType('all')}
                />

                <Chip
                    color={type === 'unfinished' ? 'success' : undefined}
                    label="Belum Selesai"
                    onClick={() => setType('unfinished')}
                />

                {as === 'admin' && (
                    <Chip
                        color={type === 'unpaid' ? 'success' : undefined}
                        label="Belum Dibayar"
                        onClick={() => setType('unpaid')}
                    />
                )}
            </Box>

            <Datatable
                title=""
                tableId="unfinished-heavy-equipment-rents-datatable"
                apiUrl={ApiUrlEnum.DATATABLE_DATA}
                apiUrlParams={{
                    as,
                    type,
                    month: selectedDate?.format('MM') ?? undefined,
                    year: selectedDate?.format('YYYY') ?? undefined,
                }}
                onRowClick={handleRowClick}
                columns={columns}
                defaultSortOrder={{
                    name: 'for_at',
                    direction: 'asc',
                }}
                mutateCallback={mutateCallback}
                getRowDataCallback={fn => {
                    getRowData = fn

                    if (getRowDataCallback) {
                        getRowDataCallback(fn)
                    }
                }}
            />
        </Box>
    )
}

const DATATABLE_COLUMNS: DatatableProps<RentItemRent>['columns'] = [
    {
        name: 'uuid',
        label: 'Kode',
        options: {
            customBodyRender: (value: string) =>
                value.substring(value.length - 6).toUpperCase(),
        },
    },
    {
        name: 'for_at',
        label: 'Untuk Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'byUser.id', // <-- hidden / only for search
        label: 'Penyewa/PJ',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        name: 'byUser.name',
        label: 'Penyewa/PJ',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } = getRowData(dataIndex)?.by_user ?? {}

                return id ? `#${id} — ${name}` : '-'
            },
        },
    },
    {
        name: 'farmerGroup.name',
        label: 'KelompoK Tani',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name } = getRowData(dataIndex)?.farmer_group ?? {}

                return name ? name : '-'
            },
        },
    },
    {
        name: 'inventoryItem.code',
        label: 'Kode Alat Berat',
        options: {
            display: 'excluded',
        },
    },
    {
        name: 'inventoryItem.name',
        label: 'Unit Alat Berat',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name, code } =
                    getRowData(dataIndex)?.inventory_item ?? {}

                return (
                    <>
                        {code && (
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                mr={1}>
                                {code}
                            </Typography>
                        )}

                        {name}
                    </>
                )
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
    {
        name: 'heavyEquipmentRent.operatedByUser.name',
        label: 'Operator',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } =
                    getRowData(dataIndex)?.heavy_equipment_rent
                        ?.operated_by_user ?? {}

                return id ? `#${id} ${name}` : '-'
            },
        },
    },
    // {
    //     name: 'uuid',
    //     label: 'Kirim Tugas',
    //     options: {
    //         searchable: false,
    //         sort: false,
    //         customBodyRenderLite: dataIndex => {
    //             const { uuid = '', is_paid = false } =
    //                 getRowData(dataIndex) ?? {}

    //             return (
    //                 <WhatsAppButton
    //                     endpoint={ApiUrlEnum.NOTIFY_OPERATOR.replace(
    //                         '$rentItemRentUuid',
    //                         uuid,
    //                     )}
    //                     title="Notifikasi Operator"
    //                     disabled={is_paid}
    //                 />
    //             )
    //         },
    //     },
    // },
    {
        name: 'uuid',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (_, rowIndex): RentStatus => {
                const data = getRowData(rowIndex)

                return data?.is_paid
                    ? RentStatus.PAID
                    : data?.finished_at
                      ? RentStatus.FINISHED
                      : RentStatus.SCHEDULED
            },
            setCellProps: cellValue => ({
                sx: {
                    color:
                        cellValue === RentStatus.PAID
                            ? 'success.main'
                            : cellValue === RentStatus.FINISHED
                              ? 'warning.main'
                              : 'inherit',
                },
            }),
        },
    },
]

enum RentStatus {
    PAID = 'Lunas',
    FINISHED = 'Pekerjaan Selesai / Menunggu Pembayaran',
    SCHEDULED = 'Terjadwal',
}
