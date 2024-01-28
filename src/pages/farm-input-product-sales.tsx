// types
import type ProductSaleType from '@/dataTypes/ProductSale'
import type { MUIDataTableColumn } from 'mui-datatables'
import type { OnRowClickType } from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik } from 'formik'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
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
import Role from '@/enums/Role'

export default function FarmInputProductSales() {
    const { userHasPermission, userHasRole } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState(EMPTY_FORM_DATA)
    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productSale = getRowData<ProductSaleType>(dataIndex)
            if (!productSale) return

            setInitialFormikValues({
                at: productSale.at,
                buyer_user_uuid: productSale.buyer_user_uuid,
                note: productSale.note,
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
            />

            {userHasPermission('create product sale') && (
                <>
                    <DialogWithTitle
                        title={
                            (isNew ? 'Tambah' : 'Perbaharui') +
                            ' Data Penjualan'
                        }
                        open={isDialogOpen}
                        maxWidth="md">
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
                in={userHasPermission('create product sale')}>
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
        label: 'Pengguna',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleType>(dataIndex)
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
                const data = getRowData<ProductSaleType>(dataIndex)
                if (!data) return ''

                return (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1em',
                            whiteSpace: 'nowrap',
                        }}>
                        {data.product_movement_details?.map(
                            ({
                                qty,
                                product_id,
                                rp_per_unit,
                                product_state: { name, unit },
                            }) => (
                                <Typography
                                    key={product_id}
                                    variant="overline"
                                    component="li"
                                    lineHeight="unset">
                                    {formatNumber(Math.abs(qty))} {unit}{' '}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: name,
                                        }}
                                    />{' '}
                                    &times;{' '}
                                    {numberToCurrency(Math.abs(rp_per_unit))}
                                </Typography>
                            ),
                        )}
                    </ul>
                )
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
    {
        name: 'uuid',
        label: 'Cetak',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductSaleType>(dataIndex)
                if (!data) return ''

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
]
