'use client'

// materials
import InventoryIcon from '@mui/icons-material/Inventory'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
// vendors
import { useState } from 'react'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import Permission from '@/modules/repair-shop/enums/permission'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import formatNumber from '@/utils/format-number'
// page components
import SparePartQtyAdjustmentFormDialog, {
    type CreateFormValues,
} from './spare-part-qty-adjustment-form-dialog'

let getRowData: GetRowDataType<SparePartMovementORM>

export default function Page() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { push } = useRouter()

    const [formValues, setFormValues] = useState<CreateFormValues>()

    function handleClose() {
        setFormValues(undefined)
    }

    return (
        <>
            <PageTitle
                subtitle="Belayan Spare Parts"
                title="Opname Persediaan"
            />

            {/* <Box mb={2}>
                <Button startIcon={<BackupTable />} href="/reports">
                    Laporan
                </Button>
            </Box> */}

            <Datatable
                apiUrl="/repair-shop/spare-parts/qty-adjustments/datatable-data"
                columns={columns}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => {
                    getRowData = fn
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        push(
                            `/repair-shop/spare-part-qty-adjustments/${data.uuid}`,
                        )
                    }
                }}
                tableId="spare-part-qty-adjustments-datatable"
            />

            <SparePartQtyAdjustmentFormDialog
                formValues={formValues}
                onClose={handleClose}
                onSubmitted={uuid =>
                    push(`/repair-shop/spare-part-qty-adjustments/${uuid}`)
                }
            />

            <Fab
                disabled={!!formValues}
                in={isAuthHasPermission(
                    Permission.CREATE_SPARE_PART_QTY_ADJUSTMENT,
                )}
                onClick={() =>
                    setFormValues({
                        at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })
                }
                title="Tambah Opname">
                <InventoryIcon />
            </Fab>
        </>
    )
}

const columns: DatatableProps<SparePartMovementORM>['columns'] = [
    {
        label: 'ID',
        name: 'uuid',
        options: {
            display: 'excluded',
        },
    },

    {
        label: 'Waktu Mulai',
        name: 'at',
        options: {
            customBodyRender: value => dayjs(value).format('YYYY-MM-DD HH:mm'),
        },
    },

    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
        },
    },

    {
        label: 'Jumlah Suku Cadang',
        name: 'n_items',
        options: {
            customBodyRender: value => formatNumber(value),
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Catatan',
        name: 'note',
    },

    {
        label: 'Ditemukan (Rp)',
        name: 'found_rp',
        options: {
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Hilang (Rp)',
        name: 'lost_rp',
        options: {
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Selisih (Rp)',
        name: 'sum_value_rp',
        options: {
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Waktu Selesai',
        name: 'finalized_at',
        options: {
            customBodyRender: value =>
                value ? dayjs(value).format('YYYY-MM-DD HH:mm') : null,
            setCellProps: () => ({
                sx: { color: 'success.main' },
            }),
        },
    },
]
