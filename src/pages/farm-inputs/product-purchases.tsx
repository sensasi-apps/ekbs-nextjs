// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'
import type { Ymd } from '@/types/DateString'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik, FormikConfig } from 'formik'
// materials
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductPurchaseForm, {
    EMPTY_FORM_STATUS,
    FormValuesType,
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
// enums
import FarmInput from '@/enums/permissions/FarmInput'
import ApiUrlEnum from '@/components/pages/farm-inputs/ApiUrlEnum'

let getRowData: GetRowDataType<ProductPurchaseType>
let mutate: MutateType<ProductPurchaseType>

export default function FarmInputsProducts() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] = useState({})
    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const isNew = !initialFormikStatus.uuid

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productPurchase = getRowData(dataIndex)
            if (!productPurchase) return

            setInitialFormikValues({
                ...productPurchase,
                cashable_uuid: productPurchase.transaction?.cash.uuid,
            })

            setInitialFormikStatus({
                uuid: productPurchase.uuid,
                hasTransaction: Boolean(productPurchase.transaction),
            })
            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setInitialFormikStatus(EMPTY_FORM_STATUS)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const handleOnSubmit: FormikConfig<FormValuesType>['onSubmit'] = (
        values,
        { setErrors },
    ) =>
        axios
            .post(
                ApiUrlEnum.UPDATE_OR_CREATE_PRODUCT_PURCHASE.replace(
                    '$1',
                    isNew ? '' : `/${initialFormikStatus.uuid}`,
                ),
                {
                    order: values.order,
                    due: values.due,
                    received: values.received,
                    paid: values.paid,
                    note: values.note,
                    product_movement: {
                        costs: values.product_movement?.costs,
                    },
                    product_movement_details: values.product_movement_details,
                    cashable_uuid: values.cashable_uuid,
                },
            )
            .then(() => {
                mutate()
                handleClose()
            })
            .catch(error => errorCatcher(error, setErrors))

    return (
        <AuthLayout title="Pembelian Produk">
            <Datatable
                title="Riwayat"
                tableId="product-purchases-table"
                apiUrl={ApiUrlEnum.PRODUCT_PURCHASE_DATATABLE}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'order', direction: 'desc' }}
                onRowClick={handleRowClick}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
            />

            {userHasPermission([
                FarmInput.CREATE_PRODUCT_PURCHASE,
                FarmInput.UPDATE_PRODUCT_PURCHASE,
            ]) && (
                <DialogWithTitle
                    title={
                        (isNew ? 'Tambah ' : 'Perbaharui ') + 'Data Pembelian'
                    }
                    open={isDialogOpen}
                    maxWidth="lg">
                    <Formik
                        initialValues={initialFormikValues}
                        initialStatus={initialFormikStatus}
                        onSubmit={handleOnSubmit}
                        onReset={handleClose}
                        component={ProductPurchaseForm}
                    />
                </DialogWithTitle>
            )}

            <Fab
                onClick={handleNew}
                in={userHasPermission(FarmInput.CREATE_PRODUCT_PURCHASE)}>
                <ShoppingCartIcon />
            </Fab>
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
        name: 'received',
        label: 'Diterima Tanggal',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
        },
    },
    {
        name: 'paid',
        label: 'Dibayar Tanggal',
        options: {
            customBodyRender: (value: Ymd) => (
                <div
                    style={{
                        color: 'var(--mui-palette-success-main)',
                    }}>
                    {value ? toDmy(value) : ''}
                </div>
            ),
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
        name: 'product_movement.rp_cost',
        label: 'Biaya Lain',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const { rp_cost } =
                    getRowData(dataIndex)?.product_movement ?? {}

                if (!rp_cost) return ''

                return (
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                        }}>
                        {numberToCurrency(Number(rp_cost))}
                    </span>
                )
            },
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
