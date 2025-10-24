// vendors

// materials
import FormHelperText from '@mui/material/FormHelperText'
import type { FieldProps } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'
// components
import type { FormikStatusType } from '../../../../..'

function CashableUuidFieldComponent({
    field: { name: fieldName, value },
    form: { setFieldValue, getFieldMeta, isSubmitting, status },
}: FieldProps) {
    const typedStatus = status as FormikStatusType

    const { error } = getFieldMeta(fieldName)
    const { data: cashes } = useSWR<
        {
            uuid: string
            name: string
        }[]
    >('marts/products/sales/cashes', null, {
        keepPreviousData: true,
    })

    return (
        <>
            <ScrollableXBox gap={0.75}>
                {cashes?.map(({ uuid, name }) => (
                    <ChipSmall
                        color={uuid === value ? 'success' : undefined}
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        key={uuid}
                        label={name}
                        onClick={() => {
                            setFieldValue('cashable_name', name)
                            setFieldValue(fieldName, uuid)
                        }}
                        sx={{
                            color: uuid !== value ? 'text.disabled' : undefined,
                        }}
                        variant="outlined"
                    />
                ))}
            </ScrollableXBox>

            <FormHelperText error>{error}</FormHelperText>
        </>
    )
}

export default memo(CashableUuidFieldComponent)
