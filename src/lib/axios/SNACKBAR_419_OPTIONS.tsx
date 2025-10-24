import Button from '@mui/material/Button'
import type { OptionsObject } from 'notistack'

const SNACKBAR_419_OPTIONS: OptionsObject<'warning'> = {
    action: () => (
        <Button
            color="inherit"
            onClick={() => location.reload()}
            size="small"
            variant="outlined">
            Segarkan Sekarang
        </Button>
    ),
    persist: true,
    variant: 'warning',
}

export default SNACKBAR_419_OPTIONS
