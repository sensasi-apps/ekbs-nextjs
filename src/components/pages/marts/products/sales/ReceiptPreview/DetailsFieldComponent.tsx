import {
    Card,
    CardActionArea,
    CardContent,
    FormHelperText,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FieldProps } from 'formik'
import { memo, useState } from 'react'
// subcomponents
import DetailItem from './DetailItem'
import { FormikStatusType, FormValuesType } from '../FormikComponent'
import { DetailItemFormDialog } from './detail-item-form-dialog'

function DetailsFieldComponent({
    field: { value, name },
    form: { setFieldValue, getFieldMeta, isSubmitting, status },
}: FieldProps<FormValuesType['details']>) {
    const typedStatus: FormikStatusType = status
    const { error } = getFieldMeta(name)
    const [selectedDetail, setSelectedDetail] = useState<
        FormValuesType['details'][0] | null
    >(null)

    function closeDialog() {
        setSelectedDetail(null)
    }

    return (
        <>
            {value.map((detail, i) => (
                <Card key={i}>
                    <CardActionArea
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        onClick={() => {
                            setSelectedDetail(detail)
                        }}>
                        <CardContent
                            sx={{
                                py: 1.2,
                            }}>
                            <Grid2 container alignItems="center">
                                <DetailItem
                                    key={i}
                                    data={detail}
                                    disabled={
                                        isSubmitting ||
                                        !!typedStatus?.isDisabled
                                    }
                                    onDecreaseQtyItem={() => {
                                        const detailItem = value[i]

                                        const newValue =
                                            value[i].qty === 1
                                                ? value.filter(
                                                      (_, idx) => idx !== i,
                                                  )
                                                : [
                                                      ...value.slice(0, i),
                                                      {
                                                          ...detailItem,
                                                          qty:
                                                              Math.abs(
                                                                  detailItem.qty,
                                                              ) - 1,
                                                      },
                                                      ...value.slice(i + 1),
                                                  ]

                                        setFieldValue('details', newValue)
                                    }}
                                />
                            </Grid2>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}

            <DetailItemFormDialog data={selectedDetail} onClose={closeDialog} />

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
