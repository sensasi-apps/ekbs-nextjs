'use client'

import Autocomplete from '@/components/Inputs/Autocomplete'
import { useFormikContext } from 'formik'
import { useState } from 'react'

export default function RegionIdAutocomplete() {
    const { isSubmitting, setFieldValue } = useFormikContext()
    const [innerValue, setInnerValue] = useState(null)

    return (
        <Autocomplete
            required
            disabled={isSubmitting}
            margin="dense"
            value={innerValue}
            onChange={(_, value) => {
                if (value) {
                    setInnerValue(value)
                    setFieldValue('region_id', `${value.id}`)
                } else {
                    setInnerValue(null)
                    setFieldValue('region_id', null)
                }
            }}
            endpoint="/select2/administrative-regions"
            label="Wilayah Administratif"
        />
    )
}
