// types
import type ProductMovementDetail from '@/dataTypes/ProductMovementDetail'
import type ProductOpanameType from '@/dataTypes/ProductOpname'
import type { ProductOpnameMovementType } from '@/dataTypes/ProductMovement'
// vendors
import { memo } from 'react'
import dayjs from 'dayjs'
import { FastField, type FormikErrors, type FormikProps } from 'formik'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ProductMovementDetailArrayField from './Form/ProductMovementDetailArrayField'

const ProductOpnameForm = memo(function ProductOpnameForm({
    dirty,
    errors,
    isSubmitting,
    values: { at, product_opname_movement_details },
    status,
    setFieldValue,
}: FormikProps<typeof EMPTY_FORM_DATA>) {
    const isNew = !status?.uuid
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || !isNew

    return (
        <FormikForm
            id="product-opname-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <DatePicker
                value={at ? dayjs(at) : null}
                disabled={isDisabled}
                label="Tanggal Opname"
                onChange={date =>
                    setFieldValue('at', date?.format('YYYY-MM-DD'))
                }
                slotProps={{
                    textField: {
                        name: 'at',
                        ...errorsToHelperTextObj(errors.at),
                    },
                }}
            />

            <ProductMovementDetailArrayField
                errors={
                    errors?.product_opname_movement_details as FormikErrors<
                        (typeof EMPTY_FORM_DATA)['product_opname_movement_details']
                    >
                }
                data={product_opname_movement_details}
                disabled={isDisabled}
            />

            <FastField
                name="note"
                component={TextFieldFastableComponent}
                required={false}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan"
                margin="normal"
                {...errorsToHelperTextObj(errors.note)}
            />
        </FormikForm>
    )
})

export default ProductOpnameForm

type ProductOpnameMovementDetail = ProductMovementDetail & {
    physical_qty: '' | number
}

export const EMPTY_FORM_DATA: {
    at: null | ProductOpanameType['at']
    note: '' | ProductOpanameType['note']
    product_opname_movement_details: ProductOpnameMovementDetail[]
} = {
    at: null,
    note: '',
    product_opname_movement_details: [{} as ProductOpnameMovementDetail],
}

export const EMPTY_FORM_STATUS: null | ProductOpnameMovementType = null
