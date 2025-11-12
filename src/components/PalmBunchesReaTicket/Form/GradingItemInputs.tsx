import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type FC, memo } from 'react'
import { NumericFormat } from 'react-number-format'
import useSWR from 'swr'
// components
import Skeletons from '@/components/Global/Skeletons'
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
import type PalmBunchesReaGradingItemORM from '@/modules/palm-bunch/types/orms/palm-bunches-rea-grading-item'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'

const GradingItemInputs: FC<{
    disabled: boolean
    clearByName: (name: string) => void
    validationErrors: LaravelValidationExceptionResponse['errors']
}> = ({ disabled, clearByName, validationErrors }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketORM>()

    const { data: gradingItemActives, isLoading } = useSWR<
        PalmBunchesReaGradingItemORM[]
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
            <Typography component="h2" gutterBottom variant="h6">
                Data Grading
            </Typography>

            {isLoading && <Skeletons />}

            {!isLoading &&
                gradings.map((grading, index) => (
                    <div key={grading.id}>
                        <input
                            name={`gradings[${index}][id]`}
                            type="hidden"
                            value={grading.id ?? ''}
                        />

                        <input
                            name={`gradings[${index}][item_id]`}
                            type="hidden"
                            value={grading.item.id}
                        />

                        <NumericFormat
                            allowNegative={false}
                            customInput={TextField}
                            decimalSeparator=","
                            disabled={disabled}
                            error={Boolean(
                                validationErrors[`gradings.${index}.value`],
                            )}
                            fullWidth
                            helperText={
                                validationErrors[`gradings.${index}.value`]
                            }
                            InputProps={{
                                endAdornment: grading.item.unit,
                            }}
                            label={grading.item.name}
                            margin="dense"
                            name={`gradings[${index}][value]`}
                            onBlur={handleBlur}
                            onValueChange={({ floatValue }) =>
                                handleChange(index, floatValue)
                            }
                            required
                            size="small"
                            thousandSeparator="."
                            value={grading.value ?? ''}
                        />
                    </div>
                ))}
        </>
    )
}

export default memo(GradingItemInputs)
