'use client'

// vendors
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
// materials
import Container from '@mui/material/Container'
import InputAdornment from '@mui/material/InputAdornment'
// components
import PageTitle from '@/components/page-title'
// formik
import DateField from '@/components/formik-fields/date-field'
import FarmerGroupUuidSelect from '@/components/formik-fields/farmer-group-uuid-select'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form-v2'
import RegionIdAutocomplete from '@/components/formik-fields/region-id-autocomplete'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'

export default function Page() {
    const { user_uuid } = useParams<{
        user_uuid: string
    }>()
    const { back } = useRouter()

    return (
        <Container maxWidth="sm">
            <PageTitle title="Tambah Lahan" />

            <Formik<FormValues>
                initialValues={{
                    user_uuid,
                }}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post(`/clm/members/${user_uuid}/lands`, values)
                        .then(back)
                        .catch(err => handle422(err, setErrors))
                }
                component={InnerFormik}
                onReset={back}
            />
        </Container>
    )
}

function InnerFormik() {
    return (
        <FormikForm>
            <DateField name="planted_at" label="Tanggal Tanam" />

            <NumericField
                name="n_area_hectares"
                label="Luas Lahan"
                numericFormatProps={{
                    slotProps: {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    HA
                                </InputAdornment>
                            ),
                        },
                    },
                }}
            />

            <RegionIdAutocomplete />

            <TextField
                name="address_detail"
                label="Rincian Alamat/Lokasi/Penanda/Tempat"
                textFieldProps={{
                    multiline: true,
                    rows: 2,
                }}
            />

            <TextField name="rea_land_id" label="LAND ID (REA)" />

            <FarmerGroupUuidSelect />

            <TextField
                name="note"
                label="Catatan"
                textFieldProps={{
                    multiline: true,
                    required: false,
                    rows: 2,
                }}
            />
        </FormikForm>
    )
}

interface FormValues {
    user_uuid: string

    n_area_hectares?: number
    planted_at?: string
    address?: string
    rea_land_id?: string
    note?: string
    farmer_group_uuid?: string
}
