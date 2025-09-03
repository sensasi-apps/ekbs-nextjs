import type PalmBunchesReaGradingItemType from '@/dataTypes/PalmBunchesReaGradingItem'
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'

import { type FC, memo } from 'react'
import useSWR from 'swr'
import { NumericFormat } from 'react-number-format'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// components
import Skeletons from '@/components/Global/Skeletons'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'

const GradingItemInputs: FC<{
    disabled: boolean
    clearByName: (name: string) => void
    validationErrors: LaravelValidationExceptionResponse['errors']
}> = ({ disabled, clearByName, validationErrors }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicket>()

    const { data: gradingItemActives, isLoading } = useSWR<
        PalmBunchesReaGradingItemType[]
    >(!data.gradings ? '/data/rea-grading-item-actives' : null, {
        revalidateOnFocus: false,
    })

    const gradings =
        data.gradings ??
        gradingItemActives?.map(activeItem => ({
            id: undefined,
            item: activeItem,
            value: undefined,
        }))

    const handleChange = (index: number, value?: number) => {
        clearByName(`gradings.${index}.value`)

        if (!data.gradings) {
            data.gradings = [...gradings]
        }

        data.gradings[index].value = value
    }

    const handleBlur = () =>
        data.id
            ? null
            : setData({
                  ...data,
                  gradings: [...gradings],
              })

    return (
        <>
            <Typography variant="h6" component="h2" gutterBottom>
                Data Grading
            </Typography>

            {isLoading && <Skeletons />}

            {!isLoading &&
                gradings.map((grading, index) => (
                    <div key={index}>
                        <input
                            type="hidden"
                            name={`gradings[${index}][id]`}
                            value={grading.id ?? ''}
                        />

                        <input
                            type="hidden"
                            name={`gradings[${index}][item_id]`}
                            value={grading.item.id}
                        />

                        <NumericFormat
                            customInput={TextField}
                            disabled={disabled}
                            fullWidth
                            required
                            margin="dense"
                            label={grading.item.name}
                            size="small"
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            name={`gradings[${index}][value]`}
                            InputProps={{
                                endAdornment: grading.item.unit,
                            }}
                            onValueChange={({ floatValue }) =>
                                handleChange(index, floatValue)
                            }
                            onBlur={handleBlur}
                            value={grading.value ?? ''}
                            error={Boolean(
                                validationErrors[`gradings.${index}.value`],
                            )}
                            helperText={
                                validationErrors[`gradings.${index}.value`]
                            }
                        />
                    </div>
                ))}
        </>
    )
}

export default memo(GradingItemInputs)
