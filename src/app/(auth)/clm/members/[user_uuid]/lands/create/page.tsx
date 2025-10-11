'use client'

// materials
import Container from '@mui/material/Container'
// vendors
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
// components
import PageTitle from '@/components/page-title'
// formik
import myAxios from '@/lib/axios'
import LandForm, {
    type LandFormValues,
} from '@/modules/clm/components/land-form'
import handle422 from '@/utils/handle-422'

export default function Page() {
    const { user_uuid } = useParams<{
        user_uuid: string
    }>()
    const { back } = useRouter()

    return (
        <Container maxWidth="sm">
            <PageTitle title="Tambah Lahan" />

            <Formik<LandFormValues>
                component={LandForm}
                initialValues={{
                    user_uuid,
                }}
                onReset={back}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post(`/clm/members/${user_uuid}/lands`, values)
                        .then(back)
                        .catch(err => handle422(err, setErrors))
                }
            />
        </Container>
    )
}
