'use client'

// icons-materials
import BackupTable from '@mui/icons-material/BackupTable'
import InventoryIcon from '@mui/icons-material/Inventory'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
// vendors
import { useState } from 'react'
// parts
import type { CreateFormValues } from '@/app/(auth)/marts/products/opnames/_parts/form'
import FormDialog from '@/app/(auth)/marts/products/opnames/_parts/form-dialog'
import ChipSmall from '@/components/ChipSmall'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
import Mart from '@/enums/permissions/Mart'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// enums
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
import type ProductMovementOpname from '@/modules/mart/types/orms/product-movement-opname'
// utils
import formatNumber from '@/utils/format-number'

let getRowData: GetRowDataType<ProductMovementOpname>

export default function Opnames() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { push } = useRouter()

    const [formValues, setFormValues] = useState<CreateFormValues>()

    function handleClose() {
        setFormValues(undefined)
    }

    return (
        <>
            <PageTitle title="Opname" />
            <Box mb={2}>
                <Button href="opnames/reports" startIcon={<BackupTable />}>
                    Laporan
                </Button>
            </Box>

            <Datatable
                apiUrl={OpnameApiUrl.DATATABLE}
                columns={columns}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        push(`/marts/products/opnames/${data.uuid}`)
                    }
                }}
                tableId="opnames-table"
                title="Daftar Opname Stok"
            />

            <FormDialog
                formValues={formValues}
                onClose={handleClose}
                onSubmitted={uuid => push(`/marts/products/opnames/${uuid}`)}
            />

            <Fab
                disabled={!!formValues}
                in={isAuthHasPermission(Mart.CREATE_OPNAME)}
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

const columns: DatatableProps<ProductMovementOpname>['columns'] = [
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
        label: 'Kategori',
        name: 'details.product_state',
        options: {
            customBodyRenderLite(_, rowIndex) {
                const data = getRowData(rowIndex)

                return (
                    <Box display="flex" flexShrink={0} gap={0.5}>
                        {data?.details
                            .map(detail => detail.product_state?.category_name)
                            .filter((value, index, array) => {
                                return array.indexOf(value) === index
                            })
                            .map(category_name => (
                                <ChipSmall
                                    key={category_name}
                                    label={category_name}
                                />
                            ))}
                    </Box>
                )
            },
        },
    },

    {
        label: 'Jumlah Produk',
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
        name: '',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                return formatNumber(
                    data?.details.reduce(
                        (acc, detail) =>
                            acc +
                            (detail.qty >= 0 ? detail.qty : 0) *
                                (detail.warehouse_state?.cost_rp_per_unit ?? 0),
                        0,
                    ) ?? 0,
                )
            },
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Hilang (Rp)',
        name: '',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                return formatNumber(
                    data?.details.reduce(
                        (acc, detail) =>
                            acc +
                            (detail.qty < 0 ? detail.qty : 0) *
                                (detail.warehouse_state?.cost_rp_per_unit ?? 0),
                        0,
                    ) ?? 0,
                )
            },
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Selisih (Rp)',
        name: '',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                return formatNumber(
                    data?.details.reduce(
                        (acc, detail) =>
                            acc +
                            detail.qty *
                                (detail.warehouse_state?.cost_rp_per_unit ?? 0),
                        0,
                    ) ?? 0,
                )
            },
            searchable: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
            sort: false,
        },
    },

    {
        label: 'Waktu Selesai',
        name: 'finished_at',
        options: {
            customBodyRender: value =>
                value ? dayjs(value).format('YYYY-MM-DD HH:mm') : null,
            setCellProps: () => ({
                sx: { color: 'success.main' },
            }),
        },
    },
]
