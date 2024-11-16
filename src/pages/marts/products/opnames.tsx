// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductMovementOpname from '@/@types/Data/Mart/Product/MovementOpname'
// vendors
import { useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
// components
import Datatable, { GetRowDataType } from '@/components/Datatable'
import Fab from '@/components/Fab'
// layouts
import AuthLayout from '@/components/Layouts/AuthLayout'

import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
import Mart from '@/enums/permissions/Mart'
import useAuth from '@/providers/Auth'
import InventoryIcon from '@mui/icons-material/Inventory'
import FormDialog from '@/components/pages/marts/products/opnames/FormDialog'
import { CreateFormValues } from '@/components/pages/marts/products/opnames/Form'
import ChipSmall from '@/components/ChipSmall'
import { Box } from '@mui/material'

let getRowData: GetRowDataType<ProductMovementOpname>

export default function Opnames() {
    const { userHasPermission } = useAuth()
    const { push } = useRouter()

    const [formValues, setFormValues] = useState<CreateFormValues>()

    function handleClose() {
        setFormValues(undefined)
    }

    return (
        <AuthLayout title="Produk">
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
                handleClose={handleClose}
            />

            <Fab
                in={userHasPermission(Mart.CREATE_OPNAME)}
                disabled={!!formValues}
                onClick={() =>
                    setFormValues({
                        at: dayjs().format('YYYY-MM-DD'),
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
        label: 'Tanggal',
        options: {
            customBodyRender: value => dayjs(value).format('DD-MM-YYYY'),
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
        name: 'details.product_state.category_name',
        label: 'Katagori',
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
        },
    },

    {
        name: 'note',
        label: 'Catatan',
    },
]
