// vendors
import { useRouter } from 'next/router'
import { useState } from 'react'
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
// import WhatsAppButton from '@/components/WhatsappButton'
// utils
import toDmy from '@/utils/toDmy'
import useAuth from '@/providers/Auth'
// enums
import ApiUrlEnum from '@/components/pages/heavy-equipments-rents/ApiUrlEnum'
// import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'
import Role from '@/enums/Role'

let getRowData: GetRowDataType<RentItemRent>
const CURRENT_DATE = dayjs()

export default function HeavyEquipmentRentsDatatable({
    mutateCallback,
    handleRowClick,
    getRowDataCallback,
}: {
    handleRowClick: OnRowClickType
    mutateCallback: DatatableProps<RentItemRent>['mutateCallback']
    getRowDataCallback: DatatableProps<RentItemRent>['getRowDataCallback']
}) {
    const {
        // userHasPermission,
        userHasRole,
    } = useAuth()
    const { query, replace } = useRouter()
    const [type, setType] = useState<'all' | 'unfinished' | 'unfinished-task'>(
        'all',
    )

    const selectedDate = query.year
        ? dayjs(
              `${query.year ?? CURRENT_DATE.format('YYYY')}-${
                  query.month ?? CURRENT_DATE.format('MM')
              }-01`,
          )
        : null

    let columns = [...DATATABLE_COLUMNS]

    // if (!userHasPermission(HeavyEquipmentRent.NOTIFY_OPERATOR)) {
    //     columns = columns.filter(col => col.label !== 'Kirim Tugas')
    // }

    if (
        !userHasRole([
            Role.HEAVY_EQUIPMENT_RENT_ADMIN,
            Role.HEAVY_EQUIPMENT_RENT_MANAGER,
        ])
    ) {
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
            </Box>

            <Datatable
                title="Daftar"
                tableId="unfinished-heavy-equipment-rents-datatable"
                apiUrl={ApiUrlEnum.DATATABLE_DATA}
                apiUrlParams={{
                    year: selectedDate?.format('YYYY') ?? undefined,
                    month: selectedDate?.format('MM') ?? undefined,
                    type: type,
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
        name: 'byUser.name',
        label: 'Penyewa/PJ',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } = getRowData(dataIndex)?.by_user ?? {}

                return id ? `#${id} ${name}` : '-'
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
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                return data?.is_paid
                    ? 'Selesai'
                    : data?.finished_at
                      ? 'Menunggu Pembayaran'
                      : 'Terjadwal'
            },
        },
    },
]
