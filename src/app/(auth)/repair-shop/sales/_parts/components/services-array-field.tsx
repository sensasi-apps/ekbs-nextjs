// vendors

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import {
    Field,
    FieldArray,
    type FieldArrayRenderProps,
    type FieldProps,
} from 'formik'
import { useRef } from 'react'
import useSWR from 'swr'
// components
import NumericField from '@/components/formik-fields/numeric-field'
import RemoveButton from '@/components/remove-button'
// modules
import type Service from '@/modules/repair-shop/types/orms/service'
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'

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
                const typedValues = values as SaleFormValues
                const services = typedValues.services ?? []

                return (
                    <>
                        <Box alignItems="center" display="flex" gap={2} mb={2}>
                            <Typography component="div" fontWeight="bold">
                                Layanan
                            </Typography>

                            <AddItemButton
                                isDisabled={isDisabled}
                                push={push}
                            />
                        </Box>

                        {services.map(({ service_id }, i) => (
                            <Box
                                alignItems="center"
                                display="flex"
                                gap={2}
                                key={service_id}>
                                <RemoveButton
                                    isDisabled={isDisabled}
                                    onClick={() => remove(i)}
                                />

                                {i + 1}

                                <ServiceField
                                    isDisabled={isDisabled}
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
                                />

                                <NumericField
                                    disabled={isDisabled}
                                    label="Harga (Rp)"
                                    name={`${name}.${i}.rp`}
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
                        disabled={isDisabled}
                        fullWidth
                        getOptionLabel={sparePart =>
                            `${sparePart.id} — ${sparePart.name}`
                        }
                        id={field.name}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        onChange={onChange}
                        options={services}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Layanan"
                                margin="none"
                                required
                                size="small"
                            />
                        )}
                        value={value}
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
        <Box alignItems="center" display="flex" mt={1}>
            <TextField
                defaultValue={1}
                disabled={isDisabled}
                fullWidth={false}
                label="Tambah baris"
                onChange={e => (nRow.current = Number(e.target.value))}
                size="small"
                slotProps={{ input: { inputProps: { max: 99, min: 1 } } }}
                sx={{
                    maxWidth: '4em',
                }}
                type="number"
            />

            <Tooltip arrow placement="top" title="Tambah">
                <span>
                    <IconButton
                        color="success"
                        disabled={isDisabled}
                        onClick={() => {
                            for (let i = 0; i < nRow.current; i++) {
                                push({})
                            }
                        }}
                        size="small">
                        <AddCircleIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}
