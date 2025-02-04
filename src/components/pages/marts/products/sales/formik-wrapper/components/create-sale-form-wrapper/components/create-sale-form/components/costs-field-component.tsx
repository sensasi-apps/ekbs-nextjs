// vendors
import type { FieldProps } from 'formik'
import { memo } from 'react'
import { useDebouncedCallback } from 'use-debounce'
// materials
import Button from '@mui/material/Button'
import Grid2 from '@mui/material/Grid2'
// icons-materials
import AddCircle from '@mui/icons-material/AddCircle'
//
import type { FormikStatusType, FormValuesType } from '../../../../..'
import CostItem from '../../../../../../@shared-subcomponents/cost-item'

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
            <Grid2 container alignItems="center" spacing={1}>
                {value.map((cost, i) => (
                    <CostItem
                        key={i}
                        index={i}
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        data={cost}
                        setFieldValue={setFieldValue}
                        /**
                         * @todo remove errors prop
                         */
                        errors={errors}
                        error={error?.[i] as { name?: string; rp?: string }}
                        onRemove={() =>
                            setFieldValue(name, [
                                ...value.slice(0, i),
                                ...value.slice(i + 1),
                            ])
                        }
                        onDataChange={data => debounceHandleDataChange(i, data)}
                    />
                ))}
            </Grid2>

            <Button
                sx={{
                    mt: 2,
                }}
                startIcon={<AddCircle />}
                size="small"
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
                }>
                Tambah Biaya Lainnya
            </Button>
        </>
    )
}

export default memo(CostFieldComponent)
