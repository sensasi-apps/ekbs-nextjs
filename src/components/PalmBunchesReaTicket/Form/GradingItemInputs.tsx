import type PalmBunchesReaGradingItemType from '@/dataTypes/PalmBunchesReaGradingItem'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, memo } from 'react'
import useSWR from 'swr'
import { NumericFormat } from 'react-number-format'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// components
import Skeletons from '@/components/Global/Skeletons'
// providers
import useFormData from '@/providers/useFormData'
import debounce from '@/lib/debounce'

const GradingItemInputs: FC<{
    disabled: boolean
    clearByName: (name: string) => void
    validationErrors: ValidationErrorsType
}> = ({ disabled, clearByName, validationErrors }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()

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
        debounce(() => setData({ ...data, gradings: [...gradings] }), 200)
    }

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
                            defaultValue={grading.id}
                        />

                        <input
                            type="hidden"
                            name={`gradings[${index}][item_id]`}
                            defaultValue={grading.item.id}
                        />

                        <NumericFormat
                            customInput={TextField}
                            disabled={disabled}
                            fullWidth
                            required
                            margin="dense"
                            label={grading.item.name}
                            size="small"
                            name={`gradings[${index}][value]`}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            InputProps={{
                                endAdornment: grading.item.unit,
                            }}
                            onValueChange={({ floatValue }) =>
                                handleChange(index, floatValue)
                            }
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
