// types
import type ProductSaleType from '@/dataTypes/ProductSale'
import type { MUIDataTableColumn } from 'mui-datatables'
import type { OnRowClickType } from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik } from 'formik'
// materials
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// page components
import FarmInputHeGasSaleForm, {
    FormValues,
} from '@/components/pages/farm-input-he-gas-sales/Form'
// import PrintHandler from '@/components/PrintHandler'
// import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
// icons
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
// providers
import useAuth from '@/providers/Auth'
// utils
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'
import handle422 from '@/utils/errorCatcher'

/**
 * gas sales to heavy equipment rental unit
 */
export default function FarmInputHeGasSales() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] = useState<FormValues>(
        {},
    )

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productSale = getRowData<ProductSaleType>(dataIndex)
            if (!productSale) return

            setInitialFormikValues({
                uuid: productSale.uuid,
                at: productSale.at,

                product: productSale.product_movement_details?.[0]?.product,
                product_id:
                    productSale.product_movement_details?.[0]?.product_id,

                buyer_user: productSale.buyer_user,
                buyer_user_uuid: productSale.buyer_user?.uuid,

                inventory_item:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.inventory_item,

                inventory_item_uuid:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.inventory_item?.uuid,

                qty: productSale.product_movement_details?.[0]?.qty,
                current_hm:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.he?.hm,
                rp_per_unit:
                    productSale.product_movement_details?.[0]?.rp_per_unit,

                is_paid: Boolean(productSale.transaction),
                has_tx: Boolean(productSale.transaction),
            })

            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikValues?.uuid

    return (
        <AuthLayout title="Penjualan BBM ke Alat Berat">
            <Datatable
                title="Riwayat"
                tableId="farm-input-he-gas-sale-table"
                apiUrl="/farm-inputs/he-gas-sales/datatable"
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
            />

            <Fab
                in={userHasPermission('create product sale')}
                onClick={handleNew}>
                <LocalGasStationIcon />
            </Fab>

            <DialogWithTitle
                title={(isNew ? 'Tambah' : 'Perbaharui') + ' Data Penjualan'}
                open={isDialogOpen}>
                <Formik
                    initialValues={initialFormikValues}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `farm-inputs/he-gas-sales${
                                    values.uuid ? `/${values.uuid}` : ''
                                }`,
                                {
                                    is_paid: values.is_paid ?? false,
                                    at: values.at,
                                    product_id: values.product_id,
                                    buyer_user_uuid: values.buyer_user_uuid,
                                    inventory_item_uuid:
                                        values.inventory_item_uuid,
                                    qty: values.qty,
                                    current_hm: values.current_hm,
                                    rp_per_unit: values.rp_per_unit,
                                },
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={FarmInputHeGasSaleForm}
                />
            </DialogWithTitle>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'buyerUser.name',
        label: 'Pemesan',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleType>(dataIndex)
                if (!data || !data.buyer_user) return ''

                return `#${data.buyer_user.id} ${data.buyer_user.name}`
            },
        },
    },
    {
        name: 'payment_method',
        label: 'Pembayaran',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: string) => {
                if (value === 'cash') return 'Tunai'
                if (value === 'installment') return 'Potong TBS'
                if (value === 'wallet') return 'E-Wallet'
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
        options: {
            sort: false,
            display: false,
        },
    },
    {
        name: 'productMovement.details.product.name',
        label: 'Barang',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleType>(dataIndex)
                if (!data) return ''

                const { qty, rp_per_unit } = data.product_movement_details[0]
                const { name, unit } = data.product_movement_details[0]
                    .product ?? {
                    name: '',
                    unit: '',
                }

                if (!name) return ''

                return (
                    <Typography variant="overline" lineHeight="unset">
                        {formatNumber(Math.abs(qty))} {unit} {name} &times;{' '}
                        {numberToCurrency(Math.abs(rp_per_unit))}
                    </Typography>
                )
            },
        },
    },
    {
        name: 'total_rp',
        label: 'Total Nilai',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleType>(dataIndex)
                if (!data) return ''

                const { total_rp } = data

                return numberToCurrency(total_rp)
            },
        },
    },
    // {
    //     name: 'uuid',
    //     label: 'Cetak',
    //     options: {
    //         sort: false,
    //         searchable: false,
    //         customBodyRenderLite: dataIndex => {
    //             const data = getRowData<ProductSaleType>(dataIndex)
    //             if (!data) return ''

    //             return (
    //                 <PrintHandler
    //                     slotProps={{
    //                         tooltip: {
    //                             title: 'Kwitansi',
    //                         },
    //                     }}>
    //                     <ProductSaleReceipt data={data} />
    //                 </PrintHandler>
    //             )
    //         },
    //     },
    // },
]
