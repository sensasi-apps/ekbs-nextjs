import useSWR from 'swr'
import CheckboxFields from '@/components/formik-fields/checkbox-fields'
import LoadingCenter from '@/components/loading-center'
import type CertificationORM from '@/modules/clm/types/orms/certification'

export default function CertificationCheckboxes() {
    const { data: certifications } = useSWR<
        {
            id: CertificationORM['id']
            name: CertificationORM['name']
        }[]
    >('clm/certifications/select-data')

    if (!certifications) return <LoadingCenter />

    return (
        <CheckboxFields
            label="Sertifikasi"
            name="certifications"
            options={certifications.map(({ id, name }) => ({
                label: name,
                value: `${id}`,
            }))}
        />
    )
}
