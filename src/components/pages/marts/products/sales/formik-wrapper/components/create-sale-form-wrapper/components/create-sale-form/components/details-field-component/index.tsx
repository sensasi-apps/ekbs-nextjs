'use client'

// materials
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import type { FieldProps } from 'formik'
import { memo, useState } from 'react'
import DetailItem from '../../../../../../../../../../../../app/mart-product-sales/_parts/shared-subcomponents/detail-item'
// sub-components
import type { FormikStatusType, FormValuesType } from '../../../../../..'
import { DetailItemFormDialog } from './components/detail-item-form-dialog'

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
            <FormHelperText
                component="div"
                error
                sx={{
                    mt: -2,
                }}>
                {renderError(error)}
            </FormHelperText>

            {value.length === 0 && (
                <FormHelperText error>
                    Silahkan memilih produk yang terdapat pada bilah di samping
                </FormHelperText>
            )}

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
                            <Grid alignItems="center" container>
                                <DetailItem
                                    data={detail}
                                    disabled={
                                        isSubmitting ||
                                        !!typedStatus?.isDisabled
                                    }
                                    key={i}
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
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}

            <DetailItemFormDialog data={selectedDetail} onClose={closeDialog} />
        </>
    )
}

export default memo(DetailsFieldComponent)

function renderError(
    error?:
        | string
        | {
              product?: string
              qty?: string
              rp_per_unit?: string
              product_id?: string
          }[],
) {
    if (!error) return null

    if (typeof error === 'string') return error

    return error
        .flatMap(err => Array.from(Object.values(err)))
        .map((err, i) => <div key={i}>{err}</div>)
}
