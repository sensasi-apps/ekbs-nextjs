// vendors

// icons-materials
import AddCircle from '@mui/icons-material/AddCircle'
// materials
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import type { FieldProps } from 'formik'
import { memo } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import CostItem from '../../../../../../../../../../../app/mart-product-sales/_parts/shared-subcomponents/cost-item'
//
import type { FormikStatusType, FormValuesType } from '../../../../..'

function CostFieldComponent({
    form: { setFieldValue, isSubmitting, errors, status, getFieldMeta },
    field: { value, name },
}: FieldProps<FormValuesType['costs']>) {
    const typedStatus: FormikStatusType = status
    const debounceHandleDataChange = useDebouncedCallback(
        (i: number, data: FormValuesType['costs'][0]) =>
            setFieldValue(name, [
                ...value.slice(0, i),
                data,
                ...value.slice(i + 1),
            ]),
        500,
    )

    const { error } = getFieldMeta(name)

    return (
        <>
            <Grid alignItems="center" container spacing={1}>
                {value.map((cost, i) => (
                    <CostItem
                        data={cost}
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        error={error?.[i] as { name?: string; rp?: string }}
                        errors={errors}
                        index={i}
                        /**
                         * @todo remove errors prop
                         */
                        key={i}
                        onDataChange={data => debounceHandleDataChange(i, data)}
                        onRemove={() =>
                            setFieldValue(name, [
                                ...value.slice(0, i),
                                ...value.slice(i + 1),
                            ])
                        }
                        setFieldValue={setFieldValue}
                    />
                ))}
            </Grid>

            <Button
                color="success"
                disabled={isSubmitting || !!typedStatus?.isDisabled}
                onClick={() =>
                    setFieldValue(name, [
                        ...value,
                        {
                            name: '',
                            rp: null,
                        },
                    ])
                }
                size="small"
                startIcon={<AddCircle />}
                sx={{
                    mt: 2,
                }}>
                Tambah Biaya Lainnya
            </Button>
        </>
    )
}

export default memo(CostFieldComponent)
