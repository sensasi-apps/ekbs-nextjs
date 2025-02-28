// vendors
import axios from '@/lib/axios'
import { Formik } from 'formik'
// page components
import InventoryItemForm, {
    type InventoryItemFormValues,
} from '@/components/pages/inventory-items/Form'
// utils
import errorCatcher from '@/utils/errorCatcher'

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

const formDataFormatter = (values: InventoryItemFormValues) => ({
    code: values.code ?? undefined,
    name: values.name,
    desc: values.desc ?? undefined,
    owned_at: values.owned_at,
    disowned_at: values.disowned_at ?? undefined,
    disowned_note: values.disowned_note ?? undefined,
    unfunctional_note: values.unfunctional_note ?? undefined,
    tags: values.tags ?? undefined,
    default_rate_rp_per_unit: values.default_rate_rp_per_unit ?? undefined,
    default_rate_unit: values.default_rate_unit ?? undefined,
})
