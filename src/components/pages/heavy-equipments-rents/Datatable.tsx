// vendors
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
// types
import type RentItemRent from '@/dataTypes/RentItemRent'
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
import toDmy from '@/utils/toDmy'
// enums
import ApiUrlEnum from '@/components/pages/heavy-equipments-rents/ApiUrlEnum'

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
    const { query, replace } = useRouter()
    const [isClientSideRendered, setIsClientSideRendered] = useState(false)
    const [type, setType] = useState<DataCategory>(
        as === 'operator' ? 'unfinished' : 'all',
    )

    const selectedDate = query.year
        ? dayjs(
              `${query.year ?? CURRENT_DATE.format('YYYY')}-${
                  query.month ?? CURRENT_DATE.format('MM')
              }-01`,
          )
        : null

    let columns = [...DATATABLE_COLUMNS]

    if (as === 'operator') {
        columns = columns.filter(col => col.label !== 'Operator')
    }

    useEffect(() => {
        if (query.year === undefined || query.month === undefined) {
            replace({
                query: {
                    year: CURRENT_DATE.format('YYYY'),
                    month: CURRENT_DATE.format('MM'),
                },
            })
        }

        setIsClientSideRendered(true)
    }, [query.year, query.month, replace])

    return (
        <Box display="flex" gap={3} flexDirection="column">
            <Box display="flex" gap={1} alignItems="center">
                {isClientSideRendered && (
                    <DatePicker
                        label="Bulan"
                        openTo="month"
                        format="MMMM YYYY"
                        value={selectedDate}
                        onAccept={date =>
                            date
                                ? replace({
                                      query: {
                                          year: date?.format('YYYY'),
                                          month: date?.format('MM'),
                                      },
                                  })
                                : undefined
                        }
                        views={['year', 'month']}
                        sx={{
                            mr: 1,
                        }}
                        slotProps={{
                            field: {
                                clearable: true,
                                onClear: () => {
                                    replace({
                                        query: {
                                            year: undefined,
                                            month: undefined,
                                        },
                                    })
                                },
                            },
                            textField: {
                                margin: 'none',
                                size: 'small',
                                fullWidth: false,
                            },
                        }}
                    />
                )}

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
                        onClick={() => setType('unfinished')}
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
