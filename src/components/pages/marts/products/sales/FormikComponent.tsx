// types
import type ProductMovementCost from '@/dataTypes/mart/ProductMovementCost'
import type ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import type ProductMovementSale from '@/dataTypes/mart/product-movement-sale'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { memo } from 'react'
import { Field, Formik, FormikErrors } from 'formik'
import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import Grid2 from '@mui/material/Unstable_Grid2'
//
import LaravelValidationException from '@/types/LaravelValidationException'
import ApiUrl from '@/components/pages/marts/products/sales/ApiUrl'
import ReceiptPreview from './ReceiptPreview'
import handle422 from '@/utils/errorCatcher'
import ProductPicker from './ProductPicker'

function FormikComponent() {
    return (
        <Formik<FormValuesType>
            initialValues={JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES))}
            initialStatus={{ ...DEFAULT_STATUS }}
            initialErrors={{
                details: 'Barang tidak boleh kosong',
            }}
            onSubmit={(values, { setErrors, setStatus }) => {
                const submittedData = {
                    ...values,
                    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    paid: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }

                return axios
                    .post(ApiUrl.STORE, submittedData)
                    .then(() => {
                        setStatus({
                            isDisabled: true,
                            isFormOpen: true,
                            submittedData: {
                                ...submittedData,
                            },
                        })
                    })
                    .catch((err: AxiosError<LaravelValidationException>) =>
                        handle422(err, setErrors),
                    )
            }}
            onReset={(_, { setValues, setStatus }) => {
                setValues(JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES)))
                setStatus({ ...DEFAULT_STATUS })
            }}
            component={() => (
                <>
                    <Grid2 xs={12} md={8}>
                        <Field name="details" component={ProductPicker} />
                    </Grid2>

                    <Grid2 xs={12} md={4}>
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
    )
}

export default memo(FormikComponent)

export type FormValuesType = {
    at?: ProductMovement['at']
    paid?: ProductMovement['at']
    cashable_uuid?: CashType['uuid']
    cashable_name?: CashType['name']
    buyer_user_uuid?: ProductMovementSale['buyer_user_uuid']
    buyer_user?: ProductMovementSale['buyer_user']
    no?: ProductMovementSale['no']
    total_payment?: ProductMovementSale['total_payment']
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
    isDisabled: boolean
    isFormOpen: boolean
    submittedData?: Required<FormValuesType>
}

const DEFAULT_STATUS: FormikStatusType = {
    isDisabled: false,
    isFormOpen: false,
}
