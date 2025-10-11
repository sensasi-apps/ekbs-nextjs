'use client'

// materials
import Container from '@mui/material/Container'
// vendors
import type { UUID } from 'crypto'
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import LoadingCenter from '@/components/loading-center'
// components
import PageTitle from '@/components/page-title'
import myAxios from '@/lib/axios'
import LandForm, {
    type LandFormValues,
} from '@/modules/clm/components/land-form'
// modules
import type LandORM from '@/modules/clm/types/orms/land'
// utils
import handle422 from '@/utils/handle-422'
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
                subtitle={shortUuid(land_uuid as UUID)}
                title="Perbarui Lahan"
            />

            <Formik<LandFormValues>
                component={LandForm}
                initialStatus={{
                    region: data.address.region,
                }}
                initialValues={{
                    address_detail: data.address.detail,
                    farmer_group_uuid: data.farmer_group?.uuid,
                    n_area_hectares: data.n_area_hectares,
                    note: data.note,
                    planted_at: data.planted_at,
                    rea_land_id: data.rea_land_id,
                    region_id: data.address.region?.id,
                    user_uuid,
                }}
                onReset={back}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post(
                            `/clm/members/${user_uuid}/lands/${land_uuid}`,
                            values,
                        )
                        .then(back)
                        .catch(err => handle422(err, setErrors))
                }
            />
        </Container>
    )
}
