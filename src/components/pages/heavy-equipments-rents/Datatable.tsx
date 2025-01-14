// types
import type RentItemRent from '@/dataTypes/RentItemRent'
// materials
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    DatatableProps,
    GetRowDataType,
    OnRowClickType,
} from '@/components/Datatable'
import WhatsAppButton from '@/components/WhatsappButton'
// utils
import toDmy from '@/utils/toDmy'
import useAuth from '@/providers/Auth'
// enums
import ApiUrlEnum from '@/components/pages/heavy-equipments-rents/ApiUrlEnum'
import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'
import Role from '@/enums/Role'
import { DataTableColumnObject } from 'mui-datatable-delight'

let getRowData: GetRowDataType<RentItemRent>

export default function HeavyEquipmentRentsDatatable({
    mutateCallback,
    handleRowClick,
    getRowDataCallback,
    apiUrlParams,
}: {
    handleRowClick: OnRowClickType
    mutateCallback: DatatableProps['mutateCallback']
    getRowDataCallback: DatatableProps['getRowDataCallback']
    apiUrlParams: {
        type: 'unfinished' | '' | 'unfinished-task'
    }
}) {
    const { userHasPermission, userHasRole } = useAuth()

    let columns = [...DATATABLE_COLUMNS]

    if (!userHasPermission(HeavyEquipmentRent.NOTIFY_OPERATOR)) {
        columns = columns.filter(col => col.label !== 'Kirim Tugas')
    }

    if (
        !userHasRole([
            Role.HEAVY_EQUIPMENT_RENT_ADMIN,
            Role.HEAVY_EQUIPMENT_RENT_MANAGER,
        ])
    ) {
        columns = columns.filter(col => col.label !== 'Operator')
    }

    return (
        <Datatable
            title="Daftar"
            tableId="unfinished-heavy-equipment-rents-datatable"
            apiUrl={ApiUrlEnum.DATATABLE_DATA}
            apiUrlParams={apiUrlParams}
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
    )
}

const DATATABLE_COLUMNS: DataTableColumnObject[] = [
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
    {
        name: 'uuid',
        label: 'Kirim Tugas',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const { uuid = '', is_paid = false } =
                    getRowData(dataIndex) ?? {}

                return (
                    <WhatsAppButton
                        endpoint={ApiUrlEnum.NOTIFY_OPERATOR.replace(
                            '$rentItemRentUuid',
                            uuid,
                        )}
                        title="Notifikasi Operator"
                        disabled={is_paid}
                    />
                )
            },
        },
    },
    // {
    //     name: 'uuid',
    //     label: 'Cetak',
    //     options: {
    //         searchable: false,
    //         sort: false,
    //         customBodyRenderLite: uuid => (
    //             <Tooltip title="Cetak" placement="top">
    //                 <span>
    //                     <IconButton size="small">
    //                         <PrintIcon />
    //                     </IconButton>
    //                 </span>
    //             </Tooltip>
    //         ),
    //     },
    // },
]
