// vendors
import { Formik, type FormikProps } from 'formik'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
// formik
import FormikForm from '@/components/formik-form-v2'
import FileField from '@/components/formik-fields/file-field'
import TextField from '@/components/formik-fields/text-field'
import CheckboxFields from '@/components/formik-fields/checkbox-fields'
// utils
import handle422 from '@/utils/handle-422'
import myAxios from '@/lib/axios'
import type RequisiteUser from '@/modules/clm/types/orms/requisite-user'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
// orms
import type File from '@/types/orms/file'

interface UserOrLandRequisiteFormField {
    note: RequisiteUser['note']
    files: File[]
    is_approved: boolean
}

export default function UserOrLandRequisiteForm({
    user_uuid,
    requisite_id,
    land_uuid,
    data,
}: {
    user_uuid: string
    requisite_id: RequisiteUser['requisite_id']
    land_uuid: string | null
    data: UserOrLandRequisiteFormField
}) {
    const postUrl = land_uuid
        ? `/clm/members/${user_uuid}/lands/${land_uuid}/${requisite_id}`
        : `/clm/members/${user_uuid}/${requisite_id}`

    return (
        <Formik<UserOrLandRequisiteFormField>
            initialValues={data}
            onSubmit={(values, { setErrors }) => {
                return myAxios
                    .post(postUrl, values, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(() => {
                        history.back()
                    })
                    .catch(error => handle422(error, setErrors))
            }}
            component={Form}
            onReset={() => {
                history.back()
            }}
        />
    )
}

function Form({ errors }: FormikProps<UserOrLandRequisiteFormField>) {
    return (
        <>
            <FormikForm>
                <TextField
                    name="note"
                    label="Catatan"
                    textFieldProps={{
                        multiline: true,
                        rows: 2,
                        required: false,
                    }}
                />

                <Box mt={2}>
                    <FileField name="files" multiple />
                </Box>

                <Box mt={4}>
                    <CheckboxFields
                        name="is_approved"
                        options={[
                            {
                                label: 'Disetujui',
                            },
                        ]}
                    />
                </Box>
            </FormikForm>

            <ErrorDisplay errors={errors} />
        </>
    )
}

function ErrorDisplay({
    errors,
}: {
    errors: FormikProps<UserOrLandRequisiteFormField>['errors']
}) {
    const errorStrings = Object.values(
        errors as unknown as LaravelValidationException['errors'],
    ).flatMap(error => (Array.isArray(error) ? error : [error]))

    return (
        <Box mt={2}>
            {errorStrings.map((error, i) => (
                <Alert key={i} severity="error">
                    {error}
                </Alert>
            ))}
        </Box>
    )
}
