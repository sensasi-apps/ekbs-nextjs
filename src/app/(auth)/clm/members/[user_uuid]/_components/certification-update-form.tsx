import { Form, Formik, type FormikProps } from 'formik'
import myAxios from '@/lib/axios'
import LoadingCenter from '@/components/loading-center'
// materials
import Button from '@mui/material/Button'
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
            component={InnerForm}
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
