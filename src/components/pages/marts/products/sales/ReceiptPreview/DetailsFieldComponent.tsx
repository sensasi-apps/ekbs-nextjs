import { FormHelperText } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FieldProps } from 'formik'
import DetailItem from './DetailItem'
import { memo } from 'react'
import { FormikStatusType, FormValuesType } from '../FormikComponent'

function DetailsFieldComponent({
    field: { value, name },
    form: { setFieldValue, getFieldMeta, isSubmitting, status },
}: FieldProps<FormValuesType['details']>) {
    const typedStatus: FormikStatusType = status
    const { error } = getFieldMeta(name)

    return (
        <>
            <Grid2 container alignItems="center">
                {value.map((detail, i) => (
                    <DetailItem
                        key={i}
                        data={detail}
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        onDecreaseQtyItem={() => {
                            const detailItem = value[i]

                            const newValue =
                                value[i].qty === 1
                                    ? value.filter((_, idx) => idx !== i)
                                    : [
                                          ...value.slice(0, i),
                                          {
                                              ...detailItem,
                                              qty: Math.abs(detailItem.qty) - 1,
                                          },
                                          ...value.slice(i + 1),
                                      ]

                            setFieldValue('details', newValue)
                        }}
                    />
                ))}
            </Grid2>

            <FormHelperText
                error
                sx={{
                    mt: -2,
                }}>
                {error}
            </FormHelperText>
        </>
    )
}

export default memo(DetailsFieldComponent)
