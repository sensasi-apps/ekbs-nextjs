'use client'

// icons
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
// materials
import Typography from '@mui/material/Typography'
import { Formik } from 'formik'
// vendors
import { useState } from 'react'
// types
import type { DatatableProps, OnRowClickType } from '@/components/Datatable'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
// page components
import FarmInputHeGasSaleForm, {
    type FormValues,
} from '@/components/pages/farm-input-he-gas-sales/Form'
// enums
import FarmInputPermission from '@/enums/permissions/FarmInput'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type ProductMovementDetailORM from '@/modules/farm-inputs/types/orms/product-movement-detail'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import formatNumber from '@/utils/format-number'
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'

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
            const productSale = getRowData<ProductSaleORM>(dataIndex)
            if (!productSale) return

            setInitialFormikValues({
                at: productSale.at,

                buyer_user: productSale.buyer_user,
                buyer_user_uuid: productSale.buyer_user?.uuid,
                current_hm:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.he?.hm,
                has_tx: Boolean(productSale.transaction),

                inventory_item:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.inventory_item,

                inventory_item_uuid:
                    productSale.business_unit_product_sale
                        ?.inventory_item_checkup?.inventory_item?.uuid,

                is_paid: Boolean(productSale.transaction),

                product: {
                    ...productSale.product_movement_details?.[0]?.product_state,
                    warehouses: [
                        productSale.product_movement_details?.[0]
                            ?.product_warehouse_state,
                    ],
                },
                product_id:
                    productSale.product_movement_details?.[0]?.product_id,

                qty: (productSale.product_movement_details?.[0]?.qty ?? 0) * -1,
                rp_per_unit:
                    productSale.product_movement_details?.[0]?.rp_per_unit,
                uuid: productSale.uuid,
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
                apiUrl="/farm-inputs/he-gas-sales/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                onRowClick={handleRowClick}
                tableId="farm-input-he-gas-sale-table"
                title="Riwayat"
            />

            <Fab
                in={isAuthHasPermission(
                    FarmInputPermission.CREATE_PRODUCT_SALE,
                )}
                onClick={handleNew}>
                <LocalGasStationIcon />
            </Fab>

            <DialogWithTitle
                open={isDialogOpen}
                title={(isNew ? 'Tambah' : 'Perbaharui') + ' Data Penjualan'}>
                <Formik
                    component={FarmInputHeGasSaleForm}
                    initialValues={initialFormikValues}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `farm-inputs/he-gas-sales${
                                    values.uuid ? `/${values.uuid}` : ''
                                }`,
                                {
                                    at: values.at,
                                    buyer_user_uuid: values.buyer_user_uuid,
                                    current_hm: values.current_hm,
                                    inventory_item_uuid:
                                        values.inventory_item_uuid,
                                    is_paid: values.is_paid ?? false,
                                    product_id: values.product_id,
                                    qty: values.qty,
                                    rp_per_unit: values.rp_per_unit,
                                },
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogWithTitle>
        </>
    )
}

const pmdsCustomBodyRender = (pids: ProductMovementDetailORM[]) => (
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
                    component="li"
                    key={id}
                    lineHeight="unset"
                    variant="overline">
                    <span>{name}</span> &mdash; {formatNumber(qty * -1)} {unit}{' '}
                    &times; {numberToCurrency(rp_per_unit)} ={' '}
                    {numberToCurrency(
                        qty * -1 * (rp_cost_per_unit + rp_per_unit),
                    )}
                </Typography>
            ),
        )}
    </ul>
)

const DATATABLE_COLUMNS: DatatableProps<ProductSaleORM>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Pemesan',
        name: 'buyerUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleORM>(dataIndex)
                if (!data || !data.buyer_user) return ''

                return `#${data.buyer_user.id} ${data.buyer_user.name}`
            },
        },
    },
    {
        label: 'Metode Pembayaran',
        name: 'payment_method_id',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Catatan',
        name: 'note',
        options: {
            display: false,
            sort: false,
        },
    },
    {
        label: 'Barang',
        name: 'productMovement.details.product_state',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleORM>(dataIndex)
                if (!data) return ''

                return pmdsCustomBodyRender(data.product_movement_details)
            },
            sort: false,
        },
    },
    {
        label: 'Total Penjualan',
        name: 'total_rp',
        options: {
            customBodyRender: value => numberToCurrency(value ?? 0),
            searchable: false,
            sort: false,
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
