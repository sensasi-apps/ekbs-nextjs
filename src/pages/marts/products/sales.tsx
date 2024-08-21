// types
import type ProductMovementCost from '@/dataTypes/mart/ProductMovementCost'
import type ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import type ProductMovementSale from '@/dataTypes/mart/ProductMovementSale'
import type Transaction from '@/dataTypes/Transaction'
// vendors
import { useState } from 'react'
import { Alert, Box, Button, Fade, Typography } from '@mui/material'
import { Field, Formik, FormikErrors } from 'formik'
import Grid2 from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
// icons
import HistoryIcon from '@mui/icons-material/History'
// components
import BackButton from '@/components/BackButton'
import FooterBox from '@/components/Layouts/FooterBox'
import AccountButton from '@/components/Layouts/components/TopBar/components/AccountButton'
// locals
import ProductPicker from '@/components/pages/marts/products/sales/ProductPicker'
import SaleList from '@/components/pages/marts/products/sales/SaleList'
import ReceiptPreview from '@/components/pages/marts/products/sales/ReceiptPreview'
// utils
import blinkSxValue from '@/utils/blinkSxValue'
import dayjs from 'dayjs'
import axios from '@/lib/axios'
import handle422 from '@/utils/errorCatcher'
import { AxiosError } from 'axios'
import LaravelValidationException from '@/types/LaravelValidationException'
import ApiUrl from '@/components/pages/marts/products/sales/ApiUrl'

export default function SalesPage() {
    const [showList, setShowList] = useState(false)

    return (
        <Box
            component="main"
            px={2}
            sx={{
                userSelect: 'none',
                msUserSelect: 'none',
                webkitUserSelect: 'none',
                mozUserSelect: 'none',
            }}>
            <Head>
                <title>{`Kasir Belayan Mart — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Top />

            <Box mb={2}>
                <Button
                    startIcon={<HistoryIcon />}
                    size="small"
                    variant={showList ? 'contained' : 'outlined'}
                    onClick={() => setShowList(prev => !prev)}>
                    Lihat Riwayat
                </Button>
            </Box>

            <Grid2
                container
                spacing={2}
                sx={{
                    '& > *': {
                        transition: 'all 0.1s',
                    },
                }}>
                <Grid2
                    xs={showList ? 2.5 : 0}
                    sx={{
                        opacity: showList ? 1 : 0,
                        p: showList ? undefined : 0,
                        maxHeight: showList ? undefined : 0,
                        overflow: 'hidden',
                    }}>
                    <SaleList />
                </Grid2>

                <Formik<FormValuesType>
                    initialValues={JSON.parse(
                        JSON.stringify(DEFAULT_FORM_VALUES),
                    )}
                    initialStatus={{
                        isDisabled: false,
                        isFormOpen: false,
                    }}
                    initialErrors={{
                        details: 'Barang tidak boleh kosong',
                    }}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(ApiUrl.STORE, {
                                at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                paid: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                ...values,
                            })
                            .catch(
                                (err: AxiosError<LaravelValidationException>) =>
                                    handle422(err, setErrors),
                            )
                    }
                    onReset={(_, { setValues }) =>
                        setValues(DEFAULT_FORM_VALUES)
                    }
                    component={() => (
                        <>
                            <Grid2 xs={12} md={showList ? 6 : 8}>
                                <Field
                                    name="details"
                                    component={ProductPicker}
                                />
                            </Grid2>

                            <Grid2 xs={12} md={showList ? 3.5 : 4}>
                                <ReceiptPreview />
                            </Grid2>
                        </>
                    )}
                    validate={values => {
                        const errors: FormikErrors<FormValuesType> = {}

                        if (!values?.cashable_uuid) {
                            errors.cashable_uuid =
                                'Metode pembayaran tidak boleh kosong'
                        }

                        if (values.details.length === 0) {
                            errors.details = 'Barang tidak boleh kosong'
                        }

                        return errors
                    }}
                />
            </Grid2>

            <FooterBox />
        </Box>
    )
}

function Top() {
    const [showWarning, setShowWarning] = useState(true)

    return (
        <Box
            my={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <BackButton />

            <Fade in={showWarning} unmountOnExit>
                <Alert
                    severity="warning"
                    variant="outlined"
                    onClose={() => setShowWarning(false)}
                    sx={{
                        mx: 4,
                    }}>
                    <Typography
                        component="div"
                        variant="caption"
                        fontWeight="bold"
                        sx={blinkSxValue}>
                        Peringatan
                    </Typography>

                    <Typography variant="caption">
                        Pastikan nama akun yang tertera telah sesuai dengan nama
                        Anda
                    </Typography>
                </Alert>
            </Fade>

            <Box>
                <AccountButton color="success" />
            </Box>
        </Box>
    )
}

export type FormValuesType = {
    cashable_uuid?: Transaction['cashable_uuid']
    buyer_user_uuid?: ProductMovementSale['buyer_user_uuid']
    no?: ProductMovementSale['no']
    details: {
        product: ProductMovementDetail['product']
        product_id: ProductMovementDetail['product_id']
        qty: ProductMovementDetail['qty']
        rp_per_unit: ProductMovementDetail['rp_per_unit']
    }[]
    costs: {
        name: ProductMovementCost['name']
        rp?: ProductMovementCost['rp']
    }[]
}

export const DEFAULT_FORM_VALUES: FormValuesType = {
    details: [],
    costs: [],
}

export type FormikStatusType = {
    isDisabled?: boolean
    isFormOpen?: boolean
}
