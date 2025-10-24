// vendors

import { Formik } from 'formik'
// page components
import InventoryItemForm, {
    type InventoryItemFormValues,
} from '@/app/(auth)/inventories/items/[uuid]/_parts/form'
import axios from '@/lib/axios'
// utils
import errorCatcher from '@/utils/handle-422'

const InventoryItemFormWithFormik = ({
    initialValues,
    onSubmitted,
    onReset,
}: {
    initialValues: InventoryItemFormValues
    onSubmitted: () => void
    onReset: () => void
}) => (
    <Formik
        component={InventoryItemForm}
        enableReinitialize
        initialValues={initialValues}
        onReset={onReset}
        onSubmit={(values, { setErrors }) =>
            axios
                .post(
                    `inventory-items${values.uuid ? `/${values.uuid}` : ''}`,
                    formDataFormatter(values),
                )
                .then(onSubmitted)
                .catch(error => errorCatcher(error, setErrors))
        }
    />
)

export default InventoryItemFormWithFormik

const formDataFormatter = (values: InventoryItemFormValues) => ({
    code: values.code ?? undefined,
    default_rate_rp_per_unit: values.default_rate_rp_per_unit ?? undefined,
    default_rate_unit: values.default_rate_unit ?? undefined,
    desc: values.desc ?? undefined,
    disowned_at: values.disowned_at ?? undefined,
    disowned_note: values.disowned_note ?? undefined,
    name: values.name,
    owned_at: values.owned_at,
    tags: values.tags ?? undefined,
    unfunctional_note: values.unfunctional_note ?? undefined,
})
