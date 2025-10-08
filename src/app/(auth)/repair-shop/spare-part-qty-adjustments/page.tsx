'use client'

// vendors
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
// materials
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
// utils
import formatNumber from '@/utils/format-number'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// page components
import SparePartQtyAdjustmentFormDialog, {
    type CreateFormValues,
} from './spare-part-qty-adjustment-form-dialog'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
import Permission from '@/modules/repair-shop/enums/permission'

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
                title="Opname Persediaan"
                subtitle="Belayan Spare Parts"
            />

            {/* <Box mb={2}>
                <Button startIcon={<BackupTable />} href="/reports">
                    Laporan
                </Button>
            </Box> */}

            <Datatable
                apiUrl="/repair-shop/spare-parts/qty-adjustments/datatable-data"
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
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
                columns={columns}
            />

            <SparePartQtyAdjustmentFormDialog
                formValues={formValues}
                onSubmitted={uuid =>
                    push(`/repair-shop/spare-part-qty-adjustments/${uuid}`)
                }
                onClose={handleClose}
            />

            <Fab
                in={isAuthHasPermission(
                    Permission.CREATE_SPARE_PART_QTY_ADJUSTMENT,
                )}
                disabled={!!formValues}
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
        name: 'uuid',
        label: 'ID',
        options: {
            display: 'excluded',
        },
    },

    {
        name: 'at',
        label: 'Waktu Mulai',
        options: {
            customBodyRender: value => dayjs(value).format('YYYY-MM-DD HH:mm'),
        },
    },

    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            searchable: false,
        },
    },

    {
        name: 'n_items',
        label: 'Jumlah Suku Cadang',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            customBodyRender: value => formatNumber(value),
        },
    },

    {
        name: 'note',
        label: 'Catatan',
    },

    {
        name: 'found_rp',
        label: 'Ditemukan (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
        },
    },

    {
        name: 'lost_rp',
        label: 'Hilang (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
        },
    },

    {
        name: 'sum_value_rp',
        label: 'Selisih (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
        },
    },

    {
        name: 'finalized_at',
        label: 'Waktu Selesai',
        options: {
            customBodyRender: value =>
                value ? dayjs(value).format('YYYY-MM-DD HH:mm') : null,
            setCellProps: () => ({
                sx: { color: 'success.main' },
            }),
        },
    },
]
