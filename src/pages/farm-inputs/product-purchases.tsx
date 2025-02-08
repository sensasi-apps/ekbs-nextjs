// types
import type ProductMovementDetail from '@/dataTypes/ProductMovementDetail'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'
import type { Ymd } from '@/types/DateString'
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik, FormikConfig } from 'formik'
// materials
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductPurchaseForm, {
    EMPTY_FORM_STATUS,
    FormValuesType,
    productPurchaseToFormValues,
} from '@/components/pages/farm-inputs/product-purchases/Form'
// icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'
import replaceNullPropValuesWithUndefined from '@/utils/replaceNullPropValuesWithUndefined'
import toDmy from '@/utils/toDmy'
// enums
import FarmInput from '@/enums/permissions/FarmInput'
import ApiUrlEnum from '@/components/pages/farm-inputs/ApiUrlEnum'

let getRowData: GetRowDataType<ProductPurchaseType>
let mutate: MutateType<ProductPurchaseType>

export default function FarmInputsProducts() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState<FormValuesType>(productPurchaseToFormValues())

    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const isNew = !initialFormikStatus.uuid

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productPurchase = getRowData(dataIndex)
            if (!productPurchase) return

            setInitialFormikValues(productPurchaseToFormValues(productPurchase))

            setInitialFormikStatus({
                uuid: productPurchase.uuid,
                hasTransaction: Boolean(productPurchase.transaction),
            })
            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues(productPurchaseToFormValues())
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
                replaceNullPropValuesWithUndefined(values),
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

function pmdsCustomBodyRender(pids: ProductMovementDetail[]) {
    return (
        <ul
            style={{
                margin: 0,
                paddingLeft: '1em',
                whiteSpace: 'nowrap',
            }}>
            {pids?.map(
                (
                    {
                        qty,
                        rp_per_unit,
                        rp_cost_per_unit,
                        product_state: { name, unit },
                    },
                    index,
                ) => (
                    <Typography
                        key={index}
                        variant="overline"
                        component="li"
                        lineHeight="unset">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: name,
                            }}
                        />{' '}
                        &mdash; {formatNumber(qty)} {unit} &times;{' ('}
                        <Tooltip title="harga beli" placement="top" arrow>
                            <u
                                style={{
                                    textDecorationStyle: 'dotted',
                                }}>
                                {numberToCurrency(rp_per_unit)}
                            </u>
                        </Tooltip>{' '}
                        +{' '}
                        <Tooltip title="biaya lain" placement="top" arrow>
                            <u
                                style={{
                                    textDecorationStyle: 'dotted',
                                }}>
                                {numberToCurrency(rp_cost_per_unit)}
                            </u>
                        </Tooltip>
                        {') '}={' '}
                        {numberToCurrency(
                            qty * (rp_cost_per_unit + rp_per_unit),
                        )}
                    </Typography>
                ),
            )}
        </ul>
    )
}

const DATATABLE_COLUMNS: DatatableProps<ProductPurchaseType>['columns'] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'productMovement.warehouse',
        label: 'Gudang',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.product_movement?.warehouse,
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
        name: 'productMovement.details.product_state',
        options: {
            display: 'excluded',
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
            customBodyRender: pmdsCustomBodyRender,
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
