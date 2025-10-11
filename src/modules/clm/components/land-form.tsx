// materials
import InputAdornment from '@mui/material/InputAdornment'
// formik
import DateField from '@/components/formik-fields/date-field'
import FarmerGroupUuidSelect from '@/components/formik-fields/farmer-group-uuid-select'
import NumericField from '@/components/formik-fields/numeric-field'
import RegionIdAutocomplete from '@/components/formik-fields/region-id-autocomplete'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form-v2'

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
            <DateField label="Tanggal Tanam" name="planted_at" />

            <NumericField
                label="Luas Lahan"
                name="n_area_hectares"
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
                label="Rincian Alamat/Lokasi/Penanda/Tempat"
                name="address_detail"
                textFieldProps={{
                    multiline: true,
                    rows: 2,
                }}
            />

            <TextField
                label="LAND ID (REA)"
                name="rea_land_id"
                textFieldProps={{
                    required: false,
                }}
            />

            <FarmerGroupUuidSelect />

            <TextField
                label="Catatan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                    rows: 2,
                }}
            />
        </FormikForm>
    )
}
