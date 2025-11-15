'use client'

import BackupTableIcon from '@mui/icons-material/BackupTable'
// icons
import ReceiptIcon from '@mui/icons-material/Receipt'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// types
import type {
    DataTableProps,
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/data-table'
// components
import Datatable from '@/components/data-table'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import PageTitle from '@/components/page-title'
import ProductSaleForm, {
    EMPTY_FORM_DATA,
    EMPTY_FORM_STATUS,
} from '@/components/pages/farm-input-product-sales/Form'
import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
import RefundForm from '@/components/pages/farm-input-product-sales/RefundForm'
import PrintHandler from '@/components/print-handler'
import FarmInputPermission from '@/enums/permissions/FarmInput'
import Role from '@/enums/role'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import axios from '@/lib/axios'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type ProductMovementDetailORM from '@/modules/farm-inputs/types/orms/product-movement-detail'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
// enums
import { CashableClassname } from '@/modules/transaction/types/orms/transaction'
import formatNumber from '@/utils/format-number'
// utils
import errorCatcher from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'

let getRowData: GetRowDataType<ProductSaleORM>
let mutate: MutateType<ProductSaleORM>

export default function FarmInputProductSales() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const isAuthHasRole = useIsAuthHasRole()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState(EMPTY_FORM_DATA)

    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productSale = getRowData(dataIndex)
            if (!productSale) return

            setInitialFormikValues({
                adjustment_rp: productSale.adjustment_rp,
                at: productSale.at,
                buyer_user_uuid: productSale.buyer_user_uuid,
                cashable_uuid: productSale.transaction?.cashable_uuid ?? '',
                interest_percent: productSale.interest_percent,
                n_term: productSale.n_term,
                n_term_unit: productSale.n_term_unit,
                note: productSale.note,

                payment_method: productSale.payment_method,
                product_sale_details: productSale.product_movement_details.map(
                    detail => ({
                        product: detail.product ?? null,
                        product_id: detail.product_id ?? null,
                        qty: detail.qty,
                        rp_per_unit: detail.rp_per_unit,
                    }),
                ),
                warehouse: productSale.product_movement.warehouse,
            })

            setInitialFormikStatus(productSale)

            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues(EMPTY_FORM_DATA)
        setInitialFormikStatus(EMPTY_FORM_STATUS)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikStatus?.uuid

    const isNeedToDetermineWarehouse =
        isAuthHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE) ===
        isAuthHasRole(Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE)

    return (
        <>
            <PageTitle title="Penjualan" />

            <Box
                display={
                    isAuthHasRole(Role.FARM_INPUT_MANAGER) ? 'block' : 'none'
                }
                mb={2}>
                <Button
                    color="success"
                    href="product-sales/reports"
                    size="small"
                    startIcon={<BackupTableIcon />}
                    variant="contained">
                    Laporan
                </Button>
            </Box>

            <Datatable
                apiUrl="/farm-inputs/product-sales/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={handleRowClick}
                tableId="farm-input-product-sale-table"
                title="Riwayat"
            />

            {isAuthHasPermission(FarmInputPermission.CREATE_PRODUCT_SALE) && (
                <>
                    <DialogWithTitle
                        maxWidth="sm"
                        open={isDialogOpen}
                        title={
                            (isNew ? 'Tambah ' : '') +
                            'Data Penjualan' +
                            (!isNeedToDetermineWarehouse
                                ? ' Gudang ' +
                                  (isAuthHasRole(
                                      Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
                                  )
                                      ? Warehouse.MUAI
                                      : Warehouse.PULAU_PINANG)
                                : '')
                        }>
                        <Formik
                            component={ProductSaleForm}
                            initialStatus={initialFormikStatus}
                            initialValues={initialFormikValues}
                            onReset={handleClose}
                            onSubmit={(values, { setErrors }) =>
                                axios
                                    .post(
                                        `farm-inputs/product-sales`,
                                        shapeValuesBeforeSubmit(values),
                                    )
                                    .then(() => {
                                        mutate()
                                        handleClose()
                                    })
                                    .catch(error =>
                                        errorCatcher(error, setErrors),
                                    )
                            }
                        />
                    </DialogWithTitle>
                </>
            )}

            <Fab
                in={isAuthHasPermission(
                    FarmInputPermission.CREATE_PRODUCT_SALE,
                )}
                onClick={handleNew}>
                <ReceiptIcon />
            </Fab>
        </>
    )
}

function shapeValuesBeforeSubmit(values: typeof EMPTY_FORM_DATA) {
    const {
        at,
        buyer_user_uuid,
        note,
        product_sale_details,
        payment_method,
        warehouse,

        cashable_uuid,
        interest_percent,
        n_term,
        n_term_unit,
        adjustment_rp,
    } = values

    const requiredValues = {
        at,
        buyer_user_uuid: buyer_user_uuid ?? undefined,
        note,
        payment_method,
        product_sale_details,
        warehouse,
    }

    if (payment_method === 'cash') {
        return {
            ...requiredValues,
            adjustment_rp,
            cashable_uuid,
        }
    }

    if (payment_method === 'installment') {
        return {
            ...requiredValues,
            interest_percent,
            n_term,
            n_term_unit,
        }
    }

    if (payment_method === 'wallet') {
        return {
            ...requiredValues,
        }
    }
}

const pmdsCustomBodyRender = (pids: ProductMovementDetailORM[]) => (
    <ul
        style={{
            margin: 0,
            paddingLeft: '1em',
            whiteSpace: 'nowrap',
        }}>
        {pids?.map(
            ({ id, qty, rp_per_unit, product_state: { name, unit } }) => (
                <Typography
                    component="li"
                    key={id}
                    lineHeight="unset"
                    variant="overline">
                    <span>{name}</span> &mdash; {formatNumber(qty * -1)} {unit}{' '}
                    &times; {numberToCurrency(rp_per_unit)} ={' '}
                    {numberToCurrency(qty * -1 * rp_per_unit)}
                </Typography>
            ),
        )}
    </ul>
)

const DATATABLE_COLUMNS: DataTableProps<ProductSaleORM>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: 'excluded',
            sort: false,
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
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Pengguna',
        name: 'buyerUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data || !data.buyer_user) return ''

                return `#${data.buyer_user.id} ${data.buyer_user.name}`
            },
            sort: false,
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
                const data = getRowData(dataIndex)
                if (!data) return ''

                return pmdsCustomBodyRender(data.product_movement_details)
            },
            sort: false,
        },
    },
    {
        label: 'Penyesuaian/Jasa (Rp)',
        name: 'total_base_rp',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return ''

                return data.total_rp - data.total_base_rp
                    ? formatNumber(data.total_rp - data.total_base_rp)
                    : ''
            },
            searchable: false,
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
            sort: false,
        },
    },
    {
        label: 'Total (Rp)',
        name: 'total_rp',
        options: {
            customBodyRender: value => formatNumber(value ?? 0),
            searchable: false,
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
            sort: false,
        },
    },
    {
        label: 'Cetak',
        name: 'uuid',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data || data.refund_from_product_sale) return ''

                return (
                    <PrintHandler
                        slotProps={{
                            tooltip: {
                                title: 'Kwitansi',
                            },
                        }}>
                        <ProductSaleReceipt data={data} />
                    </PrintHandler>
                )
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Refund',
        name: 'refundProductSale.at',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                if (data?.refund_from_product_sale) {
                    return `Refund untuk penjualan dengan kode: ${data.refund_from_product_sale.short_uuid}`
                }

                if (
                    !data ||
                    !data.is_paid ||
                    data.transaction?.cashable_classname ===
                        CashableClassname.BusinessUnitCash ||
                    Boolean(
                        data.installments?.find(installment =>
                            Boolean(installment.transaction),
                        ),
                    )
                )
                    return ''

                if (data.refund_product_sale) {
                    return `Telah di-refund tgl: ${toDmy(
                        data.refund_product_sale.at,
                    )}`
                }

                return <RefundForm data={data} mutate={mutate} />
            },
            display: false,
        },
    },
]
