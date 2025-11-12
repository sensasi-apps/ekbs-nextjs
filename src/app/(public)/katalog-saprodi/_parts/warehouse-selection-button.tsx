'use client'

// materials
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
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
                exclusive
                onChange={(_, value) => replace(`?warehouse=${value}`)}
                value={warehouse}>
                {Object.values(Warehouse).map(warehouse => (
                    <ToggleButton key={warehouse} value={warehouse}>
                        {warehouse}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </FormControl>
    )
}
