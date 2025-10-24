'use client'

// materials
import FormHelperText from '@mui/material/FormHelperText'
// vendors
import { useFormikContext } from 'formik'
import { useState } from 'react'
// components
import Autocomplete from '@/components/Inputs/Autocomplete'

export default function RegionIdAutocomplete() {
    const { isSubmitting, setFieldValue, status, errors } = useFormikContext<{
        region_id: number
    }>()
    const [innerValue, setInnerValue] = useState(status?.region ?? null)

    return (
        <>
            <Autocomplete
                disabled={isSubmitting}
                endpoint="/select2/administrative-regions"
                label="Wilayah Administratif"
                margin="dense"
                onChange={(_, value) => {
                    if (value) {
                        setInnerValue(value)
                        setFieldValue('region_id', `${value.id}`)
                    } else {
                        setInnerValue(null)
                        setFieldValue('region_id', null)
                    }
                }}
                required
                value={innerValue}
            />

            {errors.region_id && (
                <FormHelperText error>{errors.region_id}</FormHelperText>
            )}
        </>
    )
}
