import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'
import CashType from '@/dataTypes/Cash'
import { FormHelperText } from '@mui/material'
import { FieldProps } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import ApiUrl from '../../../../../../@enums/api-url'
import { FormikStatusType } from '../../../../..'

function CashableUuidFieldComponent({
    field: { name: fieldName, value },
    form: { setFieldValue, getFieldMeta, isSubmitting, status },
}: FieldProps) {
    const typedStatus = status as FormikStatusType

    const { error } = getFieldMeta(fieldName)
    const { data: cashes } = useSWR<CashType[]>(ApiUrl.CASHES, null, {
        keepPreviousData: true,
    })

    return (
        <>
            <ScrollableXBox gap={0.75}>
                {cashes?.map(({ uuid, name }) => (
                    <ChipSmall
                        key={uuid}
                        label={name}
                        variant="outlined"
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        color={uuid === value ? 'success' : undefined}
                        sx={{
                            color: uuid !== value ? 'text.disabled' : undefined,
                        }}
                        onClick={() => {
                            setFieldValue('cashable_name', name)
                            setFieldValue(fieldName, uuid)
                        }}
                    />
                ))}
            </ScrollableXBox>

            <FormHelperText error>{error}</FormHelperText>
        </>
    )
}

export default memo(CashableUuidFieldComponent)
