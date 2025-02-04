// vendors
import type { MUIDataTableColumn } from 'mui-datatables'
import { useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// icons-materials
import BackupTable from '@mui/icons-material/BackupTable'
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import Datatable, { type GetRowDataType } from '@/components/Datatable'
import Fab from '@/components/Fab'
// layouts
import type { CreateFormValues } from '@/components/pages/marts/products/opnames/Form'
import type ProductMovementOpname from '@/@types/Data/Mart/Product/MovementOpname'
import AuthLayout from '@/components/Layouts/AuthLayout'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
import Mart from '@/enums/permissions/Mart'
import useAuth from '@/providers/Auth'
import FormDialog from '@/components/pages/marts/products/opnames/FormDialog'
import ChipSmall from '@/components/ChipSmall'
import formatNumber from '@/utils/formatNumber'

let getRowData: GetRowDataType<ProductMovementOpname>

export default function Opnames() {
    const { userHasPermission } = useAuth()
    const { push } = useRouter()

    const [formValues, setFormValues] = useState<CreateFormValues>()

    function handleClose() {
        setFormValues(undefined)
    }

    return (
        <AuthLayout title="Opname">
            <Box mb={2}>
                <Button startIcon={<BackupTable />} href="opnames/reports">
                    Laporan
                </Button>
            </Box>

            <Datatable
                apiUrl={OpnameApiUrl.DATATABLE}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        push('opnames/' + data.uuid)
                    }
                }}
                tableId="opnames-table"
                title="Daftar Opname Stok"
                columns={columns}
            />

            <FormDialog
                formValues={formValues}
                onSubmitted={uuid => push('opnames/' + uuid)}
                onClose={handleClose}
            />

            <Fab
                in={userHasPermission(Mart.CREATE_OPNAME)}
                disabled={!!formValues}
                onClick={() =>
                    setFormValues({
                        at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })
                }
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </AuthLayout>
    )
}

const columns: MUIDataTableColumn[] = [
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
        name: 'details.product_state',
        label: 'Kategori',
        options: {
            customBodyRenderLite(dataIndex, rowIndex) {
                const data = getRowData(rowIndex)

                return (
                    <Box display="flex" gap={0.5} flexShrink={0}>
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
        name: 'n_items',
        label: 'Jumlah Produk',
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
        name: '',
        label: 'Ditemukan (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
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
        },
    },

    {
        name: '',
        label: 'Hilang (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
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
        },
    },

    {
        name: '',
        label: 'Selisih (Rp)',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                sx: { textAlign: 'right' },
            }),
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
        },
    },

    {
        name: 'finished_at',
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
