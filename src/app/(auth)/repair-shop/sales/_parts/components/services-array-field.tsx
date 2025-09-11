// vendors
import {
    type FieldProps,
    type FieldArrayRenderProps,
    Field,
    FieldArray,
} from 'formik'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// components
import NumericField from '@/components/formik-fields/numeric-field'
// features
import type { FormData } from './sale-form-dialog'
import type Service from '@/app/(auth)/repair-shop/services/_parts/types/service'
import RemoveButton from '@/components/remove-button'
import { useRef } from 'react'

export default function ServicesArrayField({
    isDisabled,
}: {
    isDisabled: boolean
}) {
    return (
        <FieldArray
            name="services"
            render={({
                name,
                form: { values, setFieldValue },
                remove,
                push,
            }: FieldArrayRenderProps) => {
                const typedValues = values as FormData
                const services = typedValues.services ?? []

                return (
                    <>
                        <Box display="flex" gap={2} alignItems="center" mb={2}>
                            <Typography fontWeight="bold" component="div">
                                Layanan
                            </Typography>

                            <AddItemButton
                                isDisabled={isDisabled}
                                push={push}
                            />
                        </Box>

                        {services.map((_, i) => (
                            <Box
                                display="flex"
                                key={i}
                                gap={2}
                                alignItems="center">
                                <RemoveButton
                                    onClick={() => remove(i)}
                                    isDisabled={isDisabled}
                                />

                                {i + 1}

                                <ServiceField
                                    name={`${name}.${i}.service_id`}
                                    onChange={(_, selected) => {
                                        setFieldValue(
                                            `${name}.${i}.service_id`,
                                            selected?.id,
                                        )

                                        setFieldValue(
                                            `${name}.${i}.rp`,
                                            selected?.default_price,
                                        )
                                    }}
                                    isDisabled={isDisabled}
                                />

                                <NumericField
                                    name={`${name}.${i}.rp`}
                                    label="Harga (Rp)"
                                    disabled={isDisabled}
                                    numericFormatProps={{
                                        margin: 'none',
                                        value: services[i].rp,
                                    }}
                                />
                            </Box>
                        ))}
                    </>
                )
            }}
        />
    )
}

function ServiceField({
    isDisabled,
    name,
    onChange,
}: {
    isDisabled: boolean
    name: string
    onChange: (ev: React.SyntheticEvent, selected: Service | null) => void
}) {
    const { data: services = [], isLoading } = useSWR<Service[]>(
        '/repair-shop/sales/get-services',
    )

    if (isLoading) {
        return (
            <Box width="100%">
                <Skeleton variant="rounded" />
            </Box>
        )
    }

    return (
        <Field name={name}>
            {({ field }: FieldProps) => {
                const value =
                    services.find(sparePart => sparePart.id == field.value) ??
                    null

                return (
                    <Autocomplete
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        id={field.name}
                        value={value}
                        options={services}
                        disabled={isDisabled}
                        fullWidth
                        getOptionLabel={sparePart =>
                            `${sparePart.id} — ${sparePart.name}`
                        }
                        onChange={onChange}
                        renderInput={params => (
                            <TextField
                                {...params}
                                required
                                label="Layanan"
                                size="small"
                                margin="none"
                            />
                        )}
                    />
                )
            }}
        </Field>
    )
}

function AddItemButton({
    isDisabled,
    push,
}: {
    isDisabled: boolean
    push: (obj: object) => void
}) {
    const nRow = useRef(1)

    return (
        <Box display="flex" alignItems="center" mt={1}>
            <TextField
                disabled={isDisabled}
                fullWidth={false}
                size="small"
                type="number"
                defaultValue={1}
                label="Tambah baris"
                slotProps={{ input: { inputProps: { min: 1, max: 99 } } }}
                sx={{
                    maxWidth: '4em',
                }}
                onChange={e => (nRow.current = Number(e.target.value))}
            />

            <Tooltip placement="top" arrow title="Tambah">
                <span>
                    <IconButton
                        disabled={isDisabled}
                        color="success"
                        size="small"
                        onClick={() => {
                            for (let i = 0; i < nRow.current; i++) {
                                push({})
                            }
                        }}>
                        <AddCircleIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}
