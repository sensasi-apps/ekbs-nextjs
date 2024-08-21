import { FormValuesType } from '@/pages/marts/products/sales'
import { FormHelperText, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FieldProps } from 'formik'
import { memo } from 'react'
import DetailItem from './DetailItem'

function DetailsFieldComponent({
    field: { value, name },
    form: { setFieldValue, getFieldMeta, isSubmitting },
}: FieldProps<FormValuesType['details']>) {
    const { error } = getFieldMeta(name)

    return (
        <>
            <Grid2 container alignItems="center">
                {value.length > 0 ? (
                    value.map((detail, i) => (
                        <DetailItem
                            key={i}
                            data={detail}
                            disabled={isSubmitting}
                            onDecreaseQtyItem={() => {
                                const detailItem = value[i]

                                const newValue =
                                    value[i].qty === 1
                                        ? value.filter((_, idx) => idx !== i)
                                        : [
                                              ...value.slice(0, i),
                                              {
                                                  ...detailItem,
                                                  qty: detailItem.qty - 1,
                                              },
                                              ...value.slice(i + 1),
                                          ]

                                setFieldValue('details', newValue)
                            }}
                        />
                    ))
                ) : (
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        component="div"
                        sx={{
                            fontStyle: 'italic',
                        }}>
                        Belum ada barang yang ditambahkan...
                    </Typography>
                )}
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
