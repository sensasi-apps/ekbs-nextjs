'use client'

import { useFormikContext } from 'formik'
import SelectFromApi from '@/components/Global/SelectFromApi'

export default function FarmerGroupUuidSelect() {
    const { isSubmitting, getFieldProps, errors } = useFormikContext<{
        farmer_group_uuid: string
    }>()

    const { name, value, onChange } = getFieldProps('farmer_group_uuid')

    return (
        <SelectFromApi
            endpoint="/data/farmer-groups"
            error={Boolean(errors.farmer_group_uuid)}
            helperText={errors.farmer_group_uuid}
            label="Kelompok Tani"
            margin="dense"
            onChange={onChange}
            selectProps={{
                disabled: isSubmitting,
                name: name,
                size: 'small',
                value: value ?? '',
            }}
        />
    )
}
