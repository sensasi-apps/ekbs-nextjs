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
                title="Opname"
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
    },

    // {
    //     name: 'code',
    //     label: 'Kode',
    //     options: {
    //         customBodyRenderLite: dataIndex => {
    //             const data = getRowData(dataIndex)
    //             if (!data) return

    //             const { id, code } = data

    //             return (
    //                 <Typography
    //                     variant="overline"
    //                     fontFamily="monospace"
    //                     lineHeight="inherit">
    //                     {code ?? id}
    //                 </Typography>
    //             )
    //         },
    //     },
    // },
    // {
    //     name: 'name',
    //     label: 'Nama',
    // },
    // {
    //     name: 'category_name',
    //     label: 'Kategori',
    //     options: {
    //         customBodyRender: text =>
    //             text ? <ChipSmall label={text} variant="outlined" /> : '',
    //     },
    // },
    // {
    //     name: 'description',
    //     label: 'Deskripsi',
    //     options: {
    //         display: false,
    //     },
    // },
    // {
    //     name: 'warehouses.warehouse',
    //     label: 'Gudang',
    //     options: {
    //         customBodyRenderLite(dataIndex) {
    //             const warehouses = getRowData(dataIndex)?.warehouses
    //             if (!warehouses) return

    //             return (
    //                 <ul
    //                     style={{
    //                         margin: 0,
    //                         padding: 0,
    //                     }}>
    //                     {warehouses.map(({ warehouse }, i) => (
    //                         <li key={i}>{warehouse}</li>
    //                     ))}
    //                 </ul>
    //             )
    //         },
    //     },
    // },
    // {
    //     name: 'warehouses.qty',
    //     label: 'QTY',
    //     options: {
    //         customBodyRenderLite(dataIndex) {
    //             const data = getRowData(dataIndex)

    //             if (!data) return

    //             const { low_number, warehouses } = data

    //             return (
    //                 <ul
    //                     style={{
    //                         margin: 0,
    //                         padding: 0,
    //                     }}>
    //                     {warehouses.map(({ qty }, i) => {
    //                         const content =
    //                             low_number !== null && qty <= low_number ? (
    //                                 <FarmInputsProductsLowQty>
    //                                     {formatNumber(qty)}
    //                                 </FarmInputsProductsLowQty>
    //                             ) : (
    //                                 formatNumber(qty)
    //                             )

    //                         return <li key={i}>{content}</li>
    //                     })}
    //                 </ul>
    //             )
    //         },
    //     },
    // },
    // {
    //     name: 'unit',
    //     label: 'Satuan',
    // },
    // {
    //     name: 'warehouses.base_cost_rp_per_unit',
    //     label: 'Biaya Dasar',
    //     options: {
    //         customBodyRenderLite(dataIndex) {
    //             const warehouses = getRowData(dataIndex)?.warehouses
    //             if (!warehouses) return

    //             return (
    //                 <ul
    //                     style={{
    //                         margin: 0,
    //                         padding: 0,
    //                     }}>
    //                     {warehouses.map(({ cost_rp_per_unit }, i) => (
    //                         <li key={i}>
    //                             {numberToCurrency(cost_rp_per_unit)}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             )
    //         },
    //     },
    // },
    // {
    //     name: 'warehouses.default_sell_price',
    //     label: 'Harga Jual Default',
    //     options: {
    //         customBodyRenderLite(dataIndex) {
    //             const warehouses = getRowData(dataIndex)?.warehouses
    //             if (!warehouses) return

    //             return (
    //                 <ul
    //                     style={{
    //                         margin: 0,
    //                         padding: 0,
    //                     }}>
    //                     {warehouses.map(({ default_sell_price, margin }, i) => (
    //                         <li key={i}>
    //                             {numberToCurrency(default_sell_price)}

    //                             {margin && (
    //                                 <ChipSmall
    //                                     variant="outlined"
    //                                     sx={{
    //                                         ml: 2,
    //                                     }}
    //                                     label={
    //                                         Math.round((margin - 1) * 100) +
    //                                         ' %'
    //                                     }
    //                                     color={
    //                                         margin - 1 < 0 ? 'error' : 'success'
    //                                     }
    //                                 />
    //                             )}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             )
    //         },
    //     },
    // },
]
