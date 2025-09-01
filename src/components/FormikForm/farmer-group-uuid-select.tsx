'use client'

import SelectFromApi from '@/components/Global/SelectFromApi'
import { useFormikContext } from 'formik'

export default function FarmerGroupUuidSelect() {
    const { isSubmitting, getFieldProps } = useFormikContext<{
        farmer_group_uuid: string
    }>()

    const { name, value, onChange } = getFieldProps('farmer_group_uuid')

    return (
        <SelectFromApi
            selectProps={{
                name: name,
                size: 'small',
                value: value ?? '',
                required: true,
                disabled: isSubmitting,
            }}
            margin="dense"
            onChange={onChange}
            endpoint="/data/farmer-groups"
            label="Kelompok Tani"
        />
    )
}
