// vendors
import useSWR from 'swr'
import { Field, type FieldProps } from 'formik'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
// modules
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'

interface SparePartForSale {
    default_sell_price: number
    default_installment_margin_percentage: number
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
            name={name}
            component={InnerComponent}
            onChange={onChange}
            disabled={isDisabled}
        />
    )
}

function InnerComponent({
    onChange,
    isDisabled,

    field: { name },
    form: { getFieldMeta, status },
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
            isOptionEqualToValue={(option, value) =>
                option.spare_part_warehouse_id === value.spare_part_warehouse_id
            }
            value={selectedValue}
            options={spareParts}
            getOptionDisabled={sparePart => sparePart.qty <= 0}
            disabled={isDisabled || status?.isDisabled}
            getOptionLabel={sparePart =>
                `${sparePart.spare_part_id} — ${sparePart.name}`
            }
            onChange={onChange}
            renderInput={params => (
                <TextField
                    {...params}
                    required
                    label="Suku Cadang"
                    size="small"
                    margin="none"
                    error={Boolean(error)}
                    helperText={error}
                />
            )}
        />
    )
}
