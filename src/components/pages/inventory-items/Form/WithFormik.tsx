// types
import type InventoryItem from '@/dataTypes/InventoryItem'
// vendors
import axios from '@/lib/axios'
import { Formik } from 'formik'
// page components
import InventoryItemForm from '@/components/pages/inventory-items/Form'
// utils
import errorCatcher from '@/utils/errorCatcher'

const InventoryItemFormWithFormik = ({
    initialValues,
    onSubmitted,
    onReset,
}: {
    initialValues: Partial<InventoryItem>
    onSubmitted: () => void
    onReset: () => void
}) => (
    <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { setErrors }) =>
            axios
                .post(
                    `inventory-items${values.uuid ? '/' + values.uuid : ''}`,
                    formDataFormatter(values),
                )
                .then(onSubmitted)
                .catch(error => errorCatcher(error, setErrors))
        }
        onReset={onReset}
        component={InventoryItemForm}
    />
)

export default InventoryItemFormWithFormik

const formDataFormatter = (values: Partial<InventoryItem>) => ({
    name: values.name,
    desc: values.desc ?? undefined,
    owned_at: values.owned_at,
    disowned_at: values.disowned_at ?? undefined,
    disowned_note: values.disowned_note ?? undefined,
    unfunctional_note: values.unfunctional_note ?? undefined,
    tags: values.tags ?? undefined,
})
