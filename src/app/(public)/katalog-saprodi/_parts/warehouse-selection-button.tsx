'use client'

// vendors
import { useRouter, useSearchParams } from 'next/navigation'
// materials
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
// enums
import Warehouse from '@/modules/farm-inputs/enums/warehouse'

export default function WarehouseSelectionButton() {
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const warehouse = searchParams?.get('warehouse') ?? 'muai'

    return (
        <FormControl margin="normal">
            <FormLabel id="gudang-buttons-group-label">Gudang</FormLabel>

            <ToggleButtonGroup
                aria-labelledby="gudang-buttons-group-label"
                color="primary"
                value={warehouse}
                exclusive
                onChange={(_, value) => replace(`?warehouse=${value}`)}>
                {Object.values(Warehouse).map((warehouse, i) => (
                    <ToggleButton key={i} value={warehouse}>
                        {warehouse}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </FormControl>
    )
}
