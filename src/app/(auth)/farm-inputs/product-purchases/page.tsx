'use client'

// icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// materials
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Formik, type FormikConfig } from 'formik'
// vendors
import { useState } from 'react'
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
import ApiUrlEnum from '@/components/pages/farm-inputs/ApiUrlEnum'
import ProductPurchaseForm, {
    EMPTY_FORM_STATUS,
    type FormValuesType,
    productPurchaseToFormValues,
} from '@/components/pages/farm-inputs/product-purchases/Form'
// enums
import FarmInput from '@/enums/permissions/FarmInput'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
// types
import type ProductMovementDetailORM from '@/modules/farm-inputs/types/orms/product-movement-detail'
import type ProductPurchaseType from '@/modules/farm-inputs/types/orms/product-purchase'
import type { Ymd } from '@/types/date-string'
import formatNumber from '@/utils/format-number'
// utils
import errorCatcher from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import replaceNullPropValuesWithUndefined from '@/utils/replace-null-prop-values-with-undefined'
import toDmy from '@/utils/to-dmy'

let getRowData: GetRowDataType<ProductPurchaseType>
let mutate: MutateType<ProductPurchaseType>

export default function FarmInputsProducts() {
    const isAuthHasPermission = useIsAuthHasPermission()

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
                hasTransaction: Boolean(productPurchase.transaction),
                uuid: productPurchase.uuid,
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
        <>
            <PageTitle subtitle="(re-stok)" title="Pembelian Produk" />

            <Datatable
                apiUrl={ApiUrlEnum.PRODUCT_PURCHASE_DATATABLE}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'order' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={handleRowClick}
                tableId="product-purchases-table"
                title="Riwayat"
            />

            {isAuthHasPermission([
                FarmInput.CREATE_PRODUCT_PURCHASE,
                FarmInput.UPDATE_PRODUCT_PURCHASE,
            ]) && (
                <DialogWithTitle
                    maxWidth="lg"
                    open={isDialogOpen}
                    title={
                        (isNew ? 'Tambah ' : 'Perbaharui ') + 'Data Pembelian'
                    }>
                    <Formik
                        component={ProductPurchaseForm}
                        initialStatus={initialFormikStatus}
                        initialValues={initialFormikValues}
                        onReset={handleClose}
                        onSubmit={handleOnSubmit}
                    />
                </DialogWithTitle>
            )}

            <Fab
                in={isAuthHasPermission(FarmInput.CREATE_PRODUCT_PURCHASE)}
                onClick={handleNew}>
                <ShoppingCartIcon />
            </Fab>
        </>
    )
}

function pmdsCustomBodyRender(pids: ProductMovementDetailORM[]) {
    return (
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
                        <span>{name}</span> &mdash; {formatNumber(qty)} {unit}{' '}
                        &times;{' ('}
                        <Tooltip arrow placement="top" title="harga beli">
                            <u
                                style={{
                                    textDecorationStyle: 'dotted',
                                }}>
                                {numberToCurrency(rp_per_unit)}
                            </u>
                        </Tooltip>{' '}
                        +{' '}
                        <Tooltip arrow placement="top" title="biaya lain">
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

const DATATABLE_COLUMNS: DataTableProps<ProductPurchaseType>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'Gudang',
        name: 'productMovement.warehouse',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.product_movement?.warehouse,
        },
    },
    {
        label: 'Dipesan Tanggal',
        name: 'order',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Jatuh Tempo Tanggal',
        name: 'due',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
        },
    },
    {
        label: 'Diterima Tanggal',
        name: 'received',
        options: {
            customBodyRender: (value: Ymd) => (value ? toDmy(value) : ''),
        },
    },
    {
        label: 'Dibayar Tanggal',
        name: 'paid',
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
        label: 'Catatan',
        name: 'note',
        options: {
            display: false,
            sort: false,
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
        label: 'Barang',
        name: 'product_movement_details',
        options: {
            customBodyRender: pmdsCustomBodyRender,
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Total',
        name: 'total_rp',
        options: {
            customBodyRender: value => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                    }}>
                    {numberToCurrency(Number(value))}
                </span>
            ),
            searchable: false,
            sort: false,
        },
    },
]
