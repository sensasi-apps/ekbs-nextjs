import { FormValuesType } from '@/pages/marts/products/sales'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FieldProps } from 'formik'
import { memo } from 'react'
import CostItem from './CostItem'
import { Button } from '@mui/material'
import AddCircle from '@mui/icons-material/AddCircle'
import { useDebouncedCallback } from 'use-debounce'

function CostFieldComponent({
    form: { setFieldValue },
    field: { value, name },
}: FieldProps<FormValuesType['costs']>) {
    const debounceHandleDataChange = useDebouncedCallback(
        (i: number, data: FormValuesType['costs'][0]) =>
            setFieldValue(name, [
                ...value.slice(0, i),
                data,
                ...value.slice(i + 1),
            ]),
        500,
    )

    return (
        <>
            <Grid2 container alignItems="center" spacing={1}>
                {value.map((cost, i) => (
                    <CostItem
                        key={i}
                        data={cost}
                        setFieldValue={setFieldValue}
                        onRemove={() =>
                            setFieldValue(name, [
                                ...value.slice(0, i),
                                ...value.slice(i + 1),
                            ])
                        }
                        onDataChange={data => debounceHandleDataChange(i, data)}
                        // onNameChange={({ target: { value: nameValue } }) =>
                        //     setFieldValue(name, [
                        //         ...value.slice(0, i),
                        //         {
                        //             ...value[i],
                        //             name: nameValue,
                        //         },
                        //         ...value.slice(i + 1),
                        //     ])
                        // }
                        // onRpChange={({ floatValue }) =>
                        //     setFieldValue(name, [
                        //         ...value.slice(0, i),
                        //         {
                        //             ...value[i],
                        //             rp: floatValue,
                        //         },
                        //         ...value.slice(i + 1),
                        //     ])
                        // }
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
