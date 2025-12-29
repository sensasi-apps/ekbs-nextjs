// vendors

// materials
import Autocomplete from '@mui/material/Autocomplete'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import { Field, type FieldProps } from 'formik'
import useSWR from 'swr'
// modules
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'

interface SparePartForSale {
    base_rp_per_unit: number
    margin_percent: number
    default_installment_margin_percentage: number
    default_sell_price: number
    qty: number
    name: string
    spare_part_warehouse_id: number
    spare_part_id: number
}

type OnChangeType = (
    event: React.SyntheticEvent,
    selected: SparePartForSale | null,
) => void

export default function SparePartFormikField({
    name,
    state,
    isDisabled,
    onChange,
}: {
    name: string
    isDisabled?: boolean
    state: SparePart | undefined
    onChange: OnChangeType
}) {
    if (state) {
        return `${state.id} — ${state.name}`
    }

    return (
        <Field
            component={InnerComponent}
            disabled={isDisabled}
            name={name}
            onChange={onChange}
        />
    )
}

function InnerComponent({
    onChange,
    isDisabled,

    field: { name },
    form: { getFieldMeta, status, isSubmitting },
}: Omit<FieldProps<number>, 'meta'> & {
    onChange: OnChangeType
    isDisabled?: boolean
}) {
    const { error, value } = getFieldMeta<number>(name)

    const { data: spareParts = [], isLoading } = useSWR<SparePartForSale[]>(
        'repair-shop/sales/get-spare-part-warehouses',
        null,
        {
            dedupingInterval: 60 * 1000,
        },
    )

    if (isLoading) {
        return <Skeleton variant="rounded" />
    }

    const selectedValue =
        spareParts.find(
            sparePart => sparePart.spare_part_warehouse_id === value,
        ) ?? null

    return (
        <Autocomplete
            disabled={isDisabled || status?.isDisabled || isSubmitting}
            getOptionDisabled={sparePart => sparePart.qty <= 0}
            getOptionLabel={sparePart =>
                `${sparePart.spare_part_id} — ${sparePart.name}`
            }
            isOptionEqualToValue={(option, value) =>
                option.spare_part_warehouse_id === value.spare_part_warehouse_id
            }
            onChange={onChange}
            options={spareParts}
            renderInput={params => (
                <TextField
                    {...params}
                    error={Boolean(error)}
                    helperText={error}
                    label="Suku Cadang"
                    margin="none"
                    required
                />
            )}
            value={selectedValue}
        />
    )
}
