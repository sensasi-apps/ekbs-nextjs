// types
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
import type ProductMovementDetail from '@/dataTypes/ProductMovementDetail'
import type { ProductSale } from '@/dataTypes/ProductSale'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// components
import Datatable from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductSaleForm, {
    EMPTY_FORM_STATUS,
    EMPTY_FORM_DATA,
} from '@/components/pages/farm-input-product-sales/Form'
// icons
import ReceiptIcon from '@mui/icons-material/Receipt'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'
import PrintHandler from '@/components/PrintHandler'
import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
// enums
import Role from '@/enums/Role'
import RefundForm from '@/components/pages/farm-input-product-sales/RefundForm'
import { CashableClassname } from '@/dataTypes/Transaction'
import Warehouse from '@/enums/Warehouse'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import FarmInputPermission from '@/enums/permissions/FarmInput'

let getRowData: GetRowDataType<ProductSale>
let mutate: MutateType<ProductSale>

export default function FarmInputProductSales() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { userHasRole } = useAuth()

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
                at: productSale.at,
                buyer_user_uuid: productSale.buyer_user_uuid,
                note: productSale.note,
                warehouse: productSale.product_movement.warehouse,

                payment_method: productSale.payment_method,
                cashable_uuid: productSale.transaction?.cashable_uuid ?? '',
                interest_percent: productSale.interest_percent,
                n_term: productSale.n_term,
                n_term_unit: productSale.n_term_unit,
                adjustment_rp: productSale.adjustment_rp,
                product_sale_details: productSale.product_movement_details.map(
                    detail => ({
                        product_id: detail.product_id ?? null,
                        product: detail.product ?? null,
                        qty: detail.qty,
                        rp_per_unit: detail.rp_per_unit,
                    }),
                ),
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
        userHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE) ===
        userHasRole(Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE)

    return (
        <AuthLayout title="Penjualan">
            <Box
                mb={2}
                display={
                    userHasRole(Role.FARM_INPUT_MANAGER) ? 'block' : 'none'
                }>
                <Button
                    href="/farm-input-product-sales/report"
                    startIcon={<BackupTableIcon />}
                    size="small"
                    color="success"
                    variant="contained">
                    Laporan
                </Button>
            </Box>

            <Datatable
                title="Riwayat"
                tableId="farm-input-product-sale-table"
                apiUrl="/farm-inputs/product-sales/datatable"
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
            />

            {isAuthHasPermission(FarmInputPermission.CREATE_PRODUCT_SALE) && (
                <>
                    <DialogWithTitle
                        title={
                            (isNew ? 'Tambah ' : '') +
                            'Data Penjualan' +
                            (!isNeedToDetermineWarehouse
                                ? ' Gudang ' +
                                  (userHasRole(
                                      Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
                                  )
                                      ? Warehouse.MUAI
                                      : Warehouse.PULAU_PINANG)
                                : '')
                        }
                        open={isDialogOpen}
                        maxWidth="sm">
                        <Formik
                            initialValues={initialFormikValues}
                            initialStatus={initialFormikStatus}
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
                            onReset={handleClose}
                            component={ProductSaleForm}
                        />
                    </DialogWithTitle>
                </>
            )}

            <Fab
                onClick={handleNew}
                in={isAuthHasPermission(
                    FarmInputPermission.CREATE_PRODUCT_SALE,
                )}>
                <ReceiptIcon />
            </Fab>
        </AuthLayout>
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
        product_sale_details,
        payment_method,
        warehouse,
    }

    if (payment_method === 'cash') {
        return {
            ...requiredValues,
            cashable_uuid,
            adjustment_rp,
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

const pmdsCustomBodyRender = (pids: ProductMovementDetail[]) => (
    <ul
        style={{
            margin: 0,
            paddingLeft: '1em',
            whiteSpace: 'nowrap',
        }}>
        {pids?.map(
            ({ id, qty, rp_per_unit, product_state: { name, unit } }) => (
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
                    {numberToCurrency(qty * -1 * rp_per_unit)}
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
            sort: false,
            display: 'excluded',
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
        name: 'short_uuid',
        label: 'Kode',
        options: {
            sort: false,
            searchable: false,
        },
    },
    {
        name: 'buyerUser.name',
        label: 'Pengguna',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data || !data.buyer_user) return ''

                return `#${data.buyer_user.id} ${data.buyer_user.name}`
            },
        },
    },
    {
        name: 'payment_method_id',
        label: 'Metode Pembayaran',
        options: {
            sort: false,
            searchable: false,
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
                const data = getRowData(dataIndex)
                if (!data) return ''

                return pmdsCustomBodyRender(data.product_movement_details)
            },
        },
    },
    {
        name: 'total_base_rp',
        label: 'Penyesuaian/Jasa (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return ''

                return data.total_rp - data.total_base_rp
                    ? formatNumber(data.total_rp - data.total_base_rp)
                    : ''
            },
        },
    },
    {
        name: 'total_rp',
        label: 'Total (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
            sort: false,
            searchable: false,
            customBodyRender: value => formatNumber(value ?? 0),
        },
    },
    {
        name: 'uuid',
        label: 'Cetak',
        options: {
            sort: false,
            searchable: false,
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
        },
    },
    {
        name: 'refundProductSale.at',
        label: 'Refund',
        options: {
            display: false,
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
        },
    },
]
