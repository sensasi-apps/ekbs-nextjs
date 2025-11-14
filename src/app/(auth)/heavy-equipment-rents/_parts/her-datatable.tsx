// vendors

// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
// enums
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type OnRowClickType,
} from '@/components/Datatable'
import DatePicker from '@/components/date-picker'
// types
import type RentItemRent from '@/types/orms/rent-item-rent'
// utils
import toDmy from '@/utils/to-dmy'

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
        <Box display="flex" flexDirection="column" gap={3}>
            <Box alignItems="center" display="flex" gap={1}>
                <DatePicker
                    format="MMMM YYYY"
                    label="Bulan"
                    onAccept={date => {
                        if (!date) return

                        const newYear = date.format('YYYY')
                        const newMonth = date.format('MM')

                        replace(`?year=${newYear}&month=${newMonth}`)
                    }}
                    openTo="month"
                    slotProps={{
                        field: {
                            clearable: true,
                            onClear: () => replace('?'),
                        },
                        textField: {
                            fullWidth: false,
                            margin: 'none',
                            size: 'small',
                        },
                    }}
                    sx={{
                        mr: 1,
                    }}
                    value={selectedDate}
                    views={['year', 'month']}
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
                apiUrl={ApiUrlEnum.DATATABLE_DATA}
                apiUrlParams={{
                    as,
                    month: selectedDate?.format('MM') ?? undefined,
                    type,
                    year: selectedDate?.format('YYYY') ?? undefined,
                }}
                columns={columns}
                defaultSortOrder={{
                    direction: 'asc',
                    name: 'for_at',
                }}
                getRowDataCallback={fn => {
                    getRowData = fn

                    if (getRowDataCallback) {
                        getRowDataCallback(fn)
                    }
                }}
                mutateCallback={mutateCallback}
                onRowClick={handleRowClick}
                tableId="unfinished-heavy-equipment-rents-datatable"
                title=""
            />
        </Box>
    )
}

const DATATABLE_COLUMNS: DatatableProps<RentItemRent>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: (value: string) =>
                value.substring(value.length - 6).toUpperCase(),
        },
    },
    {
        label: 'Untuk Tanggal',
        name: 'for_at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Penyewa/PJ',
        name: 'byUser.id', // <-- hidden / only for search
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Penyewa/PJ',
        name: 'byUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } = getRowData(dataIndex)?.by_user ?? {}

                return id ? `#${id} — ${name}` : '-'
            },
        },
    },
    {
        label: 'KelompoK Tani',
        name: 'farmerGroup.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name } = getRowData(dataIndex)?.farmer_group ?? {}

                return name ? name : '-'
            },
        },
    },
    {
        label: 'Kode Alat Berat',
        name: 'inventoryItem.code',
        options: {
            display: 'excluded',
        },
    },
    {
        label: 'Unit Alat Berat',
        name: 'inventoryItem.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name, code } =
                    getRowData(dataIndex)?.inventory_item ?? {}

                return (
                    <>
                        {code && (
                            <Typography
                                color="textSecondary"
                                mr={1}
                                variant="caption">
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
        label: 'Catatan',
        name: 'note',
    },
    {
        label: 'Operator',
        name: 'heavyEquipmentRent.operatedByUser.name',
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
        label: 'Status',
        name: 'uuid',
        options: {
            customBodyRender: (_, rowIndex): RentStatus => {
                const data = getRowData(rowIndex)

                return data?.is_paid
                    ? RentStatus.PAID
                    : data?.finished_at
                      ? RentStatus.FINISHED
                      : RentStatus.SCHEDULED
            },
            searchable: false,
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
            sort: false,
        },
    },
]

enum RentStatus {
    PAID = 'Lunas',
    FINISHED = 'Pekerjaan Selesai / Menunggu Pembayaran',
    SCHEDULED = 'Terjadwal',
}
