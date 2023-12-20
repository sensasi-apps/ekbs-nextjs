// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'
import type { ProductPurchaseRelationsType } from '@/dataTypes/ProductPurchase'
import type { Ymd } from '@/types/DateString'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik } from 'formik'
// materials
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductPurchaseForm, {
    EMPTY_FORM_DATA,
    EMPTY_FORM_STATUS,
} from '@/components/pages/farm-inputs/product-purchases/Form'
// icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// providers
import useAuth from '@/providers/Auth'
// utils
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'
import errorCatcher from '@/utils/errorCatcher'

let getRowData: GetRowDataType<
    ProductPurchaseType & ProductPurchaseRelationsType
>
let mutate: MutateType<ProductPurchaseType & ProductPurchaseRelationsType>

export default function FarmInputsProducts() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState(EMPTY_FORM_DATA)
    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productPurchase = getRowData(dataIndex)
            if (!productPurchase) return

            setInitialFormikValues({
                due: productPurchase.due,
                note: productPurchase.note,
                order: productPurchase.order,
                paid: productPurchase.paid,
                received: productPurchase.received,
                cashable_uuid: productPurchase.transaction?.cashable_uuid,
                product_movement_details:
                    productPurchase.product_movement_details,
            })

            setInitialFormikStatus({
                uuid: productPurchase.uuid,
                hasTransaction: Boolean(productPurchase.transaction),
            })
            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues(EMPTY_FORM_DATA)
        setInitialFormikStatus(EMPTY_FORM_STATUS)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikStatus.uuid

    return (
        <AuthLayout title="Pembelian Produk">
            <Datatable
                title="Riwayat"
                apiUrl="/farm-inputs/product-purchases/datatable"
                tableId="product-purchases-table"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'order', direction: 'desc' }}
                onRowClick={handleRowClick}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle
                title={(isNew ? 'Tambah ' : 'Perbaharui ') + 'Data Pembelian'}
                open={isDialogOpen}
                maxWidth="lg">
                <Formik
                    initialValues={initialFormikValues}
                    initialStatus={initialFormikStatus}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `farm-inputs/product-purchases${
                                    isNew ? '' : `/${initialFormikStatus.uuid}`
                                }`,
                                values,
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                    onReset={handleClose}
                    component={ProductPurchaseForm}
                />
            </DialogWithTitle>

            {userHasPermission([
                'create product purchase',
                'update product purchase',
            ]) && (
                <Fab onClick={handleNew}>
                    <ShoppingCartIcon />
                </Fab>
            )}
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
        name: 'order',
        label: 'Dipesan Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'due',
        label: 'Jatuh Tempo Tanggal',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
        },
    },
    {
        name: 'paid',
        label: 'Dibayar Tanggal',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
        },
    },
    {
        name: 'received',
        label: 'Diterima Tanggal',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
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
        options: {
            display: 'excluded',
            customBodyRenderLite: () => '',
        },
    },
    {
        name: 'product_movement_details_temp',
        options: {
            display: 'excluded',
            customBodyRenderLite: () => '',
        },
    },
    {
        name: 'product_movement_details',
        label: 'Barang',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (pids: ProductMovementDetailType[]) => (
                <ul
                    style={{
                        margin: 0,
                        paddingLeft: '1em',
                        whiteSpace: 'nowrap',
                    }}>
                    {pids?.map(pid => (
                        <Typography
                            key={pid.product_id}
                            component="li"
                            variant="overline">
                            {formatNumber(pid.qty ?? 0)} {pid.product?.unit}{' '}
                            {pid.product?.name} &times;{' '}
                            {numberToCurrency(pid.rp_per_unit ?? 0)}
                        </Typography>
                    ))}
                </ul>
            ),
        },
    },
    {
        name: 'total_rp',
        label: 'Total',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: value => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                    }}>
                    {numberToCurrency(Number(value))}
                </span>
            ),
        },
    },
]
