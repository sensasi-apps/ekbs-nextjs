// materials
import InputAdornment from '@mui/material/InputAdornment'
// formik
import DateField from '@/components/formik-fields/date-field'
import FarmerGroupUuidSelect from '@/components/formik-fields/farmer-group-uuid-select'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form-v2'
import RegionIdAutocomplete from '@/components/formik-fields/region-id-autocomplete'

export interface LandFormValues {
    user_uuid: string

    n_area_hectares?: number
    planted_at?: string
    address_detail?: string
    rea_land_id?: string
    note?: string
    farmer_group_uuid?: string
    region_id?: number
}

export default function LandForm() {
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

            <TextField
                name="rea_land_id"
                label="LAND ID (REA)"
                textFieldProps={{
                    required: false,
                }}
            />

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
