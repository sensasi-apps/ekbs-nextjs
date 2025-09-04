'use client'

// vendors
import type { UUID } from 'crypto'
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import myAxios from '@/lib/axios'
// materials
import Container from '@mui/material/Container'
// components
import PageTitle from '@/components/page-title'
import LoadingCenter from '@/components/loading-center'
// utils
import handle422 from '@/utils/handle-422'
// modules
import type LandORM from '@/modules/clm/types/orms/land'
import LandForm, {
    type LandFormValues,
} from '@/modules/clm/components/land-form'
import shortUuid from '@/utils/short-uuid'

export default function Page() {
    const { user_uuid, land_uuid } = useParams<{
        user_uuid: string
        land_uuid: string
    }>()
    const { back } = useRouter()

    const { data } = useSWR<LandORM>(
        `/clm/members/${user_uuid}/lands/${land_uuid}`,
    )

    if (!data) return <LoadingCenter />

    return (
        <Container maxWidth="sm">
            <PageTitle
                title="Perbarui Lahan"
                subtitle={shortUuid(land_uuid as UUID)}
            />

            <Formik<LandFormValues>
                initialStatus={{
                    region: data.address.region,
                }}
                initialValues={{
                    user_uuid,
                    address_detail: data.address.detail,
                    rea_land_id: data.rea_land_id,
                    note: data.note,
                    farmer_group_uuid: data.farmer_group?.uuid,
                    n_area_hectares: data.n_area_hectares,
                    planted_at: data.planted_at,
                    region_id: data.address.region?.id,
                }}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post(
                            `/clm/members/${user_uuid}/lands/${land_uuid}`,
                            values,
                        )
                        .then(back)
                        .catch(err => handle422(err, setErrors))
                }
                component={LandForm}
                onReset={back}
            />
        </Container>
    )
}
