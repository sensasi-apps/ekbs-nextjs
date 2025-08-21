// vendors
import { Form, Formik } from 'formik'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// formik
import { TextField } from '@/components/FormikForm'
import FileField from '@/components/FormikForm/file-field'
import Checkbox from '@/components/FormikForm/checkbox'
import type File from '@/dataTypes/File'
// utils
import handle422 from '@/utils/handle-422'
import myAxios from '@/lib/axios'
import type RequisiteUser from '@/features/clm/types/requisite-user'

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

function FormikForm() {
    return (
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
                <Checkbox name="is_approved" innerLabel="Syarat terpenuhi" />
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
    )
}
