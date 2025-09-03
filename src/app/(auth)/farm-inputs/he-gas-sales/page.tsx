'use client'

// types
import type { DatatableProps, OnRowClickType } from '@/components/Datatable'
import type { ProductSale } from '@/dataTypes/ProductSale'
import type ProductMovementDetail from '@/types/orms/product-movement-detail'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik } from 'formik'
// materials
import Typography from '@mui/material/Typography'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
// page components
import FarmInputHeGasSaleForm, {
    type FormValues,
} from '@/components/pages/farm-input-he-gas-sales/Form'
// icons
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
// utils
import toDmy from '@/utils/to-dmy'
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import handle422 from '@/utils/handle-422'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// enums
import FarmInputPermission from '@/enums/permissions/FarmInput'

/**
 * gas sales to heavy equipment rental unit
 */
export default function FarmInputHeGasSales() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] = useState<FormValues>(
        {},
    )

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productSale = getRowData<ProductSale>(dataIndex)
            if (!productSale) return

            setInitialFormikValues({
                uuid: productSale.uuid,
                at: productSale.at,

                product: {
                    ...productSale.product_movement_details?.[0]?.product_state,
                    warehouses: [
                        productSale.product_movement_details?.[0]
                            ?.product_warehouse_state,
                    ],
                },
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

                qty: (productSale.product_movement_details?.[0]?.qty ?? 0) * -1,
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
        <>
            <PageTitle title="Penjualan BBM ke Alat Berat" />

            <Datatable
                title="Riwayat"
                tableId="farm-input-he-gas-sale-table"
                apiUrl="/farm-inputs/he-gas-sales/datatable"
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
            />

            <Fab
                in={isAuthHasPermission(
                    FarmInputPermission.CREATE_PRODUCT_SALE,
                )}
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
        </>
    )
}

const pmdsCustomBodyRender = (pids: ProductMovementDetail[]) => (
    <ul
        style={{
            margin: 0,
            paddingLeft: '1em',
            whiteSpace: 'nowrap',
        }}>
        {pids?.map(
            ({
                id,
                qty,
                rp_per_unit,
                rp_cost_per_unit,
                product_state: { name, unit },
            }) => (
                <Typography
                    key={id}
                    variant="overline"
                    component="li"
                    lineHeight="unset">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: name,
                        }}
                    />{' '}
                    &mdash; {formatNumber(qty * -1)} {unit} &times;{' '}
                    {numberToCurrency(rp_per_unit)} ={' '}
                    {numberToCurrency(
                        qty * -1 * (rp_cost_per_unit + rp_per_unit),
                    )}
                </Typography>
            ),
        )}
    </ul>
)

const DATATABLE_COLUMNS: DatatableProps<ProductSale>['columns'] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'buyerUser.name',
        label: 'Pemesan',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSale>(dataIndex)
                if (!data || !data.buyer_user) return ''

                return `#${data.buyer_user.id} ${data.buyer_user.name}`
            },
        },
    },
    {
        name: 'payment_method_id',
        label: 'Metode Pembayaran',
        options: {
            searchable: false,
            sort: false,
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
        name: 'productMovement.details.product_state',
        label: 'Barang',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSale>(dataIndex)
                if (!data) return ''

                return pmdsCustomBodyRender(data.product_movement_details)
            },
        },
    },
    {
        name: 'total_rp',
        label: 'Total Penjualan',
        options: {
            sort: false,
            searchable: false,
            customBodyRender: value => numberToCurrency(value ?? 0),
        },
    },
    // {
    //     name: 'uuid',
    //     label: 'Cetak',
    //     options: {
    //         sort: false,
    //         searchable: false,
    //         customBodyRenderLite: dataIndex => {
    //             const data = getRowData<ProductSale>(dataIndex)
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
