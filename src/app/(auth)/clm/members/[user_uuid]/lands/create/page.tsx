'use client'

// vendors
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
// materials
import Container from '@mui/material/Container'
// components
import PageTitle from '@/components/page-title'
// formik
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
import LandForm, {
    type LandFormValues,
} from '@/modules/clm/components/land-form'

export default function Page() {
    const { user_uuid } = useParams<{
        user_uuid: string
    }>()
    const { back } = useRouter()

    return (
        <Container maxWidth="sm">
            <PageTitle title="Tambah Lahan" />

            <Formik<LandFormValues>
                initialValues={{
                    user_uuid,
                }}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post(`/clm/members/${user_uuid}/lands`, values)
                        .then(back)
                        .catch(err => handle422(err, setErrors))
                }
                component={LandForm}
                onReset={back}
            />
        </Container>
    )
}
