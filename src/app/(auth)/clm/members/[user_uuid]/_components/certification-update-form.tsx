// materials
import Button from '@mui/material/Button'
import { Form, Formik, type FormikProps } from 'formik'
import LoadingCenter from '@/components/loading-center'
import myAxios from '@/lib/axios'
// module scope
import CertificationCheckboxes from '@/modules/clm/components/certification-checkboxes'

interface FormValues {
    certifications: string[]
}

export default function CertificationUpdateForm({
    user_uuid,
    certifications,
    onSubmitted,
}: {
    user_uuid: string
    certifications: FormValues['certifications']
    onSubmitted: () => void
}) {
    return (
        <Formik<FormValues>
            component={InnerForm}
            enableReinitialize
            initialValues={{
                certifications,
            }}
            onSubmit={values =>
                myAxios
                    .post(
                        `/clm/members/${user_uuid}/update-certifications`,
                        values,
                    )
                    .then(() => onSubmitted())
            }
        />
    )
}

function InnerForm({ isSubmitting, dirty }: FormikProps<FormValues>) {
    if (isSubmitting) return <LoadingCenter />

    return (
        <Form>
            <CertificationCheckboxes />

            {dirty && <Button type="submit">Simpan</Button>}
        </Form>
    )
}
