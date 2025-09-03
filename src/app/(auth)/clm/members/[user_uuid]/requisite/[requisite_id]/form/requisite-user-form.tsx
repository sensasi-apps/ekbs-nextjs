// vendors
import { Form, Formik, type FormikProps } from 'formik'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// formik
import TextField from '@/components/formik-fields/text-field'
import FileField from '@/components/formik-fields/file-field'
import CheckboxFields from '@/components/formik-fields/checkbox-fields'
import type File from '@/dataTypes/File'
// utils
import handle422 from '@/utils/handle-422'
import myAxios from '@/lib/axios'
import type RequisiteUser from '@/modules/clm/types/orms/requisite-user'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'

type RequisiteUserFormField = {
    note: RequisiteUser['note']
    files: File[]
    is_approved: boolean
}

export default function RequisiteUserForm({
    user_uuid,
    requisite_id,
    data,
}: {
    user_uuid: RequisiteUser['user_uuid']
    requisite_id: RequisiteUser['requisite_id']
    data: RequisiteUserFormField
}) {
    return (
        <Formik<RequisiteUserFormField>
            initialValues={data}
            onSubmit={(values, { setErrors }) => {
                return myAxios
                    .post(`/clm/members/${user_uuid}/${requisite_id}`, values, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(() => {
                        history.back()
                    })
                    .catch(error => handle422(error, setErrors))
            }}
            component={FormikForm}
            onReset={() => {
                history.back()
            }}
        />
    )
}

function FormikForm({ errors }: FormikProps<RequisiteUserFormField>) {
    return (
        <>
            <Form>
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

                <Box mt={5} display="flex" justifyContent="flex-end">
                    <Button type="reset" variant="outlined" color="success">
                        Batal
                    </Button>

                    <Button type="submit" variant="contained" color="success">
                        Simpan
                    </Button>
                </Box>
            </Form>

            <ErrorDisplay errors={errors} />
        </>
    )
}

function ErrorDisplay({
    errors,
}: {
    errors: FormikProps<RequisiteUserFormField>['errors']
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
