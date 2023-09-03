import { FC } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import NumericFormat from '@/components/Global/NumericFormat'
import ValidationErrorsType from '@/types/ValidationErrors.type'
import PalmBunchesReaGradingDataType from '@/dataTypes/PalmBunchesReaGrading'
import PalmBunchesReaGradingItemDataType from '@/dataTypes/PalmBunchesReaGradingItem'
import Skeletons from '@/components/Global/Skeletons'

const GradingItemInputs: FC<{
    data?: PalmBunchesReaGradingDataType[]
    disabled: boolean
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
    validationErrors: ValidationErrorsType
}> = ({ data: gradings, disabled, clearByEvent, validationErrors }) => {
    const { data: gradingItemActives, isLoading } = useSWR<
        PalmBunchesReaGradingItemDataType[]
    >(
        !gradings ? '/data/rea-grading-item-actives' : null,
        url => axios.get(url).then(res => res.data),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <>
            <Typography variant="h6" component="h2" gutterBottom>
                Data Grading
            </Typography>

            {isLoading && <Skeletons />}

            {(
                gradings ||
                gradingItemActives?.map(activeItem => ({
                    id: undefined,
                    item: activeItem,
                    value: undefined,
                }))
            )?.map((grading, index) => (
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

                    <TextField
                        disabled={disabled}
                        fullWidth
                        required
                        margin="dense"
                        label={grading.item.name}
                        size="small"
                        name={`gradings[${index}][value]`}
                        InputProps={{
                            endAdornment: grading.item.unit,
                            inputComponent: NumericFormat as any,
                        }}
                        onChange={clearByEvent}
                        defaultValue={grading.value}
                        error={Boolean(
                            validationErrors[`gradings[${index}][value]`],
                        )}
                        helperText={
                            validationErrors[`gradings[${index}][value]`]
                        }
                    />
                </div>
            ))}
        </>
    )
}

export default GradingItemInputs
